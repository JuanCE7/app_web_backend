import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class IaService {
  constructor(private readonly httpService: HttpService) {}

  // Método que realiza la solicitud a la API de OpenAI
  async getCompletion(prompt: string): Promise<any> {
    const API_KEY = process.env.OPENAI_API_KEY; // Usa la API Key desde las variables de entorno

    const response = await lastValueFrom(
      this.httpService.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' }, // Contexto del sistema (opcional)
            { role: 'user', content: prompt }, // El prompt se pasa en el rol de 'user'
          ],
          max_tokens: 20,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${API_KEY}`,
          },
        },
      ),
    );

    return response.data;
  }
}
