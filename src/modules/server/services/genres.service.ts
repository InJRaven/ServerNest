import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { GenresRepository } from '@repositories';
import { GenresDTO } from '@DTO';
import { GenreMapper } from '@modules/server/mapper';

@Injectable()
class GenresService {
  constructor(
    private readonly repository: GenresRepository,
    private readonly mapper: GenreMapper,
  ) {}

  async createGenre(body: GenresDTO): Promise<{
    message: string;
    result: {
      success: number;
      failed: number;
      createdGenres: string[];
      failedGenres: Array<{
        name: string;
        reason: string;
      }>;
    };
  }> {
    const { name, ...rest } = body;
    const result: {
      success: number;
      failed: number;
      createdGenres: string[];
      failedGenres: Array<{ name: string; reason: string }>;
    } = {
      success: 0,
      failed: 0,
      createdGenres: [],
      failedGenres: [],
    };
    const formatNames = name
      .split(',')
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
    if (formatNames.length === 0) {
      throw new BadRequestException('Please provide at least one genre name');
    }

    for (const name of formatNames) {
      try {
        const existingGenre = await this.repository.findByName(name);
        if (existingGenre) {
          result.failed++;
          result.failedGenres.push({
            name: name,
            reason: `Already exists as '${existingGenre.name}'`,
          });
          continue;
        }

        await this.repository.createGenre({ name, ...rest });

        result.success++;
        result.createdGenres.push(name);
      } catch (error) {
        result.failed++;
        result.failedGenres.push({
          name: name,
          reason: error.message || 'Unknown error',
        });
      }
    }
    const message =
      result.failed > 0
        ? `Created ${result.success} genre(s) successfully. ${result.failed} failed`
        : `Created ${result.success} genre(s) successfully`;
    return {
      message,
      result,
    };
  }

  async updateGenre(
    updates: Array<{ id: string; data: GenresDTO }>,
  ): Promise<{ message: string; result: object }> {
    const updatePromises = updates.map(async ({ id, data }) => {
      try {
        const existingGenre = await this.repository.findById(id);
        if (!existingGenre) {
          throw new NotFoundException(`Genre with ID '${id}' not found`);
        }

        const updated = await this.repository.updateGenre(id, data);

        if (!updated) {
          throw new NotFoundException(`Genre with ID '${id}' not found`);
        }
        return { id, success: true };
      } catch (error) {
        return { id, success: false, error: error.message };
      }
    });
    const details = await Promise.all(updatePromises);
    const successCount = details.filter((d) => d.success).length;
    const failedCount = details.length - successCount;
    return {
      message: `Updated ${successCount}/${details.length} genres successfully`,
      result: { updated: successCount, failed: failedCount, details },
    };
  }

  async deleteGenre(id: string): Promise<{ message: string }> {
    const genre = await this.repository.findById(id);
    if (!genre) {
      throw new NotFoundException(`Genre with ID '${id}' not found`);
    }

    const deleted = await this.repository.deleteGenre(id);

    if (!deleted) {
      throw new NotFoundException(`Genre with ID '${id}' not found`);
    }

    return {
      message: `Genre '${genre.name}' has been deleted successfully`,
    };
  }

  async getAllGenres() {
    const genres = await this.repository.findAll();
    return this.mapper.toListResponseDtoList(genres);
  }
}

export { GenresService };
