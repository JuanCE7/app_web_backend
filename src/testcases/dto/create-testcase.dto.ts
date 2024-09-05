import { TestCase } from '@prisma/client'

export type CreateTestCaseDto = Omit<TestCase, 'id' | 'createdAt' | 'updatedAt'>