import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { api_key, prompt as prompt } from '../utils/constants';
import { Usecase } from 'src/usecases/entities/usecase.entity';
@Injectable()
export class IaService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(api_key);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async getCompletion(useCaseData: Partial<Usecase>) {
    try {
      const useCaseJson = JSON.stringify(useCaseData, null, 2);
      const promptData = `${prompt} \n${useCaseJson}`;

      console.log('Prompt enviado a la IA:', promptData);
      console.log(useCaseData);
      const result = await this.model.generateContent(promptData);

      const responseText = result.response.text();

      return responseText;
    } catch (error) {
      console.error('Error en getCompletion:', error);
      throw new Error(
        'No se pudo obtener una respuesta de la API de Google Generative AI',
      );
    }
  }
}
