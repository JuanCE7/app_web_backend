import {Project} from '@prisma/client'


export type CreateProjectDto = Omit<Project, 'projectCode' | 'createdAt' | 'updatedAt'> 
