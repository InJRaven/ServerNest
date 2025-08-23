import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
class SchemaVerifierService implements OnModuleInit {
  private readonly logger = new Logger(SchemaVerifierService.name);

  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    try {
      if (!this.dataSource.isInitialized) {
        this.logger.warn('⚠️ TypeORM chưa được khởi tạo.');
        return;
      }

      const entities = this.dataSource.entityMetadatas;
      const tableNamesInDB = await this.getTableNamesInDatabase();

      for (const entity of entities) {
        const tableName = entity.tableName;

        if (tableNamesInDB.includes(tableName)) {
          this.logger.log(`ℹ️ Bảng "${tableName}" đã tồn tại. Không tạo lại.`);
        } else {
          this.logger.log(`✅ Bảng "${tableName}" vừa được tạo.`);
        }
      }
    } catch (error) {
      this.logger.error(`❌ Lỗi kiểm tra bảng: ${error.message}`);
    }
  }

  private async getTableNamesInDatabase(): Promise<string[]> {
    const result = await this.dataSource.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
    `);
    return result.map((row: any) => row.table_name);
  }
}

export { SchemaVerifierService };
