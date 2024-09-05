import { Step } from '@prisma/client'

export type CreateStepDto = Omit<Step, 'id' | 'createdAt' | 'updatedAt'>