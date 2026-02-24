import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
class MigrationVerifier implements OnApplicationBootstrap {
  private readonly logger = new Logger(MigrationVerifier.name);

  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    try {
      if (!this.dataSource.isInitialized) {
        this.logger.warn('⚠️ TypeORM chưa được khởi tạo.');
        return;
      }

      await this.verifyMigrations();
    } catch (error: any) {
      this.logger.error(
        `❌ Lỗi kiểm tra migrations: ${error.message}`,
        error.stack,
      );
    }
  }

  /* ---------------------------------------------------------
   * Kiểm tra migrations
   * --------------------------------------------------------- */

  private async verifyMigrations(): Promise<void> {
    try {
      const executedMigrations = await this.getExecutedMigrations();
      const hasPending = await this.dataSource.showMigrations();

      if (!executedMigrations.length) {
        this.logger.warn(
          '⚠️ Chưa có migration nào được chạy. Hãy chạy: npm run mg:run',
        );
        return;
      }

      this.logger.log(`✅ Đã chạy ${executedMigrations.length} migrations:`);
      executedMigrations.forEach(({ name, timestamp }) => {
        this.logger.log(`   ✔ [${timestamp}] ${name}`);
      });

      if (hasPending) {
        this.logger.warn(
          '❗ Có migration chưa được chạy. Hãy chạy: npm run mg:run',
        );
      } else {
        this.logger.log('✅ Tất cả migrations đã được chạy.');
      }
    } catch {
      this.logger.warn(
        '⚠️ Bảng migrations chưa tồn tại. Hãy chạy: npm run mg:run',
      );
    }
  }

  /* ---------------------------------------------------------
   * Private utils
   * --------------------------------------------------------- */

  private async getExecutedMigrations(): Promise<
    { timestamp: number; name: string }[]
  > {
    const schema = process.env.DB_SCHEMA ?? 'public';
    const result = await this.dataSource.query(
      `SELECT timestamp, name FROM "${schema}".migrations ORDER BY timestamp ASC`,
    );
    return result.map((row: any) => ({
      timestamp: row.timestamp,
      name: row.name,
    }));
  }
}

export { MigrationVerifier };
