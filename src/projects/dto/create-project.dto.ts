import {Project} from '@prisma/client'


export type CreateProjectDto = Omit<Project, 'id' | 'createdAt' | 'updatedAt'> 
