import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';

@Injectable()
class Database {
  private pool: Pool;
  constructor(private readonly configService: ConfigService) {
    console.log(this.configService.get<string>('DB_HOST', 'localhost'));
    this.pool = new Pool({
      host: this.configService.get<string>('DB_HOST', 'localhost'),
      port: Number(this.configService.get<string>('DB_PORT', '5432')),
      database: this.configService.get<string>('DB_DATABASE', ''),
      user: this.configService.get<string>('DB_USER', ''),
      password: this.configService.get<string>('DB_PASSWORD', ''),
    });
  }
  // Check Connect Database
  async checkConnection(): Promise<boolean> {
    try {
      await this.pool.query('SELECT 1');
      console.log('✅ Database connection successful');
      return true;
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`❌ Database connection failed: ${error.message}`);
      } else {
        console.error('❌ Unknown database connection error');
      }
      return false;
    }
  }
}
export { Database };
