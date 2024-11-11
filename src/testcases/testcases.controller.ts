import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TestcasesService } from './testcases.service';
import { UpdateTestCaseDto } from './dto/update-testcase.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTestCaseDto } from './dto/create-testcase.dto';

@ApiTags('testcases')
@Controller('testcases')
export class TestcasesController {
  constructor(private readonly testcasesService: TestcasesService) {}

  @Post('/generate/:id')
  @ApiOperation({ summary : 'Generate a testcase'})
  @ApiResponse({status: 200, description : 'A testcase has been successfully generated'})
  generate(@Param('id') id: string) {
    return this.testcasesService.generateTestCase(id);
  }

  @Post()
  @ApiOperation({ summary : 'Generate a testcase'})
  @ApiResponse({status: 200, description : 'A testcase has been successfully created'})
  create(@Body() createTestCaseDto: CreateTestCaseDto) {
    return this.testcasesService.create(createTestCaseDto);
  }

  @Get()
  @ApiOperation({ summary : 'Get testcases'})
  @ApiResponse({status: 200, description : 'The testcases has been successfully returned'})
  findAll() {
    return this.testcasesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary : 'Get a testcase'})
  @ApiResponse({status: 200, description : 'A testcase has been successfully returned'})
  findOne(@Param('id') id: string) {
    return this.testcasesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary : 'Update a testcase'})
  @ApiResponse({status: 200, description : 'A testcase has been successfully updated'})
  update(@Param('id') id: string, @Body() UpdateTestCaseDto: UpdateTestCaseDto) {
    return this.testcasesService.update(id, UpdateTestCaseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary : 'Delete a testcase'})
  @ApiResponse({status: 200, description : 'A testcase has been successfully deleted '})  remove(@Param('id') id: string) {
    return this.testcasesService.remove(id);
  }
}
