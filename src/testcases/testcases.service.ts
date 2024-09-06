import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { CreateTestCaseDto } from './dto/create-testcase.dto';
import { UpdateTestCaseDto } from './dto/update-testcase.dto';
import {PrismaService} from 'src/prisma/prisma.service'
import {Prisma} from '@prisma/client'
@Injectable()
export class TestcasesService {

  constructor (private prismaService: PrismaService) {   }


  async create(createTestcaseDto: CreateTestCaseDto) {
    try {
      return await this.prismaService.testCase.create({
        data: createTestcaseDto
      })
    } catch (error) {
      console.log(error)
      if(error instanceof Prisma.PrismaClientKnownRequestError){
        if(error.code == "P2002"){
          throw new ConflictException(`TestCase with name ${createTestcaseDto.name} already exists`)
        }
      }
    }
  }

  findAll() {
    return this.prismaService.testCase.findMany()
  }

  async findOne(id: number) {
    
    const testCaseFound = await this.prismaService.testCase.findUnique({
      where: { id : id }
    })
    if(!testCaseFound){
      throw new NotFoundException(`TestCase with id ${id} not found`)
    }

    return testCaseFound
  }

  async update(id: number, updateTestcaseDto: UpdateTestCaseDto) {
    const testCaseUpdate = await this.prismaService.testCase.update({
      where: {
        id :id
      },
      data: updateTestcaseDto
    })

    if(!testCaseUpdate){
      throw new NotFoundException(`TestCase with id ${id} not found`)
    }
    
    return testCaseUpdate
  }

  async remove(id: number) {
    const deletedTestCase = await this.prismaService.testCase.delete({
      where: { id : id }
    })

    if(!deletedTestCase){
      throw new NotFoundException(`TestCase with id ${id} not found`)
    }

    return deletedTestCase
  }
}
