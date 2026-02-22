import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';
/**
 * Depends on all moves made first:
 * - artists, tracks, artist_roles (artist_role_assignments)
 * - artists, tracks              (artist_tracks)
 * - albums, tracks               (album_tracks)
 * - albums, genres               (album_genres)
 * - tracks, genres               (track_genres)
 * - playlists, tracks            (playlist_tracks)
 * - users, tracks                (track_likes)
 */
export class RelationTables1771742041453 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // ================================================================
    // artist_role_assignments
    // ================================================================
    await queryRunner.createTable(
      new Table({
        name: 'artist_role_assignments',
        columns: [
          { name: 'artistId', type: 'uuid', isPrimary: true },
          { name: 'roleId', type: 'uuid', isPrimary: true },
          { name: 'trackId', type: 'uuid', isPrimary: true },
          { name: 'assignedById', type: 'uuid', isNullable: true },
          { name: 'assignedAt', type: 'timestamptz', default: 'now()' },
          { name: 'isPrimary', type: 'boolean', default: false },
          { name: 'revokedAt', type: 'timestamptz', isNullable: true },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'artist_role_assignments',
      new TableIndex({
        name: 'idx_artist_role_assignments_artist_track',
        columnNames: ['artistId', 'trackId'],
      }),
    );
    await queryRunner.createIndex(
      'artist_role_assignments',
      new TableIndex({
        name: 'idx_artist_role_assignments_role',
        columnNames: ['roleId'],
      }),
    );
    await queryRunner.createIndex(
      'artist_role_assignments',
      new TableIndex({
        name: 'idx_artist_role_assignments_isPrimary',
        columnNames: ['isPrimary'],
      }),
    );
    await queryRunner.createForeignKey(
      'artist_role_assignments',
      new TableForeignKey({
        name: 'fk_ara_artist',
        columnNames: ['artistId'],
        referencedTableName: 'artists',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'artist_role_assignments',
      new TableForeignKey({
        name: 'fk_ara_track',
        columnNames: ['trackId'],
        referencedTableName: 'tracks',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'artist_role_assignments',
      new TableForeignKey({
        name: 'fk_ara_role',
        columnNames: ['roleId'],
        referencedTableName: 'artist_roles',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'artist_role_assignments',
      new TableForeignKey({
        name: 'fk_ara_assigned_by',
        columnNames: ['assignedById'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );

    // ================================================================
    // artist_tracks
    // ================================================================
    await queryRunner.createTable(
      new Table({
        name: 'artist_tracks',
        columns: [
          { name: 'artistId', type: 'uuid', isPrimary: true },
          { name: 'trackId', type: 'uuid', isPrimary: true },
          { name: 'isMainArtist', type: 'boolean', default: false },
          { name: 'addedAt', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'artist_tracks',
      new TableIndex({
        name: 'idx_artist_tracks_artist_main_artist',
        columnNames: ['artistId', 'isMainArtist'],
      }),
    );
    await queryRunner.createIndex(
      'artist_tracks',
      new TableIndex({
        name: 'idx_artist_tracks_track',
        columnNames: ['trackId'],
      }),
    );
    await queryRunner.createIndex(
      'artist_tracks',
      new TableIndex({
        name: 'idx_artist_tracks_artist_addAt',
        columnNames: ['addedAt'],
      }),
    );
    await queryRunner.createForeignKey(
      'artist_tracks',
      new TableForeignKey({
        name: 'fk_artist_tracks_artist',
        columnNames: ['artistId'],
        referencedTableName: 'artists',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'artist_tracks',
      new TableForeignKey({
        name: 'fk_artist_tracks_track',
        columnNames: ['trackId'],
        referencedTableName: 'tracks',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // ================================================================
    // album_tracks
    // ================================================================
    await queryRunner.createTable(
      new Table({
        name: 'album_tracks',
        columns: [
          { name: 'albumId', type: 'uuid', isPrimary: true },
          { name: 'trackId', type: 'uuid', isPrimary: true },
          { name: 'trackNumber', type: 'smallint', isNullable: false },
          { name: 'discNumber', type: 'smallint', default: 1 },
          {
            name: 'version',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'album_tracks',
      new TableIndex({
        name: 'idx_album_track_album_track',
        columnNames: ['albumId', 'discNumber', 'trackNumber'],
      }),
    );
    await queryRunner.createIndex(
      'album_tracks',
      new TableIndex({
        name: 'idx_album_track_track',
        columnNames: ['trackId'],
      }),
    );
    await queryRunner.createForeignKey(
      'album_tracks',
      new TableForeignKey({
        name: 'fk_album_tracks_album',
        columnNames: ['albumId'],
        referencedTableName: 'albums',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'album_tracks',
      new TableForeignKey({
        name: 'fk_album_tracks_track',
        columnNames: ['trackId'],
        referencedTableName: 'tracks',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // ================================================================
    // album_genres
    // ================================================================
    await queryRunner.createTable(
      new Table({
        name: 'album_genres',
        columns: [
          { name: 'albumId', type: 'uuid', isPrimary: true },
          { name: 'genreId', type: 'uuid', isPrimary: true },
          { name: 'isPrimary', type: 'boolean', default: false },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'album_genres',
      new TableIndex({
        name: 'album_genres_album',
        columnNames: ['albumId'],
      }),
    );
    await queryRunner.createIndex(
      'album_genres',
      new TableIndex({
        name: 'album_genres_genre',
        columnNames: ['genreId'],
      }),
    );
    await queryRunner.createForeignKey(
      'album_genres',
      new TableForeignKey({
        name: 'fk_album_genres_album',
        columnNames: ['albumId'],
        referencedTableName: 'albums',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'album_genres',
      new TableForeignKey({
        name: 'fk_album_genres_genre',
        columnNames: ['genreId'],
        referencedTableName: 'genres',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // ================================================================
    // track_genres
    // ================================================================
    await queryRunner.createTable(
      new Table({
        name: 'track_genres',
        columns: [
          { name: 'trackId', type: 'uuid', isPrimary: true },
          { name: 'genreId', type: 'uuid', isPrimary: true },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'track_genres',
      new TableIndex({
        name: 'idx_track_genres_track',
        columnNames: ['trackId'],
      }),
    );
    await queryRunner.createIndex(
      'track_genres',
      new TableIndex({
        name: 'idx_track_genres_genre',
        columnNames: ['genreId'],
      }),
    );
    await queryRunner.createForeignKey(
      'track_genres',
      new TableForeignKey({
        name: 'fk_track_genres_track',
        columnNames: ['trackId'],
        referencedTableName: 'tracks',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'track_genres',
      new TableForeignKey({
        name: 'fk_track_genres_genre',
        columnNames: ['genreId'],
        referencedTableName: 'genres',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // ================================================================
    // playlist_tracks
    // ================================================================
    await queryRunner.createTable(
      new Table({
        name: 'playlist_tracks',
        columns: [
          { name: 'playlistId', type: 'uuid', isPrimary: true },
          { name: 'trackId', type: 'uuid', isPrimary: true },
          { name: 'position', type: 'integer', isNullable: false },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'playlist_tracks',
      new TableIndex({
        name: 'idx_playlist_tracks_playlist',
        columnNames: ['playlistId'],
      }),
    );
    await queryRunner.createIndex(
      'playlist_tracks',
      new TableIndex({
        name: 'idx_playlist_tracks_track',
        columnNames: ['trackId'],
      }),
    );
    await queryRunner.createForeignKey(
      'playlist_tracks',
      new TableForeignKey({
        name: 'fk_playlist_tracks_playlist',
        columnNames: ['playlistId'],
        referencedTableName: 'playlists',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'playlist_tracks',
      new TableForeignKey({
        name: 'fk_playlist_tracks_track',
        columnNames: ['trackId'],
        referencedTableName: 'tracks',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    // ================================================================
    // track_likes
    // ================================================================
    await queryRunner.createTable(
      new Table({
        name: 'track_likes',
        columns: [
          { name: 'userId', type: 'uuid', isPrimary: true },
          { name: 'trackId', type: 'uuid', isPrimary: true },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
        ],
      }),
      true,
    );
    await queryRunner.createIndex(
      'track_likes',
      new TableIndex({
        name: 'idx_track_likes_user',
        columnNames: ['userId'],
      }),
    );
    await queryRunner.createIndex(
      'track_likes',
      new TableIndex({
        name: 'idx_track_likes_track',
        columnNames: ['trackId'],
      }),
    );
    await queryRunner.createForeignKey(
      'track_likes',
      new TableForeignKey({
        name: 'fk_track_likes_user',
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'track_likes',
      new TableForeignKey({
        name: 'fk_track_likes_track',
        columnNames: ['trackId'],
        referencedTableName: 'tracks',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // track_likes
    await queryRunner.dropForeignKey('track_likes', 'fk_track_likes_track');
    await queryRunner.dropForeignKey('track_likes', 'fk_track_likes_user');
    await queryRunner.dropTable('track_likes');

    // playlist_tracks
    await queryRunner.dropForeignKey(
      'playlist_tracks',
      'fk_playlist_tracks_track',
    );
    await queryRunner.dropForeignKey(
      'playlist_tracks',
      'fk_playlist_tracks_playlist',
    );
    await queryRunner.dropTable('playlist_tracks');

    // track_genres
    await queryRunner.dropForeignKey('track_genres', 'fk_track_genres_genre');
    await queryRunner.dropForeignKey('track_genres', 'fk_track_genres_track');
    await queryRunner.dropTable('track_genres');

    // album_genres
    await queryRunner.dropForeignKey('album_genres', 'fk_album_genres_genre');
    await queryRunner.dropForeignKey('album_genres', 'fk_album_genres_album');
    await queryRunner.dropTable('album_genres');

    // album_tracks
    await queryRunner.dropForeignKey('album_tracks', 'fk_album_tracks_track');
    await queryRunner.dropForeignKey('album_tracks', 'fk_album_tracks_album');
    await queryRunner.dropTable('album_tracks');

    // artist_tracks
    await queryRunner.dropForeignKey('artist_tracks', 'fk_artist_tracks_track');
    await queryRunner.dropForeignKey(
      'artist_tracks',
      'fk_artist_tracks_artist',
    );
    await queryRunner.dropTable('artist_tracks');

    // artist_role_assignments
    await queryRunner.dropForeignKey(
      'artist_role_assignments',
      'fk_ara_assigned_by',
    );
    await queryRunner.dropForeignKey('artist_role_assignments', 'fk_ara_role');
    await queryRunner.dropForeignKey('artist_role_assignments', 'fk_ara_track');
    await queryRunner.dropForeignKey(
      'artist_role_assignments',
      'fk_ara_artist',
    );
    await queryRunner.dropTable('artist_role_assignments');
  }
}
