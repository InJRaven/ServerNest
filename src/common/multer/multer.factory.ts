import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { MulterProfiles } from './multer.profile';
import { FileInterceptor } from '@nestjs/platform-express';
import { Reflector } from '@nestjs/core';
import { MULTER_PROFILE_KEY, MulterProfileType } from '@decorators';

@Injectable()
export class MulterFactory implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly multerProfiles: MulterProfiles,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    const profile = this.reflector.get<MulterProfileType>(
      MULTER_PROFILE_KEY,
      context.getHandler(),
    );
    const req = context.switchToHttp().getRequest();
    console.log('[MULTER] before', req.file);
    if (!profile) {
      // route không dùng multer
      return next.handle();
    }

    const interceptorClassMap: Record<
      MulterProfileType,
      new () => NestInterceptor
    > = {
      [MulterProfileType.IMPORT]: FileInterceptor(
        'file',
        this.multerProfiles.importProfile(),
      ),
      [MulterProfileType.AUDIO]: FileInterceptor(
        'file',
        this.multerProfiles.audioProfile(),
      ),
      [MulterProfileType.IMAGE]: FileInterceptor(
        'file',
        this.multerProfiles.imageProfile(),
      ),
    };

    const InterceptorClass = interceptorClassMap[profile];

    const interceptorInstance = new InterceptorClass();

    return interceptorInstance.intercept(context, next);
  }
}
