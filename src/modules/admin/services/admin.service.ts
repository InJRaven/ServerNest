import { Request } from 'express';
import bcrypt from 'bcrypt';
import { BaseService } from '@base';
import { AdminMapper } from '@AdminMapper';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  InternalServerException,
  InvalidOperationException,
  PermissionDeniedException,
  TokenInvalidException,
} from '@exceptions';
import { IApiResponse } from '@interfaces';
import { ResponseUtil } from '@utils';
import { Admin } from '@AdminEntities';
import {
  AdminRepository,
  AdminRoleAssignmentRepository,
  AdminRoleRepository,
} from '@AdminRepositories';
import { AdminDTO } from '@AdminDTOs';
import { Injectable } from '@nestjs/common';
@Injectable()
class AdminService extends BaseService<Admin> {
  constructor(
    protected readonly admins: AdminRepository,
    protected readonly mapper: AdminMapper,

    protected readonly roles: AdminRoleRepository,
    protected readonly assignmentRepository: AdminRoleAssignmentRepository,
  ) {
    super(admins, mapper, 'Admin');
  }

  async onModuleInit(): Promise<void> {
    const superAdminData = {
      username: 'admin',
      email: 'kuuhaku989898@gmail.com',
      password: '123456',
      verified: true,
    };
    const exists = await this.admins.findOne({
      where: { email: 'kuuhaku989898@gmail.com' },
    });
    const adminCount = await this.admins.count();
    if (adminCount > 0) {
      this.logger.log(`Found ${adminCount} admins → skipping super admin seed`);
      return;
    }

    this.logger.log('No admins found → creating first super admin');
    if (!exists) {
      const hashed = await bcrypt.hash(superAdminData.password, 10);

      this.logger.log(`Assign System Admin role to super admin`);
      const role = await this.roles.findOne({
        where: { identify: 'system_admin' },
      });
      if (role === null) {
        return;
      }

      const createFirstAdmin = await this.admins.create({
        ...superAdminData,
        password: hashed,
        firstName: 'System',
        lastName: 'Root',
      });

      this.logger.log(
        `Created first super admin: ${superAdminData.username} (id: ${createFirstAdmin.id})`,
      );
      await this.assignmentRepository.create({
        admin: createFirstAdmin,
        role,
        assignedAt: new Date(),
      });
      this.logger.log('✅ Default admin created');
    } else {
      this.logger.log('ℹ️ Admin already exists');
    }
  }
  async createAdmin(data: AdminDTO, createdBy: Admin): Promise<IApiResponse> {
    const startTime = this.logger.startTiming();
    this.logger.log(
      `Creating new admin - username: ${data.username}, email: ${data.email}, by: ${createdBy.username}`,
    );
    try {
      this.logger.step(1, 'Check email exists', data.email);
      const existsEmail = await this.admins.findOne({
        where: { email: data.email },
      });

      if (existsEmail) {
        this.logger.duplicateError('Admin', 'email', data.email);
        throw new EntityAlreadyExistsException(
          'Admin',
          'email',
          data.email,
          'DUPLICATE_USERNAME_OR_EMAIL',
        );
      }

      this.logger.step(2, 'Check email exists', data.email);
      const existsUserName = await this.admins.findOne({
        where: { username: data.username },
      });
      if (existsUserName) {
        this.logger.duplicateError('Admin', 'username', data.username);
        throw new EntityAlreadyExistsException(
          'Admin',
          'username',
          data.username,
          'DUPLICATE_USERNAME_OR_EMAIL',
        );
      }

      this.logger.step(3, 'Check Roles Exists', data.roles);
      const role = await this.roles.findOne({
        where: { name: data.roles },
      });

      if (role === null) {
        this.logger.notFound('AdminRole', 'name', data.roles);
        throw new EntityNotFoundException(
          'AdminRole',
          data.roles,
          'ROLE_NOT_FOUND',
        );
      }

      this.logger.step(4, 'Hash Password and create ID');
      const hashedPassword = await bcrypt.hash(data.password, 10);
      const id = this.generateId();

      this.logger.step(5, 'Create Admin');
      const newAdmin = await this.admins.create({
        ...data,
        id,
        password: hashedPassword,
      });

      this.logger.step(6, 'Save To AdminRoleAssignment');
      await this.assignmentRepository.create({
        id: this.generateId(),
        admin: newAdmin,
        role,
        assignedBy: createdBy || null,
        assignedAt: new Date(),
      });

      this.logger.step(7, 'Mapping Data');
      const mapData = this.mapper.toResponseDTO(newAdmin);

      const duration = this.logger.endTiming(
        startTime,
        'Create Admin Completed',
      );
      this.logger.operation('CREATE', 'admin', newAdmin);
      this.logger.performance('createAdmin', duration);
      return ResponseUtil.created('Admin created successfully', mapData);
    } catch (error) {
      this.logger.error('Failed to create admin batch', error);
      if (
        error instanceof InvalidOperationException ||
        error instanceof EntityAlreadyExistsException ||
        error instanceof EntityNotFoundException
      ) {
        throw error;
      }

      throw new InternalServerException(
        'Failed to create admin batch',
        error as Error,
        'AdminService.createAdmin',
      );
    }
  }

  async getMe(req: Request): Promise<IApiResponse> {
    const startTime = this.logger.startTiming();
    try {
      if (!req.user || !req.user.id) {
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
      const userId = req.user.id;

      this.logger.step(2, 'Authentication Context Found', {
        userId,
        email: req.user.email,
        role: req.user.role,
      });

      this.logger.step(3, 'Querying database for user record', userId);
      const user = await this.repository.findOne({
        where: { id: userId },
        relations: {
          roleAssignments: {
            role: true,
          },
        },
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
        'AdminService.getMe',
      );
    }
  }
}

//  extends BaseService<AdminEntity> {
//   constructor(
//     protected readonly repository: AdminRepository,
//     protected readonly mapper: AdminMapper,
//   ) {
//     super(repository, mapper, 'Admin');
//   }
//   async getUser(req: Request): Promise<IApiResponse> {
//     const startTime = this.logger.startTiming();
//     this.logger.step(1, 'Starting admin context extraction from request');

//     try {
//       if (!req.auth || !req.auth.id) {
//         this.logger.auth(
//           'PERMISSION_DENIED',
//           'UNKNOWN',
//           'Missing Authentication Context In Request',
//         );

//         this.logger.validationError(
//           'req.auth',
//           'Authenticated User ID Is Missing In Request',
//         );

//         const duration = this.logger.endTiming(
//           startTime,
//           'Failed To Extract User: Missing Authentication Context',
//         );
//         this.logger.performance('AdminService.getUser', duration);

//         throw new TokenInvalidException({
//           code: 'AUTH_CONTEXT_MISSING',
//           message: 'Authentication context missing. Please log in again.',
//         });
//       }
//       const userId = req.auth.id;

//       this.logger.step(2, 'Authentication Context Found', {
//         userId,
//         email: req.auth.email,
//         role: req.auth.roles,
//       });

//       this.logger.step(3, 'Querying database for user record', userId);
//       const user = await this.repository.findOne({
//         where: { id: userId },
//       });

//       if (!user) {
//         this.logger.auth(
//           'PERMISSION_DENIED',
//           userId,
//           'User Record Not Found In Database',
//         );

//         const duration = this.logger.endTiming(
//           startTime,
//           `Failed to load user context: no user record for ID ${userId}`,
//         );
//         this.logger.performance('AdminService.getUser', duration);

//         throw new PermissionDeniedException({
//           code: 'USER_NOT_FOUND',
//           message: `No User Exists With ID: ${userId}. User may have been removed.`,
//         });
//       }

//       this.logger.step(4, 'Admin record successfully retrieved', {
//         id: user.id,
//         email: user.email,
//         roles: user.roles,
//       });

//       const duration = this.logger.endTiming(
//         startTime,
//         'User successfully resolved from request context',
//       );
//       this.logger.performance('AdminService.getUser', duration);

//       return ResponseUtil.success('Get User Success', {
//         user: this.mapper.toResponseDTO(user),
//       });
//     } catch (error) {
//       this.logger.error('Unexpected error while loading user record', error);

//       if (error instanceof TokenInvalidException) throw error;
//       if (error instanceof PermissionDeniedException) throw error;
//       throw new InternalServerException(
//         'Failed to retrieve user profile',
//         error,
//         'AdminService.getUser',
//       );
//     }
//   }
// }

export { AdminService };
