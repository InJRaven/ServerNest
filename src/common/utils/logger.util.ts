import { Logger as NestLogger } from '@nestjs/common';

class LoggerUtil {
  private logger: NestLogger;
  private context: string;
  private isDevelopment: boolean = process.env.NODE_ENV === 'DEVELOPMENT';
  constructor(context: string) {
    this.context = context;
    this.logger = new NestLogger(context);
  }
  /**
   * Helper: Format message with context
   * @private
   */
  private formatMessage(message: string): string {
    return `[${this.context}] ${message}`;
  }

  /**
   * Log Information
   * Level: INFO
   */
  log(message: string, metadata?: any): void {
    const finalMessage = this.formatMessage(message);
    if (metadata) {
      this.logger.log(`${finalMessage} | ${JSON.stringify(metadata)}`);
    } else {
      this.logger.log(finalMessage);
    }
  }

  /**
   * Log detailed information (use for debug)
   * Level: DEBUG
   */

  debug(message: string, metadata?: any): void {
    if (this.isDevelopment) {
      const finalMessage = this.formatMessage(message);
      if (metadata) {
        this.logger.debug(
          `${finalMessage} | ${JSON.stringify(metadata, null, 2)}`,
        );
      } else {
        this.logger.debug(finalMessage);
      }
    }
  }

  /**
   * Log Warning
   * Level: WARNING
   */
  warn(message: string, metadata?: any): void {
    const finalMessage = this.formatMessage(message);
    if (metadata) {
      this.logger.warn(`${finalMessage} | ${JSON.stringify(metadata)}`);
    } else {
      this.logger.warn(finalMessage);
    }
  }

  /**
   * Log Error
   * Level: ERROR
   * Automatically add error stack trace if there is an Error object
   */
  error(message: string, error?: Error): void {
    const finalMessage = this.formatMessage(message);

    if (error instanceof Error) {
      this.logger.error(`${finalMessage} | ${error.message}`, error.stack);
    } else if (error) {
      this.logger.error(`${finalMessage} | ${JSON.stringify(error)}`);
    } else {
      this.logger.error(finalMessage);
    }
  }

  /**
   * Log information about operation (CREATE, READ, UPDATE, DELETE)
   * Level: ERROR
   * Automatically add activity name and duration if provided
   * @example
   * logger.operation('CREATE', 'artist', { id: '123' });
   * logger.operation('UPDATE', 'track', null, 250); // 250ms
   */
  operation(
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'SYNC' | 'RESTORE',
    entity: string,
    data?: any,
    duration?: number,
  ): void {
    let message = `[${operation}] ${entity}`;
    if (data) {
      message += ` | ${JSON.stringify(data)}`;
    }
    if (duration) {
      message += ` | ${duration}ms`;
    }
    this.log(message);
  }

  /**
   * Log validation information
   */
  validation(field: string, reason: string): void {
    const message = `[VALIDATION] ${field}: ${reason}`;
    this.warn(message);
  }

  /**
   * Log information about database operations
   */
  database(
    operation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE',
    table: string,
    affectedRows: number,
    duration?: number,
  ): void {
    let message = `[DATABASE] ${operation} ${table} | Rows: ${affectedRows}`;
    if (duration) {
      message += ` | ${duration}ms`;
    }
    this.debug(message);
  }

  /**
   * Log performance information
   */
  performance(method: string, duration: number): void {
    const color = duration > 1000 ? '⚠️' : '✅';
    const message = `${color} [PERFORMANCE] ${method} took ${duration}ms`;
    if (duration > 1000) {
      this.warn(message);
    } else {
      this.debug(message);
    }
  }

  /**
   * Log authorization/authentication information
   */
  auth(
    action:
      | 'LOGIN_SUCCESS'
      | 'LOGIN_FAILED'
      | 'PERMISSION_DENIED'
      | 'TOKEN_EXPIRED',
    user: string,
    requiredRole?: string,
  ): void {
    let message = `[AUTH] ${action} | User: ${user}`;
    if (requiredRole) {
      message += ` | Required: ${requiredRole}`;
    }
    this.log(message);
  }

  /**
   * Log information about 3rd party APIs
   */
  externalAPI(
    method: string,
    url: string,
    statusCode: number,
    duration?: number,
  ): void {
    let message = `[EXTERNAL_API] ${method} ${url} | Status: ${statusCode}`;
    if (duration) {
      message += ` | ${duration}ms`;
    }
    this.debug(message);
  }

  /**
   * Log caching information
   *
   * @example
   * logger.cache('HIT', 'artists:top:10');
   * logger.cache('MISS', 'genre:jazz');
   */
  cache(action: 'HIT' | 'MISS' | 'SET' | 'DELETE', key: string): void {
    const message = `[CACHE] ${action} | Key: ${key}`;
    this.debug(message);
  }

  /**
   * Log information about input validation errors
   *
   * @example
   * logger.validationError('title', 'String must not exceed 255 characters', 'The Weeknd...');
   */
  validationError(field: string, rule: string, value?: any): void {
    let message = `[VALIDATION_ERROR] ${field}: ${rule}`;
    if (value !== undefined) {
      message += ` | Value: ${JSON.stringify(value)}`;
    }
    this.warn(message);
  }

  /**
   * Log information about duplicate errors
   *
   * @example
   * logger.duplicateError('Artist', 'title', 'The Weeknd');
   */
  duplicateError(entity: string, field: string, value: any): void {
    const message = `[DUPLICATE] ${entity} with ${field} "${value}" already exists`;
    this.warn(message);
  }

  /**
   * Log information about not found errors
   *
   * @example
   * logger.notFound('Artist', 'id', '123-abc');
   */
  notFound(entity: string, field: string, value: any): void {
    const message = `[NOT_FOUND] ${entity} with ${field} "${value}" not found`;
    this.warn(message);
  }

  /**
   * Log transaction information
   *
   * @example
   * logger.transaction('BEGIN', 'createAlbumWithTracks');
   * logger.transaction('COMMIT', 'createAlbumWithTracks', 1250);
   * logger.transaction('ROLLBACK', 'createAlbumWithTracks', error);
   */
  transaction(
    action: 'BEGIN' | 'COMMIT' | 'ROLLBACK',
    name: string,
    durationOrError?: number | Error,
  ): void {
    let message = `[TRANSACTION] ${action} | ${name}`;

    if (typeof durationOrError === 'number') {
      message += ` | ${durationOrError}ms`;
      this.log(message);
    } else if (durationOrError instanceof Error) {
      this.error(`${message}`, durationOrError);
    } else {
      this.log(message);
    }
  }

  /**
   * Log information about queue/job processing
   *
   * @example
   * logger.queue('ENQUEUE', 'sendEmail', { to: 'user@example.com' });
   * logger.queue('PROCESS', 'sendEmail', 500);
   * logger.queue('SUCCESS', 'sendEmail');
   * logger.queue('FAILED', 'sendEmail', error);
   */
  queue(
    action: 'ENQUEUE' | 'PROCESS' | 'SUCCESS' | 'FAILED' | 'RETRY',
    jobName: string,
    dataOrDurationOrError?: any,
  ): void {
    let message = `[QUEUE] ${action} | Job: ${jobName}`;

    if (typeof dataOrDurationOrError === 'number') {
      message += ` | ${dataOrDurationOrError}ms`;
      this.log(message);
    } else if (dataOrDurationOrError instanceof Error) {
      this.error(`${message}`, dataOrDurationOrError);
    } else if (dataOrDurationOrError) {
      message += ` | ${JSON.stringify(dataOrDurationOrError)}`;
      this.debug(message);
    } else {
      this.log(message);
    }
  }

  /**
   * Log information about migration/database schema changes
   *
   * @example
   * logger.migration('UP', '001_create_artists_table', 150);
   * logger.migration('DOWN', '001_create_artists_table', error);
   */
  migration(
    action: 'UP' | 'DOWN',
    name: string,
    durationOrError?: number | Error,
  ): void {
    let message = `[MIGRATION] ${action} | ${name}`;

    if (typeof durationOrError === 'number') {
      message += ` | ${durationOrError}ms`;
      this.log(message);
    } else if (durationOrError instanceof Error) {
      this.error(`${message}`, durationOrError);
    } else {
      this.log(message);
    }
  }

  /**
   * Log configuration information
   *
   * @example
   * logger.config('database', { host: 'localhost', port: 5432 });
   */
  config(key: string, value: any): void {
    const message = `[CONFIG] ${key} = ${JSON.stringify(value)}`;
    this.debug(message);
  }

  /**
   * Log information about the environment
   *
   * @example
   * logger.environment('NODE_ENV', 'development');
   */
  environment(key: string, value: string): void {
    const message = `[ENVIRONMENT] ${key}=${value}`;
    this.debug(message);
  }

  /**
   * Log information about startups
   *
   * @example
   * logger.startup('Application started on port 3000');
   */
  startup(message: string): void {
    const finalMessage = `🚀 [STARTUP] ${message}`;
    this.logger.log(finalMessage);
  }

  /**
   * Log shutdown information
   *
   * @example
   * logger.shutdown('Application shutting down');
   */
  shutdown(message: string): void {
    const finalMessage = `⛔ [SHUTDOWN] ${message}`;
    this.logger.log(finalMessage);
  }

  /**
   * Log health check information
   *
   * @example
   * logger.healthCheck('database', 'healthy');
   * logger.healthCheck('redis', 'unhealthy');
   */
  healthCheck(
    service: string,
    status: 'healthy' | 'unhealthy' | 'warning',
  ): void {
    const emoji =
      status === 'healthy' ? '✅' : status === 'unhealthy' ? '❌' : '⚠️';
    const message = `${emoji} [HEALTH] ${service}: ${status}`;
    this.log(message);
  }

  /**
   * Helper: Format message với context
   */

  changeContext(newContext: string): void {
    this.context = newContext;
    this.logger = new NestLogger(newContext);
  }

  getContext(): string {
    return this.context;
  }

  setDevelopmentMode(isDev: boolean): void {
    this.isDevelopment = isDev;
  }

  createChildLogger(childContext: string): LoggerUtil {
    return new LoggerUtil(`${this.context}:${childContext}`);
  }

  /**
   * Log information step by step
   */
  step(stepNumber: number, description: string, metadata?: any): void {
    let message = `[STEP ${stepNumber}] ${description}`;
    if (metadata) {
      message += ` | ${JSON.stringify(metadata)}`;
    }
    this.debug(message);
  }

  /**
   * Log information about data transformation
   */
  transform(from: string, to: string, count?: number): void {
    let message = `[TRANSFORM] ${from} → ${to}`;
    if (count) {
      message += ` (${count} items)`;
    }
    this.debug(message);
  }

  /**
   * Log information about batch processing
   */
  batch(
    action: 'PROCESS' | 'COMPLETED' | 'FAILED',
    name: string,
    count: number,
    duration?: number,
  ): void {
    let message = `[BATCH] ${action} | ${name} | Items: ${count}`;
    if (duration) {
      message += ` | ${duration}ms`;
    }
    this.log(message);
  }

  /**
   * Log timing information (use with startTime)
   *
   * @example
   * const startTime = logger.startTiming();
   * // ... some operations ...
   * logger.endTiming(startTime, 'Operation completed');
   */
  startTiming(): number {
    return Date.now();
  }

  /**
   * End timing and log duration
   */
  endTiming(startTime: number, description: string): number {
    const duration = Date.now() - startTime;
    const message = `${description} | Duration: ${duration}ms`;
    this.debug(message);
    return duration;
  }
}
export { LoggerUtil };
