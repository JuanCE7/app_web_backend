import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExplanationService } from './explanation.service';
import { CreateExplanationDto } from './dto/create-explanation.dto';
import { UpdateExplanationDto } from './dto/update-explanation.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('explanation')
@Controller('explanation')
export class ExplanationController {
  constructor(private readonly explanationService: ExplanationService) {}
  @Get(':id')
  @ApiOperation({ summary : 'Get a explanation'})
  @ApiResponse({status: 200, description : 'A explanation has been successfully returned'})
  findOne(@Param('id') id: string) {
    return this.explanationService.findOne(id);
  }
}
