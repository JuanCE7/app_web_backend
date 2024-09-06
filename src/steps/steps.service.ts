import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateStepDto } from './dto/create-step.dto';
import { UpdateStepDto } from './dto/update-step.dto';
import {PrismaService} from 'src/prisma/prisma.service'
import {Prisma} from '@prisma/client'

@Injectable()
export class StepsService {

  constructor (private prismaService: PrismaService) { 
  }

  async create(createStepDto: CreateStepDto) {
    try {
      return await this.prismaService.step.create({
        data: createStepDto
      })
    } catch (error) {
      console.log(error)
      if(error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code == "P2002"){
          throw new ConflictException(`Step with use case ${createStepDto.testCaseId} already exists`)
        }
      }
    }
  }

  findAll() {
    return this.prismaService.step.findMany()
  }

  async findOne(id: number) {
    
    const stepFound = await this.prismaService.step.findUnique({
      where: { id : id }
    })
    if(!stepFound){
      throw new NotFoundException(`Step with id ${id} not found`)
    }

    return stepFound
  }

  async update(id: number, updateStepDto: UpdateStepDto) {
    const stepUpdate = await this.prismaService.step.update({
      where: {
        id :id
      },
      data: updateStepDto
    })

    if(!stepUpdate){
      throw new NotFoundException(`Step with id ${id} not found`)
    }
    
    return stepUpdate
  }

  async remove(id: number) {
    const deletedStep = await this.prismaService.step.delete({
      where: { id : id }
    })

    if(!deletedStep){
      throw new NotFoundException(`Step with id ${id} not found`)
    }

    return deletedStep
  }
}
