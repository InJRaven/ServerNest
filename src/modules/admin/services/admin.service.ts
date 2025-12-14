import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';

import { AdminLoginDTO, RegisterAdminDTO } from '@DTO';
import { AdminRepository } from '@repositories';
import { TokenService } from '@shared';
import { BaseService } from '@base';
import { AdminEntity } from '@entities';
import { AdminMapper } from '@admin/mapper';
import {
  EntityAlreadyExistsException,
  InternalServerException,
  InvalidCredentialsException,
  InvalidOperationException,
  PermissionDeniedException,
  TokenInvalidException,
} from '@exceptions';
import { IApiResponse } from '@interfaces';
import { ResponseUtil } from '@utils';
@Injectable()
class AdminService extends BaseService<AdminEntity> {
  constructor(
    protected readonly repository: AdminRepository,
    protected readonly mapper: AdminMapper,
    private readonly tokens: TokenService,
  ) {
    super(repository, mapper, 'Admin');
  }

  async onModuleInit() {
    const email = 'kuuhaku989898@gmail.com';
    const exists = await this.repository.findOne({ where: { email } });
    if (!exists) {
      const hashed = await bcrypt.hash('123456', 10);
      await this.repository.create({
        username: 'admin',
        email,
        password: hashed,
        email_verified: true,
        roles: 'admin',
        is_super_admin: true,
      });
      console.log('✅ Default admin created');
    } else {
      console.log('ℹ️ Admin already exists');
    }
  }
  async login(data: AdminLoginDTO, req: Request): Promise<IApiResponse> {
    const startTime = this.logger.startTiming();
    try {
      this.logger.step(1, 'Check email  exists', data.email);
      const admin = await this.repository.findOne({
        where: { email: data.email },
      });
      if (!admin) {
        this.logger.notFound('Admin', 'email', data.email);
        throw new InvalidCredentialsException();
      }
      this.logger.step(3, 'Check Password', data.password);
      const isMatch = await bcrypt.compare(data.password, admin.password);
      if (!isMatch) {
        this.logger.auth('LOGIN_FAILED', admin.first_name, admin.roles);
        throw new InvalidCredentialsException();
      }

      this.logger.step(4, 'Create payload');
      const payload = {
        id: admin.id,
        email: admin.email,
        role: admin.roles,
        isSuperAdmin: admin.is_super_admin,
      };

      this.logger.step(5, 'Create payload');
      const accessToken = this.tokens.createAccessToken(payload);
      const refreshToken = this.tokens.createRefreshToken();

      this.logger.step(6, 'Save token to session and redis');
      if (req.session) {
        req.session.userId = admin.id;
        await this.tokens.saveToken(req.sessionID, accessToken, refreshToken);
      }

      const duration = this.logger.endTiming(startTime, 'login successfully');
      this.logger.performance('login', duration);
      console.log('LOGIN SID:', req.sessionID);

      return ResponseUtil.success('Login Successfully', {
        session: {
          access_token: accessToken,
          refresh_token: refreshToken,
        },
      });
    } catch (error) {
      this.logger.error('Failed to login to dashboard', error);
      if (error instanceof InvalidOperationException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to login to dashboard',
        error as Error,
        'AdminServices.login',
      );
    }
  }

  async register(data: RegisterAdminDTO): Promise<IApiResponse> {
    const startTime = this.logger.startTiming();
    try {
      this.logger.step(1, 'Check email exists', data.email);
      const exists = await this.repository.findOne({
        where: { email: data.email },
      });

      if (exists) {
        this.logger.duplicateError('Admin', 'email', data.email);
        throw new EntityAlreadyExistsException('Admin', 'email', data.email);
      }

      this.logger.step(2, 'Hash Password and create id');
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const id = this.generateId();

      this.logger.step(3, 'Create Account');
      const newAdmin = await this.repository.create({
        ...data,
        id,
        password: hashedPassword,
      });
      this.logger.operation('CREATE', 'Admin', newAdmin.id);
      this.logger.step(4, 'Mapping data to DTO');
      const mapData = this.mapper.toResponseDTO(newAdmin);

      const duration = this.logger.endTiming(
        startTime,
        'create account completed',
      );
      this.logger.performance('register', duration);

      return ResponseUtil.created('Registration successful', mapData);
    } catch (error) {
      this.logger.error('Failed to login to dashboard', error);
      if (error instanceof InvalidOperationException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to register account',
        error as Error,
        'AdminServices.register',
      );
    }
  }

  async logout(req: Request): Promise<IApiResponse> {
    const startTime = this.logger.startTiming();

    try {
      this.logger.step(1, 'Check Access Token');
      const header = req.headers.authorization;
      const refreshToken = req.header['x-refresh-token'] || '';
      if (!header || !header.startsWith('Bearer ')) {
        this.logger.notFound('Admin', '', header);
        throw new TokenInvalidException({
          code: 'NO_TOKEN',
          message: 'Missing Bearer token',
        });
      }
      this.logger.step(2, 'Check if the token has expired');
      const accessToken = header.slice(7);
      const exp = (jwt.decode(accessToken) as JwtPayload)?.exp;
      if (exp) {
        this.logger.step(3, 'Save accessToken and refreshToken to blacklist');
        await this.tokens.saveTokenToBlacklist(accessToken, refreshToken, exp);
      }

      this.logger.step(4, 'Destroy Session when logout');
      if (req.session) {
        await new Promise<void>((resolve, reject) => {
          req.session.destroy((err) => {
            if (err) {
              this.logger.error('Failed To Logout', err);
              return reject(
                new InternalServerException(
                  'Failed to logout',
                  err,
                  'AdminService.logout',
                ),
              );
            }

            return resolve();
          });
        });
      }

      const duration = this.logger.endTiming(startTime, 'Logout successful');
      this.logger.performance('logout', duration);
      return ResponseUtil.success('Logout successfully');
    } catch (error) {
      this.logger.error('Logout process failed', error);
      if (error instanceof TokenInvalidException) throw error;
      if (error instanceof InternalServerException) throw error;
      throw new InternalServerException(
        'Logout Failed',
        error,
        'AdminServices.logout',
      );
    }
  }

  async getUser(req: Request): Promise<IApiResponse> {
    const startTime = this.logger.startTiming();
    this.logger.step(1, 'Starting admin context extraction from request');

    try {
      if (!req.auth || !req.auth.id) {
        this.logger.auth(
          'PERMISSION_DENIED',
          'UNKNOWN',
          'Missing Authentication Context In Request',
        );

        this.logger.validationError(
          'req.auth',
          'Authenticated User ID Is Missing In Request',
        );

        const duration = this.logger.endTiming(
          startTime,
          'Failed To Extract User: Missing Authentication Context',
        );
        this.logger.performance('AdminService.getUser', duration);

        throw new TokenInvalidException({
          code: 'AUTH_CONTEXT_MISSING',
          message: 'Authentication context missing. Please log in again.',
        });
      }
      const userId = req.auth.id;

      this.logger.step(2, 'Authentication Context Found', {
        userId,
        email: req.auth.email,
        role: req.auth.roles,
      });

      this.logger.step(3, 'Querying database for user record', userId);
      const user = await this.repository.findOne({
        where: { id: userId },
      });

      if (!user) {
        this.logger.auth(
          'PERMISSION_DENIED',
          userId,
          'User Record Not Found In Database',
        );

        const duration = this.logger.endTiming(
          startTime,
          `Failed to load user context: no user record for ID ${userId}`,
        );
        this.logger.performance('AdminService.getUser', duration);

        throw new PermissionDeniedException({
          code: 'USER_NOT_FOUND',
          message: `No User Exists With ID: ${userId}. User may have been removed.`,
        });
      }

      this.logger.step(4, 'Admin record successfully retrieved', {
        id: user.id,
        email: user.email,
        roles: user.roles,
      });

      const duration = this.logger.endTiming(
        startTime,
        'User successfully resolved from request context',
      );
      this.logger.performance('AdminService.getUser', duration);

      return ResponseUtil.success('Get User Success', {
        user: this.mapper.toResponseDTO(user),
      });
    } catch (error) {
      this.logger.error('Unexpected error while loading user record', error);

      if (error instanceof TokenInvalidException) throw error;
      if (error instanceof PermissionDeniedException) throw error;
      throw new InternalServerException(
        'Failed to retrieve user profile',
        error,
        'AdminService.getUser',
      );
    }
  }
}

export { AdminService };
