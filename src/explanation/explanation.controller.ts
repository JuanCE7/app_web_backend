import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ExplanationService } from './explanation.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';

@ApiTags('explanation')
@ApiBearerAuth()
@UseGuards(AuthGuard)
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
