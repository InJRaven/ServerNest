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
} from '@nestjs/common';
import { GenresService } from '@modules/server/services';
import { GenresDTO } from '@DTO';

@Controller('genres')
export class GenresController {
  constructor(private readonly services: GenresService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllGenres() {
    return await this.services.getAllGenres();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createGenre(@Body() body: GenresDTO) {
    return await this.services.createGenre(body);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  async updateGenre(@Body() body: Array<{ id: string; data: GenresDTO }>) {
    return await this.services.updateGenre(body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteGenre(@Param('id') id: string) {
    return await this.services.deleteGenre(id);
  }
}
