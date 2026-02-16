import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MulterFactory } from '../../../common/multer';
import { QuizServices } from '@public/services';
import { MulterProfileType, UseMulterProfile } from '@decorators';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('')
export class QuizControllers {
  constructor(private readonly services: QuizServices) {}

  @Post('import-quiz')
  @UseMulterProfile(MulterProfileType.IMPORT)
  @UseInterceptors(MulterFactory)
  async CreateQuiz(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return this.services.createQuizWithFile(file);
  }

  @Post('debug')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file: Express.Multer.File) {
    console.log('FILE RECEIVED:', file);
    return {
      received: !!file,
      file,
    };
  }
}
