import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import {PrismaService} from 'src/prisma/prisma.service'
import {Prisma} from '@prisma/client'

@Injectable()
export class ProjectsService {

  constructor (private prismaService: PrismaService) { 
  }

  async create(createProjectDto: CreateProjectDto) {
    try{
      return await this.prismaService.project.create({
        data: createProjectDto
      })
    }catch(error){
      console.log(error)
      if(error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code == "P2002"){
          throw new ConflictException(`Project with name ${createProjectDto.name} already exists`)
        }
      }
    }
  }

  findAll() {
    return this.prismaService.project.findMany()
  }

  async findOne(id: number) {
    
    const projectFound = await this.prismaService.project.findUnique({
      where: { id : id }
    })
    if(!projectFound){
      throw new NotFoundException(`Project with id ${id} not found`)
    }

    return projectFound
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const projectUpdate = await this.prismaService.project.update({
      where: {
        id :id
      },
      data: updateProjectDto
    })

    if(!projectUpdate){
      throw new NotFoundException(`Project with id ${id} not found`)
    }
    
    return projectUpdate
  }

  async remove(id: number) {
    const deletedProject = await this.prismaService.project.delete({
      where: { id : id }
    })

    if(!deletedProject){
      throw new NotFoundException(`Project with id ${id} not found`)
    }

    return deletedProject
  }
}
