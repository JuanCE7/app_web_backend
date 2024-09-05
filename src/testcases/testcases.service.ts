import { Injectable } from '@nestjs/common';
import { CreateTestCaseDto } from './dto/create-testcase.dto';
import { UpdateTestCaseDto } from './dto/update-testcase.dto';

@Injectable()
export class TestcasesService {
  create(createTestcaseDto: CreateTestCaseDto) {
    return 'This action adds a new testcase';
  }

  findAll() {
    return `This action returns all testcases`;
  }

  findOne(id: number) {
    return `This action returns a #${id} testcase`;
  }

  update(id: number, updateTestcaseDto: UpdateTestCaseDto) {
    return `This action updates a #${id} testcase`;
  }

  remove(id: number) {
    return `This action removes a #${id} testcase`;
  }
}
