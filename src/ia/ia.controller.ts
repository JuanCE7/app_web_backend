import { Controller, Post, Body } from '@nestjs/common';
import { IaService } from './ia.service';

@Controller('ia')
export class IaController {
  constructor(private readonly iaService: IaService) {}
  // Endpoint para recibir el prompt y devolver la respuesta de OpenAI
  @Post('completion')
  async getCompletion(@Body('prompt') prompt: string) {
    if (!prompt) {
      throw new Error('Prompt is required');
    }
    const response = await this.iaService.getCompletion(prompt);
    return response;
  }
}
