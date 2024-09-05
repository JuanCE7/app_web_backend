import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StepsService } from './steps.service';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('steps')
@Controller('steps')
export class StepsController {
  constructor(private readonly stepsService: StepsService) {}

  @Post()
  @ApiOperation({ summary : 'Created a step'})
  @ApiResponse({status: 200, description : 'A step has been successfully created'})
  create(@Body() createStepDto: CreateStepDto) {
    return this.stepsService.create(createStepDto);
  }

  @Get()
  @ApiOperation({ summary : 'Get steps'})
  @ApiResponse({status: 200, description : 'The steps haS been successfully returned'})
  findAll() {
    return this.stepsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary : 'Get a step'})
  @ApiResponse({status: 200, description : 'A step has been successfully returned'})
  findOne(@Param('id') id: string) {
    return this.stepsService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary : 'Update a step'})
  @ApiResponse({status: 200, description : 'A step has been successfully updated'})
  update(@Param('id') id: string, @Body() updateStepDto: UpdateStepDto) {
    return this.stepsService.update(+id, updateStepDto);
  }

  @Delete(':id')
  @ApiOperation({ summary : 'Delete a step'})
  @ApiResponse({status: 200, description : 'A step has been successfully deleted '})
  remove(@Param('id') id: string) {
    return this.stepsService.remove(+id);
  }
}
