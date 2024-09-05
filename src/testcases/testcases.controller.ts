import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestcasesService } from './testcases.service';
import { CreateTestCaseDto } from './dto/create-testcase.dto';
import { UpdateTestCaseDto } from './dto/update-testcase.dto';

@Controller('testcases')
export class TestcasesController {
  constructor(private readonly testcasesService: TestcasesService) {}

  @Post()
  create(@Body() CreateTestCaseDto: CreateTestCaseDto) {
    return this.testcasesService.create(CreateTestCaseDto);
  }

  @Get()
  findAll() {
    return this.testcasesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.testcasesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateTestCaseDto: UpdateTestCaseDto) {
    return this.testcasesService.update(+id, UpdateTestCaseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.testcasesService.remove(+id);
  }
}
