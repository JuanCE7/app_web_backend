import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUseCaseDto } from './dto/create-usecase.dto';
import { UpdateUseCaseDto } from './dto/update-usecase.dto';
import {PrismaService} from 'src/prisma/prisma.service'
import {Prisma} from '@prisma/client'
@Injectable()
export class UsecasesService {
  constructor (private prismaService: PrismaService) { 
  }

  async create(createUsecaseDto: CreateUseCaseDto) {
    try {
      return await this.prismaService.useCase.create({
        data: createUsecaseDto
      })
    } catch (error) {
      console.log(error)
      if(error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code == "P2002"){
          throw new ConflictException(`Use Case with name ${createUsecaseDto.name} already exists`)
        }
      }
    }
  }

  findAll() {
    return this.prismaService.useCase.findMany()
  }

  async findOne(id: string) {
    
    const useCaseFound = await this.prismaService.useCase.findUnique({
      where: { id : id }
    })
    if(!useCaseFound){
      throw new NotFoundException(`Use Case with id ${id} not found`)
    }

    return useCaseFound
  }

  async update(id: string, updateUsecaseDto: UpdateUseCaseDto) {
    const useCaseUpdate = await this.prismaService.useCase.update({
      where: {
        id :id
      },
      data: updateUsecaseDto
    })

    if(!useCaseUpdate){
      throw new NotFoundException(`Use Case with id ${id} not found`)
    }
    
    return useCaseUpdate
  }

  async remove(id: string) {
    const deletedUseCase = await this.prismaService.useCase.delete({
      where: { id : id }
    })

    if(!deletedUseCase){
      throw new NotFoundException(`Use Case with id ${id} not found`)
    }

    return deletedUseCase
  }
}
