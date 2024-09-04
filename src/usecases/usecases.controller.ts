import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsecasesService } from './usecases.service';
import { CreateUsecaseDto } from './dto/create-usecase.dto';
import { UpdateUsecaseDto } from './dto/update-usecase.dto';

@Controller('usecases')
export class UsecasesController {
  constructor(private readonly usecasesService: UsecasesService) {}

  @Post()
  create(@Body() createUsecaseDto: CreateUsecaseDto) {
    return this.usecasesService.create(createUsecaseDto);
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
  update(@Param('id') id: string, @Body() updateUsecaseDto: UpdateUsecaseDto) {
    return this.usecasesService.update(+id, updateUsecaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usecasesService.remove(+id);
  }
}
