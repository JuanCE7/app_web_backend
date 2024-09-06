import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import {PrismaService} from 'src/prisma/prisma.service'
import {Prisma} from '@prisma/client'
@Injectable()
export class UsersService {

  constructor (private prismaService: PrismaService) { 
  }

  async create(createUserDto: CreateUserDto) {
    try {
      return await this.prismaService.user.create({
        data: createUserDto
      })
    } catch (error) {
      console.log(error)
      if(error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code == "P2002"){
          throw new ConflictException(`User with email ${createUserDto.email} already exists`)
        }
      }
    }
  }

  findAll() {
    return this.prismaService.user.findMany()
  }

  async findOne(id: number) {
    
    const userFound = await this.prismaService.user.findUnique({
      where: { id : id }
    })
    if(!userFound){
      throw new NotFoundException(`User with id ${id} not found`)
    }

    return userFound
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const userUpdate = await this.prismaService.user.update({
      where: {
        id :id
      },
      data: updateUserDto
    })

    if(!userUpdate){
      throw new NotFoundException(`User with id ${id} not found`)
    }
    
    return userUpdate
  }

  async remove(id: number) {
    const deletedUser = await this.prismaService.user.delete({
      where: { id : id }
    })

    if(!deletedUser){
      throw new NotFoundException(`User with id ${id} not found`)
    }

    return deletedUser
  }
}
