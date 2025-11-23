import { Repository } from 'typeorm';
import { AlbumGenresEntity } from '@entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
interface IAlbumGenreRepository {
  exists(albumId: string, genreId: string): Promise<boolean>;
  addGenreToAlbum(
    albumId: string,
    genreId: string,
    isPrimary?: boolean,
    weight?: number,
  ): Promise<AlbumGenresEntity>;
  removeGenreFromAlbum(albumId: string, genreId: string): Promise<boolean>;
  findByAlbumId(albumId: string): Promise<AlbumGenresEntity[]>;
  findByGenreId(genreId: string): Promise<AlbumGenresEntity[]>;
  setPrimaryGenre(albumId: string, genreId: string): Promise<boolean>;
  updateWeight(
    albumId: string,
    genreId: string,
    weight: number,
  ): Promise<boolean>;
  syncAlbumGenres(
    albumId: string,
    genres: Array<{ genreId: string; isPrimary?: boolean; weight?: number }>,
  ): Promise<void>;
}

@Injectable()
class AlbumGenreRepository implements IAlbumGenreRepository {
  constructor(
    @InjectRepository(AlbumGenresEntity)
    private readonly repository: Repository<AlbumGenresEntity>,
  ) {}
  async exists(albumId: string, genreId: string): Promise<boolean> {
    return (
      (await this.repository.findOne({
        where: { album_id: albumId, genre_id: genreId },
      })) !== null
    );
  }

  async addGenreToAlbum(
    albumId: string,
    genreId: string,
    isPrimary?: boolean,
    weight?: number,
  ): Promise<AlbumGenresEntity> {
    const exists = await this.exists(albumId, genreId);
    if (exists) {
      throw new Error('Genre already added to this album');
    }

    if (isPrimary) {
      await this.repository.update(
        { album_id: albumId },
        { is_primary: false },
      );
    }
    return await this.repository.save({
      album_id: albumId,
      genre_id: genreId,
      is_primary: isPrimary,
      weight: weight || 50,
    });
  }

  async removeGenreFromAlbum(
    albumId: string,
    genreId: string,
  ): Promise<boolean> {
    const result = await this.repository.delete({
      album_id: albumId,
      genre_id: genreId,
    });
    return (result.affected || 0) > 0;
  }

  async findByAlbumId(albumId: string): Promise<AlbumGenresEntity[]> {
    return await this.repository.find({
      where: { album_id: albumId },
      relations: ['genre'],
      order: {
        is_primary: 'DESC',
        weight: 'DESC',
      },
    });
  }

  async findByGenreId(genreId: string): Promise<AlbumGenresEntity[]> {
    return await this.repository.find({
      where: { genre_id: genreId },
      relations: ['album', 'album.artist'],
      order: {
        is_primary: 'DESC',
        weight: 'DESC',
      },
    });
  }

  async setPrimaryGenre(albumId: string, genreId: string): Promise<boolean> {
    // First, unset all primary genres for this album
    await this.repository.update({ album_id: albumId }, { is_primary: false });

    // Then set the new primary genre
    const result = await this.repository.update(
      {
        album_id: albumId,
        genre_id: genreId,
      },
      { is_primary: true },
    );

    return (result.affected || 0) > 0;
  }

  async updateWeight(
    albumId: string,
    genreId: string,
    weight: number,
  ): Promise<boolean> {
    const result = await this.repository.update(
      {
        album_id: albumId,
        genre_id: genreId,
      },
      { weight },
    );
    return (result.affected || 0) > 0;
  }

  async syncAlbumGenres(
    albumId: string,
    genres: Array<{ genreId: string; isPrimary?: boolean; weight?: number }>,
  ): Promise<void> {
    await this.repository.delete({ album_id: albumId });

    // Add new genres
    if (genres.length > 0) {
      const albumGenres = genres.map((genre) =>
        this.repository.create({
          album_id: albumId,
          genre_id: genre.genreId,
          is_primary: genre.isPrimary || false,
          weight: genre.weight || 50,
        }),
      );
      await this.repository.save(albumGenres);
    }
  }
}

export { AlbumGenreRepository };
