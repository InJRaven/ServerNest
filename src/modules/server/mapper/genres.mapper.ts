import { GenresEntity } from '@entities';
import { GenresResDTO } from '@modules/server/DTO';

class GenresMapper {
  static mapEntityToResponseDTO(entity: GenresEntity): GenresResDTO {
    const resDTO = new GenresResDTO();

    resDTO.id = entity.id;
    resDTO.name = entity.name;
    resDTO.description = entity.description;

    return resDTO;
  }

  // List
  static mapEntitiesToResponseDTO(entity: GenresEntity[]): GenresResDTO[] {
    return entity.map((genre) => this.mapEntityToResponseDTO(genre));
  }
}

export { GenresMapper };
