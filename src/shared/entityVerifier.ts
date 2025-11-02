import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
class EntityVerifier implements OnApplicationBootstrap {
  private readonly logger = new Logger(EntityVerifier.name);
  constructor(private readonly dataSource: DataSource) {}

  async onApplicationBootstrap() {
    try {
      if (!this.dataSource.isInitialized) {
        this.logger.warn('⚠️ TypeORM chưa được khởi tạo.');
        return;
      }

      const schema = process.env.DB_SCHEMA || 'public';
      const entities = this.dataSource.entityMetadatas;
      const tableNamesInDB = await this.getTableNamesInDatabase(schema);

      for (const entity of entities) {
        const tableName = entity.tableName;
        if (tableNamesInDB.includes(tableName)) {
          this.logger.log(`✅ Bảng "${schema}.${tableName}" đã tồn tại.`);
        } else {
          this.logger.warn(
            `❗Không thấy bảng "${schema}.${tableName}". (Chạy migrations?)`,
          );
        }
      }
    } catch (error: any) {
      this.logger.error(`❌ Lỗi kiểm tra bảng: ${error.message}`, error.stack);
    }
  }

  private async getTableNamesInDatabase(schema: string): Promise<string[]> {
    const result = await this.dataSource.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = $1`,
      [schema],
    );
    return result.map((row: any) => row.table_name);
  }
}
export { EntityVerifier };
