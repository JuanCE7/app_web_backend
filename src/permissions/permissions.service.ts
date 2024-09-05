import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import {PrismaService} from 'src/prisma/prisma.service'
import {Prisma} from '@prisma/client'

@Injectable()
export class PermissionsService {

  constructor (private prismaService: PrismaService) { 
  }

  async create(createPermissionDto: CreatePermissionDto) {
    try {
      return await this.prismaService.permission.create({
        data: createPermissionDto
      })
    } catch (error) {
      console.log(error)
      if(error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code == "P2002"){
          throw new ConflictException(`Permission with type ${createPermissionDto.permissionType} already exists`)
        }
      }
    }
  }

  findAll() {
    return this.prismaService.permission.findMany()
  }

  async findOne(id: number) {
    
    const permissionFound = await this.prismaService.permission.findUnique({
      where: { id : id }
    })
    if(!permissionFound){
      throw new NotFoundException(`Permission with id ${id} not found`)
    }

    return permissionFound
  }


  async update(id: number, updatePermissionDto: UpdatePermissionDto) {
    const permissionUpdate = await this.prismaService.permission.update({
      where: {
        id :id
      },
      data: updatePermissionDto
    })

    if(!permissionUpdate){
      throw new NotFoundException(`Permission with id ${id} not found`)
    }
    
    return permissionUpdate
  }

  async remove(id: number) {
    const deletedPermission = await this.prismaService.permission.delete({
      where: { id : id }
    })

    if(!deletedPermission){
      throw new NotFoundException(`Permission with id ${id} not found`)
    }

    return deletedPermission
  }
}
