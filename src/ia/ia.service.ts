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
        'https://api.openai.com/v1/completions',
        {
          model: 'text-davinci-003',
          prompt: prompt,
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

    return response.data; // Retorna la respuesta de la API
  }
}
