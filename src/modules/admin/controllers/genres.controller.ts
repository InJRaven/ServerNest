import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  HttpCode,
  HttpStatus,
  Get,
  UseGuards,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  Req,
  HttpException,
} from '@nestjs/common';
import { GenresService } from '@core/services';
import { GenresDTO } from '@DTO';
import { AuthorizationGuard, JwtAuthGuard } from '@guards';
import { Request } from 'express';
import { Auth } from '@decorators';

@Controller('genres')
export class GenresController {
  constructor(private readonly services: GenresService) {}
  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllGenres() {
    // const auth = req.auth;
    return await this.services.getAllGenres();
  }
  // @Post()
  // @UseGuards(JwtAuthGuard, AuthorizationGuard)
  // @Auth({ roles: ['admin', 'manager', 'mod'] })
  // @HttpCode(HttpStatus.CREATED)
  // async createGenre(@Body() body: GenresDTO, @Req() req: Request) {
  //   try {
  //     const auth = req.auth;
  //     if (!auth) {
  //       throw new UnauthorizedException({ code: 'NO_AUTH' });
  //     }
  //     return await this.services.createGenre(body);
  //   } catch (error) {
  //     if (
  //       error instanceof UnauthorizedException ||
  //       error instanceof NotFoundException ||
  //       error instanceof HttpException
  //     ) {
  //       throw error;
  //     }
  //     throw new InternalServerErrorException({ code: 'CREATE_GENRE_FAILED' });
  //   }
  // }
  // @UseGuards(JwtAuthGuard, AuthorizationGuard)
  // @Auth({ roles: ['admin', 'manager', 'mod'] })
  // @Put(':id')
  // @HttpCode(HttpStatus.OK)
  // async updateGenre(@Param('id') id: string, @Body() data: GenresDTO) {
  //   return await this.services.updateGenre(id, data);
  // }
  // @UseGuards(JwtAuthGuard, AuthorizationGuard)
  // @Auth({ roles: ['admin', 'manager', 'mod'] })
  // @Delete(':id')
  // @HttpCode(HttpStatus.OK)
  // async softDeleteGenre(@Param('id') id: string) {
  //   return await this.services.softDelete(id);
  // }
}
