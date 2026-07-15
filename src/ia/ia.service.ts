import { Injectable, Logger } from '@nestjs/common';
import { Usecase } from 'src/usecases/entities/usecase.entity';
import { prompt, api_key } from '../utils/constants';
import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
  token: api_key,
});
@Injectable()
export class IaService {
  private readonly logger = new Logger(IaService.name);

  async getCompletion(useCaseData: Partial<Usecase>) {
    // Falla temprano y con claridad si la API key de Cohere no está configurada
    // (causa típica al desplegar en un servicio nuevo sin copiar la variable).
    if (!api_key) {
      throw new Error(
        'Falta la variable de entorno API_KEY (Cohere). Configúrala en el servidor.',
      );
    }

    const useCaseJson = JSON.stringify(useCaseData, null, 2);
    const promptData = ` ${prompt} \n${useCaseJson}`;

    // Modelo configurable por env: Cohere retira modelos periódicamente (p.ej.
    // 'command-r' fue eliminado el 15/09/2025). Con COHERE_MODEL puedes cambiarlo
    // sin tocar código. Lista actual: https://docs.cohere.com/docs/models
    const model = process.env.COHERE_MODEL || 'command-a-03-2025';

    try {
      const response = await cohere.v2.chat({
        model,
        messages: [
          {
            role: 'user',
            content: promptData,
          },
        ],
      });
      return response.message.content[0].text;
    } catch (error) {
      // Surfacing de la causa real (antes se ocultaba con un mensaje genérico):
      // statusCode/body vienen del SDK de Cohere (401 key inválida, 404 modelo,
      // 429 rate limit, etc.).
      const status = (error as any)?.statusCode ?? '';
      const detail =
        (error as any)?.body?.message ??
        (error as any)?.message ??
        String(error);
      this.logger.error(`Cohere falló ${status}: ${detail}`);
      throw new Error(`Error al obtener respuesta de Cohere AI: ${detail}`);
    }
  }
}
