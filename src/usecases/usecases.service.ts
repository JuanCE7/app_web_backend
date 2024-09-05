import { Injectable } from '@nestjs/common';
import { CreateUseCaseDto } from './dto/create-usecase.dto';
import { UpdateUseCaseDto } from './dto/update-usecase.dto';

@Injectable()
export class UsecasesService {
  create(createUsecaseDto: CreateUseCaseDto) {
    return 'This action adds a new usecase';
  }

  findAll() {
    return `This action returns all usecases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} usecase`;
  }

  update(id: number, updateUsecaseDto: UpdateUseCaseDto) {
    return `This action updates a #${id} usecase`;
  }

  remove(id: number) {
    return `This action removes a #${id} usecase`;
  }
}
