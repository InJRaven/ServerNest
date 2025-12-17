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
  TokenInvalidException,
} from '@exceptions';
import { IApiResponse } from '@interfaces';
import { ResponseUtil } from '@utils';

@Injectable()
class AuthenticationService extends BaseService<AdminEntity> {
  constructor(
    protected readonly repository: AdminRepository,
    protected readonly mapper: AdminMapper,
    private readonly tokens: TokenService,
  ) {
    super(repository, mapper, 'Authentication');
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
      this.logger.step(1, 'Check email exists', data.email);
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
        'AuthenticationService.login',
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
        'AuthenticationService.register',
      );
    }
  }

  async logout(req: Request): Promise<IApiResponse> {
    const startTime = this.logger.startTiming();
    try {
      this.logger.step(1, 'Check Access Token');
      const header = req.headers.authorization;
      const refreshToken = req.headers['x-refresh-token'] as string;
      if (!header || !header.startsWith('Bearer ')) {
        this.logger.notFound('Admin', '', header);
        throw new TokenInvalidException({
          code: 'NO_ACCESS_TOKEN',
          message: 'Missing Bearer token',
        });
      }

      this.logger.step(2, 'Check Refresh Token');
      if (!refreshToken) {
        this.logger.notFound('TOKEN', '', refreshToken);
        throw new TokenInvalidException({
          code: 'NO_REFRESH_TOKEN',
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
                  'AuthenticationService.logout',
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
        'AuthenticationService.logout',
      );
    }
  }

  async refresh(req: Request): Promise<IApiResponse> {
    const startTime = this.logger.startTiming();
    this.logger.log('Start Update Token Pair');
    try {
      this.logger.step(1, 'Check Access Token');
      const header = req.headers.authorization;
      const refreshToken = req.headers['x-refresh-token'] as string;
      if (!header || !header.startsWith('Bearer ')) {
        this.logger.validationError(
          'authorization',
          'Missing Or Malformed Bearer Token',
        );

        this.logger.auth('PERMISSION_DENIED', 'UNKNOWN', 'Bearer Token');
        const duration = this.logger.endTiming(
          startTime,
          'Missing access token)',
        );
        this.logger.performance('refresh', duration);
        throw new TokenInvalidException({
          code: 'NO_TOKEN',
          message: 'Missing Bearer token',
        });
      }

      this.logger.step(2, 'Check Refresh Token');
      if (!refreshToken) {
        this.logger.validationError('refreshToken', 'Missing Refresh Token');
        this.logger.auth('PERMISSION_DENIED', 'UNKNOWN', 'Refresh Token');
        const duration = this.logger.endTiming(
          startTime,
          'Missing Refresh token)',
        );
        this.logger.performance('refresh', duration);
        throw new TokenInvalidException({
          code: 'NO_TOKEN',
          message: 'Missing Bearer token',
        });
      }

      /** =========================
        /*  CHECK REFRESH TOKEN STATUS  
        /* ========================= */
      this.logger.step(3, 'Checking refresh token blacklist');
      const isRefreshBlacklisted = await this.tokens.isTokenBlacklisted(
        refreshToken,
        'refreshToken',
      );

      if (isRefreshBlacklisted) {
        this.logger.auth(
          'TOKEN_INVALID',
          'UNKNOWN',
          'Refresh Token Blacklisted',
        );

        const duration = this.logger.endTiming(
          startTime,
          'Refresh blacklisted',
        );
        this.logger.performance('refresh', duration);

        throw new TokenInvalidException({
          code: 'REFRESH_TOKEN_BLACKLISTED',
          message: 'Refresh token is blacklisted, please login again.',
        });
      }

      /** ============================
      /*  VALIDATE TOKEN PAIR IN REDIS 
      /* =============================*/
      this.logger.step(4, 'Fetching session token pair from Redis');
      const oldTokens = await this.tokens.getTokens(req.sessionID);
      console.log('REFRESH SID:', req.sessionID);
      if (!oldTokens) {
        this.logger.auth(
          'TOKEN_INVALID',
          'UNKNOWN',
          'Missing redis token pair',
        );

        const duration = this.logger.endTiming(
          startTime,
          'Authorization failed (no redis tokens)',
        );
        this.logger.performance('refresh', duration);

        throw new TokenInvalidException({
          code: 'NO_SESSION_TOKENS',
          message: 'No Tokens In Redis Session, Please Login Again.',
        });
      }

      const accessToken = header.slice(7);

      console.log('Check Old Token', oldTokens);
      if (
        oldTokens.accessToken !== accessToken ||
        oldTokens.refreshToken !== refreshToken
      ) {
        console.log('⚠ COMPARE POINT');
        console.log('old access:', oldTokens.accessToken);
        console.log('req access:', accessToken);

        console.log('old refresh:', oldTokens.refreshToken);
        console.log('req refresh:', refreshToken);

        console.log('access !== ?', oldTokens.accessToken !== accessToken);
        console.log('refresh !== ?', oldTokens.refreshToken !== refreshToken);
        this.logger.auth('TOKEN_INVALID', 'UNKNOWN', 'Token Pair Mismatch');

        const duration = this.logger.endTiming(
          startTime,
          'Pair Token Mismatch',
        );
        this.logger.performance('refresh', duration);

        throw new TokenInvalidException({
          code: 'TOKEN_MISMATCH',
          message: 'Token Pair Mismatch, Please Login Again.',
        });
      }

      /** =========================
      /*  ISSUE NEW TOKEN PAIR
      /* ========================== */
      this.logger.step(5, 'Issuing new token pair');

      const oldPayload = jwt.decode(accessToken) as JwtPayload;
      const newAccessToken = this.tokens.createAccessToken({
        id: oldPayload.id,
        email: oldPayload.email,
        role: oldPayload.role,
        isSuperAdmin: oldPayload.isSuperAdmin,
      });

      const newRefreshToken = this.tokens.createRefreshToken();

      /** Save new token pair to Redis and update accessToken in Session */
      this.logger.step(
        6,
        'Save New Token Pair To Redis And Update accessToken in Session',
      );
      await this.tokens.saveToken(
        req.sessionID,
        newAccessToken,
        newRefreshToken,
      );

      req.auth = {
        id: oldPayload.userId,
        email: oldPayload.email,
        roles: oldPayload.role,
        isSuperAdmin: oldPayload.isSuperAdmin === true,
      };

      this.logger.operation('UPDATE', 'TokenPair', {
        sessionID: req.sessionID,
      });

      const duration = this.logger.endTiming(
        startTime,
        'Authorization success (token refreshed)',
      );
      this.logger.performance('refresh', duration);
      return ResponseUtil.success('Refresh Success', {
        session: {
          access_token: newAccessToken,
          refresh_token: newRefreshToken,
        },
      });
    } catch (error) {
      this.logger.error('Refresh process failed', error);
      if (error instanceof TokenInvalidException) throw error;
      throw new InternalServerException(
        'Refresh Failed',
        error,
        'AuthenticationService.refresh',
      );
    }
  }
}

export { AuthenticationService };
