import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { AdminRepository } from '@repositories';
import { BaseService } from '@base';
import { AdminEntity } from '@entities';
import { AdminMapper } from '@admin/mapper';
import {
  InternalServerException,
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
  ) {
    super(repository, mapper, 'Admin');
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
