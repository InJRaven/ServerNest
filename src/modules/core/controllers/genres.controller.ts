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
  Req,
  Query,
} from '@nestjs/common';
import { AuthorizationGuard, JwtAuthGuard } from '@guards';
import { Request } from 'express';
import { Auth } from '@decorators';
import { GenreDTO } from '@CoreDTOs';
import { GenresService } from '@CoreServices';
import { FindManyOptions } from 'typeorm';
import { Genre } from '@CoreEntities';

@Controller('genres')
export class GenresController {
  constructor(private readonly services: GenresService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getAllGenres(
    @Req() req: Request,
    @Query('limit') limit = 10,
    @Query('offset') offset = 0,
  ) {
    const isSuperAdmin = req.user?.isSuperAdmin;
    const options: FindManyOptions<Genre> = {
      where: isSuperAdmin ? {} : { isDeleted: false },
      order: {
        name: 'ASC',
      },
    };
    return this.services.getAllGenres(limit, offset, options);
  }
  @Post()
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Auth({
    roles: ['Admin', 'Manager', 'Moderator'],
    allowSuperAdminBypass: true,
  })
  @HttpCode(HttpStatus.CREATED)
  async createGenre(@Body() data: GenreDTO) {
    return await this.services.createGenre(data);
  }
  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Auth({
    roles: ['Admin', 'Manager', 'Moderator'],
    allowSuperAdminBypass: true,
  })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async updateGenre(@Param('id') id: string, @Body() data: GenreDTO) {
    return await this.services.updateGenre(id, data);
  }

  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Auth({
    roles: ['Admin', 'Manager'],
    allowSuperAdminBypass: true,
  })
  @Put('soft-delete/:id')
  @HttpCode(HttpStatus.OK)
  async softDeleteGenre(@Param('id') id: string) {
    return await this.services.softDelete(id);
  }

  @UseGuards(JwtAuthGuard, AuthorizationGuard)
  @Auth({
    roles: ['System Admin'],
    allowSuperAdminBypass: true,
  })
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async hardDeleteGenre(@Param('id') id: string) {
    return await this.services.hardDelete(id);
  }
}
