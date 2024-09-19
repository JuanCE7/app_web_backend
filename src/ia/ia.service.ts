import { Injectable } from '@nestjs/common';
import { GoogleGenerativeAI } from '@google/generative-ai';
import {prompt as pt} from '../utils/constants'
@Injectable()
export class IaService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    // Inicializa el cliente de Google Generative AI con la API Key directamente como string
    this.genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENAI_API_KEY); // Pasa la API Key directamente

    // Selecciona el modelo generativo a utilizar
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  // Método que realiza la solicitud a la API de Google Generative AI
  async getCompletion(prompt: string): Promise<string> {
    try {
      // Genera contenido con el modelo utilizando el prompt proporcionado
      var entry = pt + prompt
      const result = await this.model.generateContent(entry);

      // Retorna el contenido de la respues ta
      return result.response.candidates[0].content.parts[0];
    } catch (error) {
      console.error('Error en getCompletion:', error);
      throw new Error('No se pudo obtener una respuesta de la API de Google Generative AI');
    }
  }
}