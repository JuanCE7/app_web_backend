import { Injectable } from '@nestjs/common';
import { Usecase } from 'src/usecases/entities/usecase.entity';
import { prompt, api_key } from '../utils/constants';
import { CohereClient } from "cohere-ai";
import { Project } from '@prisma/client';

const cohere = new CohereClient({
  token: api_key,
});
@Injectable()
export class IaService {

  async getCompletion(useCaseData: Partial<Usecase>, projectData: Partial<Project>) {

    const useCaseJson = JSON.stringify(useCaseData, null, 2);
    const contextProject = projectData.description;
    const promptData = ` ${prompt} \n${useCaseJson} \n "Contexto del Proyecto:" ${contextProject}`;

    try {
      const response = await cohere.v2.chat({
        model: 'command-r',
        messages: [
          {
            role: 'user',
            content: promptData,
          },
        ],
      });
      return response.message.content[0].text
    } catch (error) {
      throw new Error('Error al obtener respuesta de Cohere AI');
    }
  }
}
