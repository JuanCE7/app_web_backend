import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UsecasesService } from './usecases.service';
import { CreateUseCaseDto } from './dto/create-usecase.dto';
import { UpdateUseCaseDto } from './dto/update-usecase.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('usecases')
@Controller('usecases')
export class UsecasesController {
  constructor(private readonly usecasesService: UsecasesService) {}

  @Post()
  @ApiOperation({ summary : 'Created a usecase'})
  @ApiResponse({status: 200, description : 'A usecase has been successfully created'})
  create(@Body() CreateUseCaseDto: CreateUseCaseDto) {
    return this.usecasesService.create(CreateUseCaseDto);
  }

  @Get()
  @ApiOperation({ summary : 'Get usecases'})
  @ApiResponse({status: 200, description : 'The usecases haS been successfully returned'})
  findAll() {
    return this.usecasesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary : 'Get a usecase'})
  @ApiResponse({status: 200, description : 'A usecase has been successfully returned'})
  findOne(@Param('id') id: string) {
    return this.usecasesService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary : 'Update a usecase'})
  @ApiResponse({status: 200, description : 'A usecase has been successfully updated'})
  update(@Param('id') id: string, @Body() UpdateUseCaseDto: UpdateUseCaseDto) {
    return this.usecasesService.update(+id, UpdateUseCaseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary : 'Delete a usecase'})
  @ApiResponse({status: 200, description : 'A usecase has been successfully deleted '})
  remove(@Param('id') id: string) {
    return this.usecasesService.remove(+id);
  }
}
