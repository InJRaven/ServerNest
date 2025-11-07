import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { GenresRepository } from '@repositories';

@Injectable()
class GenresService {
  constructor(private readonly repository: GenresRepository) {}
}
export { GenresService };
