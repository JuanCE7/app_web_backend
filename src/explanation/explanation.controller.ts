import { Controller, Get, Param } from '@nestjs/common';
import { ExplanationService } from './explanation.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('explanation')
@Controller('explanation')
export class ExplanationController {
  constructor(private readonly explanationService: ExplanationService) {}
  @Get(':id')
  @ApiOperation({ summary: 'Obtenga una explicación' })
  @ApiResponse({
    status: 200,
    description: 'Se ha devuelto correctamente una explicación',
  })
  findOne(@Param('id') id: string) {
    return this.explanationService.findOne(id);
  }
}
