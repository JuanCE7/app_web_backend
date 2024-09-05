import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsecasesService } from './usecases.service';
import { CreateUseCaseDto } from './dto/create-usecase.dto';
import { UpdateUseCaseDto } from './dto/update-usecase.dto';

@Controller('usecases')
export class UsecasesController {
  constructor(private readonly usecasesService: UsecasesService) {}

  @Post()
  create(@Body() CreateUseCaseDto: CreateUseCaseDto) {
    return this.usecasesService.create(CreateUseCaseDto);
  }

  @Get()
  findAll() {
    return this.usecasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usecasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateUseCaseDto: UpdateUseCaseDto) {
    return this.usecasesService.update(+id, UpdateUseCaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usecasesService.remove(+id);
  }
}
