import { UseCase } from '@prisma/client'

export type CreateUseCaseDto = Omit<UseCase, 'id' | 'createdAt' | 'updatedAt'>