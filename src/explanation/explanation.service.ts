import { Injectable } from '@nestjs/common';
import { CreateExplanationDto } from './dto/create-explanation.dto';
import { UpdateExplanationDto } from './dto/update-explanation.dto';

@Injectable()
export class ExplanationService {
  create(createExplanationDto: CreateExplanationDto) {
    return 'This action adds a new explanation';
  }

  findAll() {
    return `This action returns all explanation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} explanation`;
  }

  update(id: number, updateExplanationDto: UpdateExplanationDto) {
    return `This action updates a #${id} explanation`;
  }

  remove(id: number) {
    return `This action removes a #${id} explanation`;
  }
}
