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
} from '@nestjs/common';
import { GenresService } from '@core/services';
import { GenresDTO } from '@DTO';
import { JwtAuthGuard } from '@guards';
import { Request } from 'express';

@Controller('genres')
export class GenresController {
  constructor(private readonly services: GenresService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllGenres() {
    return await this.services.getAllGenres();
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createGenre(@Body() body: GenresDTO, @Req() req: Request) {
    try {
      const auth = req.auth;
      if (!auth) {
        throw new UnauthorizedException({ code: 'NO_AUTH' });
      }
      return await this.services.createGenre(body);
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException({ code: 'GET_HELLO_FAILED' });
    }
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateGenre(@Param('id') id: string, @Body() data: GenresDTO) {
    return await this.services.updateGenre(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteGenre(@Param('id') id: string) {
    return await this.services.hardDelete(id);
  }
}
