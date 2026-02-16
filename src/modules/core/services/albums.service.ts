import { Injectable } from '@nestjs/common';
import { ResponseUtil, LoggerUtil } from '@utils';
import { IApiResponse } from '@interfaces';
import {
  EntityNotFoundException,
  EntityAlreadyExistsException,
  InternalServerException,
  InvalidOperationException,
} from '@exceptions';
import { FindManyOptions } from 'typeorm';

@Injectable()
class AlbumsService {
  // private readonly logger: LoggerUtil;
  // constructor(
  //   private readonly repository: AlbumsRepository,
  //   private readonly mapper: AlbumMapper,
  // ) {
  //   this.logger = new LoggerUtil(AlbumsService.name);
  // }
  // async getAllAlbum(
  //   limit: number = 10,
  //   offset: number = 0,
  //   options?: FindManyOptions<AlbumsEntity>,
  // ): Promise<IApiResponse> {
  //   const startTime = this.logger.startTiming();
  //   this.logger.step(1, 'BEGIN: Get all albums', { limit, offset });
  //   this.logger.debug(`Request: limit=${limit}, offset=${offset}`);
  //   try {
  //     this.logger.step(2, 'Validate pagination params');
  //     this.logger.debug(`Validation passed: limit=${limit}, offset=${offset}`);
  //     if (limit < 1) {
  //       this.logger.validationError('limit', 'Must be >= 1', limit);
  //       throw new InvalidOperationException('Limit must be >= 1');
  //     }
  //     if (offset < 0) {
  //       this.logger.validationError('offset', 'Must be >= 0', offset);
  //       throw new InvalidOperationException('Offset must be >= 0');
  //     }
  //     this.logger.step(3, 'Call repository.findAllPagination');
  //     const result = await this.repository.findAllPagination(
  //       limit,
  //       offset,
  //       options,
  //     );
  //     const data = result.data;
  //     const meta = result.meta;
  //     this.logger.debug(
  //       `Repository returned: ${data.length}/${meta.total} albums`,
  //     );
  //     this.logger.step(4, `Map ${data.length} albums to DTO`);
  //     const mapData = this.mapper.toListResponseDTOList(data);
  //     const response = ResponseUtil.success(
  //       `Repository returned: ${data.length}/${meta.total} albums`,
  //       mapData,
  //     );
  //     this.logger.debug(`Mapping completed: ${mapData.length} DTOs created`);
  //     const duration = this.logger.endTiming(
  //       startTime,
  //       'getAllAlbums completed',
  //     );
  //     this.logger.performance('getAllAlbums', duration);
  //     return {
  //       ...response,
  //       meta,
  //     };
  //   } catch (error) {
  //     this.logger.error('Error getting all albums', error as Error);
  //     if (error instanceof EntityNotFoundException) throw error;
  //     throw new InternalServerException(
  //       'Failed to fetch all albums',
  //       error as Error,
  //       'GenresService.getAllAlbum',
  //     );
  //   }
  // }
  // async getAlbumsByGenre(
  //   genre: string,
  //   limit: number = 10,
  //   offset: number,
  //   options: FindManyOptions<AlbumsEntity>,
  // ): Promise<IApiResponse> {
  //   const startTime = this.logger.startTiming();
  //   this.logger.step(1, 'Get albums by genre', { genre, limit, offset });
  //   this.logger.debug(
  //     `Request: genre='${genre}', limit=${limit}, offset=${offset}`,
  //   );
  //   try {
  //     this.logger.step(2, 'Validate genre parameter');
  //     if (!genre || genre.trim().length === 0) {
  //       this.logger.validationError('genre', 'Genre is required', genre);
  //       throw new InvalidOperationException('Genre is required');
  //     }
  //     this.logger.step(3, 'Validate pagination parameters');
  //     if (limit < 1) {
  //       this.logger.validationError('limit', 'Must be >= 1', limit);
  //       throw new InvalidOperationException('Limit must be >= 1');
  //     }
  //     if (offset < 0) {
  //       this.logger.validationError('offset', 'Must be >= 0', offset);
  //       throw new InvalidOperationException('Offset must be >= 0');
  //     }
  //     this.logger.debug(
  //       `Pagination validated: limit=${limit}, offset=${offset}, page=${Math.floor(offset / limit)}`,
  //     );
  //     this.logger.step(4, 'Call repository.getAlbumsByGenre');
  //     const result = await this.repository.getAlbumsByGenre(
  //       genre,
  //       limit,
  //       offset,
  //       options,
  //     );
  //     const data = result.data;
  //     const meta = result.meta;
  //     this.logger.database('SELECT', 'albums', data.length);
  //     this.logger.debug(
  //       `Query result: ${data.length} albums from ${meta.total} total (page ${Math.floor(offset / limit)} of ${meta.totalPages})`,
  //     );
  //     this.logger.step(5, 'Check query results');
  //     if (meta.total === 0) {
  //       this.logger.debug(`No albums found for genre: '${genre}'`);
  //     } else if (data.length === 0) {
  //       this.logger.debug(
  //         `Total albums exist (${meta.total}) but page ${Math.floor(offset / limit)} is empty`,
  //       );
  //     } else {
  //       this.logger.debug(
  //         `Found ${data.length} albums on page ${Math.floor(offset / limit)}`,
  //       );
  //     }
  //     this.logger.step(6, `Map ${data.length} entities to DTOs`);
  //     const mapData = this.mapper.toListResponseDTOList(data);
  //     const response = ResponseUtil.success(
  //       `Retrieved ${mapData.length} albums | Total: ${meta.total}`,
  //       mapData,
  //     );
  //     this.logger.debug(
  //       `DTO mapping completed: ${mapData.length} DTOs created`,
  //     );
  //     const duration = this.logger.endTiming(
  //       startTime,
  //       `getAlbumsByGenre('${genre}') completed`,
  //     );
  //     this.logger.performance('getAlbumsByGenre', duration);
  //     return {
  //       ...response,
  //       meta,
  //     };
  //   } catch (error) {
  //     this.logger.error(
  //       `Error getting albums by genre: '${genre}'`,
  //       error as Error,
  //     );
  //     if (error instanceof EntityNotFoundException) throw error;
  //     throw new InternalServerException(
  //       'Failed to get albums by genre',
  //       error as Error,
  //       'AlbumsService.getAlbumsByGenre',
  //     );
  //   }
  // }
  // async getAlbumById(
  //   id: string,
  //   options?: FindManyOptions<AlbumsEntity>,
  // ): Promise<IApiResponse> {
  //   try {
  //     this.logger.step(1, 'Finding album by ID', { id });
  //     const album = await this.repository.findOne({
  //       ...options,
  //       where: { id, ...(options?.where ?? {}) },
  //     });
  //     if (!album) {
  //       this.logger.notFound('Albums', 'id', id);
  //       throw new EntityNotFoundException('Albums', id);
  //     }
  //     this.logger.operation('READ', 'Album', { id });
  //     const res = this.mapper.toResponseDTO(album);
  //     return ResponseUtil.success('Album found', res);
  //   } catch (error) {
  //     this.logger.error('Failed to get album by ID', error as Error);
  //     if (error instanceof EntityNotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerException(
  //       'Failed to get album',
  //       error as Error,
  //       'AlbumsService.getAlbumById',
  //     );
  //   }
  // }
  // async getAlbumsByArtistId(
  //   artistId: string,
  //   limit: number = 10,
  //   offset: number = 0,
  //   options?: FindManyOptions<AlbumsEntity>,
  // ): Promise<IApiResponse> {
  //   const startTime = this.logger.startTiming();
  //   this.logger.step(1, 'Get albums by artist', { artistId, limit, offset });
  //   this.logger.debug(
  //     `Request: artistId='${artistId}', limit=${limit}, offset=${offset}`,
  //   );
  //   try {
  //     this.logger.step(2, 'Validate artist ID');
  //     if (!artistId) {
  //       this.logger.validationError(
  //         'artistId',
  //         'Artist ID is required',
  //         artistId,
  //       );
  //       throw new InvalidOperationException('Artist ID is required');
  //     }
  //     this.logger.step(3, 'Validate pagination parameters');
  //     if (limit < 1) {
  //       this.logger.validationError('limit', 'Must be >= 1', limit);
  //       throw new InvalidOperationException('Limit must be >= 1');
  //     }
  //     if (offset < 0) {
  //       this.logger.validationError('offset', 'Must be >= 0', offset);
  //       throw new InvalidOperationException('Offset must be >= 0');
  //     }
  //     this.logger.debug(
  //       `Pagination validated: limit=${limit}, offset=${offset}, page=${Math.floor(offset / limit)}`,
  //     );
  //     this.logger.step(4, 'Call repository.findAllPagination');
  //     const result = await this.repository.findAllPagination(limit, offset, {
  //       where: {
  //         artist_id: artistId,
  //         is_deleted: false,
  //       },
  //       order: { release_date: 'DESC' },
  //       ...options,
  //     });
  //     const data = result.data;
  //     const meta = result.meta;
  //     this.logger.database('SELECT', 'albums', meta.total);
  //     this.logger.debug(
  //       `Repository returned: ${data.length}/${meta.total} albums`,
  //     );
  //     this.logger.step(5, `Map ${data.length} albums to DTO`);
  //     const mapData = this.mapper.toListResponseDTOList(data);
  //     const response = ResponseUtil.success(
  //       `Repository returned: ${data.length}/${meta.total} albums`,
  //       mapData,
  //     );
  //     this.logger.debug(`Mapping completed: ${mapData.length} DTOs created`);
  //     const duration = this.logger.endTiming(
  //       startTime,
  //       'Get albums by artist id completed',
  //     );
  //     this.logger.performance('getAlbumByArtistId', duration);
  //     return {
  //       ...response,
  //       meta,
  //     };
  //   } catch (error) {
  //     this.logger.error('Failed to get albums by artist id', error as Error);
  //     throw new InternalServerException(
  //       'Failed to get albums by artist id',
  //       error as Error,
  //       'GenresService.getAlbumsByArtistId',
  //     );
  //   }
  // }
  // async getAlbumBySlug(
  //   slug: string,
  //   options?: FindManyOptions<AlbumsEntity>,
  // ): Promise<IApiResponse> {
  //   try {
  //     this.logger.step(1, 'Finding album by slug', { slug });
  //     const album = await this.repository.findOne({
  //       ...options,
  //       where: { slug, ...(options?.where ?? {}) },
  //     });
  //     if (!album) {
  //       this.logger.notFound('Albums', 'slug', slug);
  //       throw new EntityNotFoundException('Albums', slug);
  //     }
  //     this.logger.operation('READ', 'Albums', { slug });
  //     const res = this.mapper.toResponseDTO(album);
  //     return ResponseUtil.success('Album found', res);
  //   } catch (error) {
  //     this.logger.error('Failed to get album by slug', error as Error);
  //     if (error instanceof EntityNotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerException(
  //       'Failed to get album',
  //       error as Error,
  //       'AlbumsService.getAlbumBySlug',
  //     );
  //   }
  // }
  // async getTopAlbums(
  //   limit: number = 10,
  //   options: FindManyOptions<AlbumsEntity>,
  // ): Promise<IApiResponse> {
  //   const startTime = this.logger.startTiming();
  //   this.logger.step(1, 'Get top albums', { limit });
  //   this.logger.debug(`Request: limit=${limit}`);
  //   try {
  //     this.logger.step(2, 'Validate limit');
  //     if (limit < 1) {
  //       this.logger.validationError('limit', 'Must be >= 1', limit);
  //       throw new InvalidOperationException('Limit must be >= 1');
  //     }
  //     this.logger.debug(`Limit validated: ${limit}`);
  //     this.logger.step(3, 'Call repository.getTopEntity');
  //     const albums = await this.repository.getTopEntity({
  //       ...options,
  //       where: {
  //         is_deleted: false,
  //         status: 'public',
  //         ...(options?.where ?? {}),
  //       },
  //       relations: ['artist'],
  //       order: { popularity: 'DESC', total_plays: 'DESC' },
  //       take: limit,
  //     });
  //     this.logger.debug(`Retrieved ${albums.length} top albums`);
  //     this.logger.step(4, `Map ${albums.length} entities to DTOs`);
  //     const mapData = this.mapper.toListResponseDTOList(albums);
  //     this.logger.debug(`Mapping completed: ${mapData.length} DTOs created`);
  //     const duration = this.logger.endTiming(
  //       startTime,
  //       'getTopAlbums completed',
  //     );
  //     this.logger.performance('getTopAlbums', duration);
  //     return ResponseUtil.success(`Found ${albums.length} top albums`, mapData);
  //   } catch (error) {
  //     this.logger.error('Failed to get top albums', error as Error);
  //     throw new InternalServerException(
  //       'Failed to get top albums',
  //       error as Error,
  //       'AlbumsService.getTopAlbums',
  //     );
  //   }
  // }
  // async getNewReleases(
  //   limit: number = 10,
  //   options: FindManyOptions<AlbumsEntity>,
  // ): Promise<IApiResponse> {
  //   const startTime = this.logger.startTiming();
  //   this.logger.step(1, 'Get new releases', { limit });
  //   this.logger.debug(`Request: limit=${limit}`);
  //   try {
  //     this.logger.step(2, 'Validate limit');
  //     if (limit < 1) {
  //       this.logger.validationError('limit', 'Must be >= 1', limit);
  //       throw new InvalidOperationException('Limit must be >= 1');
  //     }
  //     this.logger.debug(`Limit validated: ${limit}`);
  //     this.logger.step(3, 'Call repository.getTopEntity');
  //     const albums = await this.repository.getTopEntity({
  //       ...options,
  //       where: {
  //         is_deleted: false,
  //         status: 'public',
  //         ...(options?.where ?? {}),
  //       },
  //       relations: ['artist'],
  //       order: { release_date: 'DESC' },
  //       take: limit,
  //     });
  //     this.logger.debug(`Retrieved ${albums.length} new releases`);
  //     this.logger.step(4, `Map ${albums.length} entities to DTOs`);
  //     const mapData = this.mapper.toListResponseDTOList(albums);
  //     this.logger.debug(`Mapping completed: ${mapData.length} DTOs created`);
  //     const duration = this.logger.endTiming(
  //       startTime,
  //       'getNewReleases completed',
  //     );
  //     this.logger.performance('getNewReleases', duration);
  //     return ResponseUtil.success(
  //       `Found ${albums.length} new releases`,
  //       mapData,
  //     );
  //   } catch (error) {
  //     this.logger.error('Failed to get new releases', error as Error);
  //     throw new InternalServerException(
  //       'Failed to get new releases',
  //       error as Error,
  //       'AlbumsService.getNewReleases',
  //     );
  //   }
  // }
  // async createAlbum(data: AlbumsDTO): Promise<IApiResponse> {
  //   const startTime = this.logger.startTiming();
  //   this.logger.step(1, 'BEGIN: Create Album', { title: data.title });
  //   try {
  //     this.logger.step(2, 'Validating album data', { title: data.title });
  //     if (!data.title) {
  //       this.logger.validationError(
  //         'title',
  //         'Album title is required',
  //         data.title,
  //       );
  //       throw new InvalidOperationException('Artist title is required');
  //     }
  //     this.logger.debug('Checking if album title already exists', {
  //       title: data.title,
  //     });
  //     const exists = await this.repository.findOne({
  //       where: { title: data.title },
  //     });
  //     if (exists) {
  //       this.logger.duplicateError('Albums', 'title', data.title);
  //       throw new EntityAlreadyExistsException('Albums', 'title', data.title);
  //     }
  //     this.logger.step(3, 'Calling repository.create()');
  //     const album = await this.repository.create(data);
  //     this.logger.operation('CREATE', 'Albums', {
  //       id: album.id,
  //       title: album.title,
  //     });
  //     this.logger.step(4, `Map ${data.title} albums to DTO`);
  //     const mapData = this.mapper.toResponseDTO(album);
  //     const duration = this.logger.endTiming(
  //       startTime,
  //       'createAlbum completed',
  //     );
  //     this.logger.performance('createAlbum', duration);
  //     return ResponseUtil.created('Album created successfully', mapData);
  //   } catch (error) {
  //     this.logger.error('Failed to create album', error as Error);
  //     if (error instanceof EntityAlreadyExistsException) {
  //       throw error;
  //     }
  //     throw new InternalServerException(
  //       'Failed to create album',
  //       error as Error,
  //       'AlbumsService.createAlbum',
  //     );
  //   }
  // }
  // async updateAlbum(id: string, data: AlbumsDTO): Promise<IApiResponse> {
  //   const startTime = this.logger.startTiming();
  //   this.logger.step(1, 'BEGIN: Update Album', { id, data });
  //   try {
  //     this.logger.step(2, 'Validating album exists', { id });
  //     const album = await this.repository.exists({ where: { id } });
  //     if (!album) {
  //       this.logger.notFound('Album', 'id', id);
  //       throw new EntityNotFoundException('Album', id);
  //     }
  //     this.logger.step(3, 'Call repository.update');
  //     const updatedAlbum = await this.repository.update(data);
  //     this.logger.operation('UPDATE', 'Album', { id });
  //     this.logger.step(4, `Map ${data.title} album to DTO`);
  //     const mapData = this.mapper.toResponseDTO(updatedAlbum);
  //     const duration = this.logger.endTiming(
  //       startTime,
  //       'updateAlbum completed',
  //     );
  //     this.logger.performance('updateAlbum', duration);
  //     return ResponseUtil.success('Album updated successfully', mapData);
  //   } catch (error) {
  //     this.logger.error('Failed to update album', error as Error);
  //     if (error instanceof EntityNotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerException(
  //       'Failed to update album',
  //       error as Error,
  //       'AlbumsService.updateAlbum',
  //     );
  //   }
  // }
  // async softDeleteAlbum(id: string): Promise<IApiResponse> {
  //   const startTime = this.logger.startTiming();
  //   try {
  //     this.logger.step(1, 'Validating album exists before soft delete', { id });
  //     const album = await this.repository.exists({
  //       where: { id, is_deleted: false },
  //     });
  //     if (!album) {
  //       this.logger.notFound('Genres', 'id', id);
  //       throw new EntityNotFoundException('Genres', id);
  //     }
  //     this.logger.step(2, 'Soft deleting album', { id });
  //     await this.repository.softDelete(id);
  //     this.logger.operation('DELETE', 'Album', { id });
  //     const duration = this.logger.endTiming(
  //       startTime,
  //       'softDeleteAlbum completed',
  //     );
  //     this.logger.performance('softDeleteAlbum', duration);
  //     return ResponseUtil.noContent('Album deleted successfully');
  //   } catch (error) {
  //     this.logger.error('Failed to delete album', error as Error);
  //     if (error instanceof EntityNotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerException(
  //       'Failed to delete album',
  //       error as Error,
  //       'AlbumsService.softDeleteAlbum',
  //     );
  //   }
  // }
  // async deleteAlbum(id: string): Promise<IApiResponse> {
  //   const startTime = this.logger.startTiming();
  //   try {
  //     this.logger.step(1, 'Validating album exists', { id });
  //     const album = await this.repository.exists({ where: { id } });
  //     if (!album) {
  //       this.logger.notFound('Album', 'id', id);
  //       throw new EntityNotFoundException('Album', id);
  //     }
  //     this.logger.step(2, 'Soft deleting album', { id });
  //     await this.repository.hardDelete(id);
  //     this.logger.operation('DELETE', 'Album', { id });
  //     const duration = this.logger.endTiming(
  //       startTime,
  //       'deleteAlbum completed',
  //     );
  //     this.logger.performance('deleteAlbum', duration);
  //     return ResponseUtil.noContent('Album deleted successfully');
  //   } catch (error) {
  //     this.logger.error('Failed to delete album', error as Error);
  //     if (error instanceof EntityNotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerException(
  //       'Failed to delete album',
  //       error as Error,
  //       'AlbumsService.deleteAlbum',
  //     );
  //   }
  // }
  // async incrementPlays(id: string, count: number = 1): Promise<IApiResponse> {
  //   const start = this.logger.startTiming();
  //   this.logger.step(1, 'Increment total_plays for album', { id, count });
  //   try {
  //     if (!id) {
  //       this.logger.validationError('id', 'Album ID is required', id);
  //       throw new InvalidOperationException('Album ID is required');
  //     }
  //     if (count < 1) {
  //       this.logger.validationError('count', 'Increment must be >= 1', count);
  //       throw new InvalidOperationException('Increment must be >= 1');
  //     }
  //     this.logger.step(2, 'Validating album exists', { id });
  //     const exists = await this.repository.exists({ where: { id } });
  //     if (!exists) {
  //       this.logger.notFound('Album', 'id', id);
  //       throw new EntityNotFoundException('Album', id);
  //     }
  //     this.logger.step(3, 'Calling repository.incrementPlays');
  //     await this.repository.incrementPlays(id, count);
  //     this.logger.database('UPDATE', 'albums', 1);
  //     this.logger.operation('UPDATE', 'Album.total_plays', {
  //       id,
  //       added: count,
  //     });
  //     const duration = this.logger.endTiming(start, 'incrementPlays completed');
  //     this.logger.performance('incrementPlays', duration);
  //     return ResponseUtil.noContent('Album plays incremented');
  //   } catch (error) {
  //     this.logger.error('Failed to increment album plays', error as Error);
  //     if (error instanceof EntityNotFoundException) {
  //       throw error;
  //     }
  //     throw new InternalServerException(
  //       'Failed to increment plays',
  //       error as Error,
  //       'AlbumsService.incrementPlays',
  //     );
  //   }
  // }
  // async incrementLikes(id: string, count: number = 1): Promise<IApiResponse> {
  //   const start = this.logger.startTiming();
  //   this.logger.step(1, 'Increment total_likes for album', { id, count });
  //   try {
  //     if (!id) {
  //       this.logger.validationError('id', 'Album ID is required', id);
  //       throw new InvalidOperationException('Album ID is required');
  //     }
  //     if (count < 1) {
  //       this.logger.validationError('count', 'Increment must be >= 1', count);
  //       throw new InvalidOperationException('Increment must be >= 1');
  //     }
  //     this.logger.step(2, 'Checking album exists');
  //     const exists = await this.repository.exists({ id } as any);
  //     if (!exists) {
  //       this.logger.notFound('Album', 'id', id);
  //       throw new EntityNotFoundException('Album', id);
  //     }
  //     this.logger.step(3, 'Calling repository.incrementLikes');
  //     await this.repository.incrementLikes(id, count);
  //     this.logger.database('UPDATE', 'albums', 1);
  //     this.logger.operation('UPDATE', 'Album.total_likes', {
  //       id,
  //       added: count,
  //     });
  //     const duration = this.logger.endTiming(start, 'incrementLikes completed');
  //     this.logger.performance('incrementLikes', duration);
  //     return ResponseUtil.noContent('total_likes incremented');
  //   } catch (error) {
  //     this.logger.error('Failed to increment likes', error as Error);
  //     if (error instanceof EntityNotFoundException) throw error;
  //     throw new InternalServerException(
  //       'Failed to increment album likes',
  //       error as Error,
  //       'AlbumsService.incrementLikes',
  //     );
  //   }
  // }
  // async updatePopularity(
  //   id: string,
  //   popularity: number,
  // ): Promise<IApiResponse> {
  //   const start = this.logger.startTiming();
  //   this.logger.step(1, 'Update album popularity', { id, popularity });
  //   try {
  //     if (!id) {
  //       this.logger.validationError('id', 'Album ID is required', id);
  //       throw new InvalidOperationException('Album ID is required');
  //     }
  //     if (popularity < 0) {
  //       this.logger.validationError(
  //         'popularity',
  //         'Popularity must be >= 0',
  //         popularity,
  //       );
  //       throw new InvalidOperationException('Popularity must be >= 0');
  //     }
  //     this.logger.step(2, 'Check album exists');
  //     const exists = await this.repository.exists({ id } as any);
  //     if (!exists) {
  //       this.logger.notFound('Album', 'id', id);
  //       throw new EntityNotFoundException('Album', id);
  //     }
  //     this.logger.step(3, 'Calling repository.updatePopularity');
  //     await this.repository.updatePopularity(id, popularity);
  //     this.logger.database('UPDATE', 'albums', 1);
  //     this.logger.operation('UPDATE', 'Album.popularity', { id, popularity });
  //     const duration = this.logger.endTiming(
  //       start,
  //       'updatePopularity completed',
  //     );
  //     this.logger.performance('updatePopularity', duration);
  //     return ResponseUtil.noContent('Album popularity updated');
  //   } catch (error) {
  //     this.logger.error('Failed to update popularity', error as Error);
  //     if (error instanceof EntityNotFoundException) throw error;
  //     throw new InternalServerException(
  //       'Failed to update popularity',
  //       error as Error,
  //       'AlbumsService.updatePopularity',
  //     );
  //   }
  // }
  // async updateTotalTracks(id: string, count: number): Promise<IApiResponse> {
  //   const start = this.logger.startTiming();
  //   this.logger.step(1, 'Update total_tracks for album', { id, count });
  //   try {
  //     if (!id) {
  //       this.logger.validationError('id', 'Album ID is required', id);
  //       throw new InvalidOperationException('Album ID is required');
  //     }
  //     if (count < 0) {
  //       this.logger.validationError(
  //         'count',
  //         'total_tracks must be >= 0',
  //         count,
  //       );
  //       throw new InvalidOperationException('total_tracks must be >= 0');
  //     }
  //     this.logger.step(2, 'Check album exists');
  //     const exists = await this.repository.exists({ id } as any);
  //     if (!exists) {
  //       this.logger.notFound('Album', 'id', id);
  //       throw new EntityNotFoundException('Album', id);
  //     }
  //     this.logger.step(3, 'Calling repository.updateTotalTracks');
  //     await this.repository.updateTotalTracks(id, count);
  //     this.logger.database('UPDATE', 'albums', 1);
  //     this.logger.operation('UPDATE', 'Album.total_tracks', { id, count });
  //     const duration = this.logger.endTiming(
  //       start,
  //       'updateTotalTracks completed',
  //     );
  //     this.logger.performance('updateTotalTracks', duration);
  //     return ResponseUtil.noContent('total_tracks updated');
  //   } catch (error) {
  //     this.logger.error('Failed to update total_tracks', error as Error);
  //     if (error instanceof EntityNotFoundException) throw error;
  //     throw new InternalServerException(
  //       'Failed to update total_tracks',
  //       error as Error,
  //       'AlbumsService.updateTotalTracks',
  //     );
  //   }
  // }
  // async updateDurationTotal(
  //   id: string,
  //   duration: number,
  // ): Promise<IApiResponse> {
  //   const start = this.logger.startTiming();
  //   this.logger.step(1, 'Update duration_total for album', { id, duration });
  //   try {
  //     if (!id) {
  //       this.logger.validationError('id', 'Album ID is required', id);
  //       throw new InvalidOperationException('Album ID is required');
  //     }
  //     if (duration < 0) {
  //       this.logger.validationError(
  //         'duration',
  //         'duration_total must be >= 0',
  //         duration,
  //       );
  //       throw new InvalidOperationException('duration_total must be >= 0');
  //     }
  //     this.logger.step(2, 'Check album exists');
  //     const exists = await this.repository.exists({ id } as any);
  //     if (!exists) {
  //       this.logger.notFound('Album', 'id', id);
  //       throw new EntityNotFoundException('Album', id);
  //     }
  //     this.logger.step(3, 'Calling repository.updateDurationTotal');
  //     await this.repository.updateDurationTotal(id, duration);
  //     this.logger.database('UPDATE', 'albums', 1);
  //     this.logger.operation('UPDATE', 'Album.duration_total', { id, duration });
  //     const durationMs = this.logger.endTiming(
  //       start,
  //       'updateDurationTotal completed',
  //     );
  //     this.logger.performance('updateDurationTotal', durationMs);
  //     return ResponseUtil.noContent('duration_total updated');
  //   } catch (error) {
  //     this.logger.error('Failed to update duration_total', error as Error);
  //     if (error instanceof EntityNotFoundException) throw error;
  //     throw new InternalServerException(
  //       'Failed to update duration_total',
  //       error as Error,
  //       'AlbumsService.updateDurationTotal',
  //     );
  //   }
  // }
}

export { AlbumsService };
