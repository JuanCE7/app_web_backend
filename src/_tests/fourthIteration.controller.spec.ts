import { Test, TestingModule } from '@nestjs/testing';
import { CreateTestCaseDto } from '../testcases/dto/create-testcase.dto';
import { UpdateTestCaseDto } from '../testcases/dto/update-testcase.dto';
import { TestcasesController } from '../testcases/testcases.controller';
import { TestcasesService } from '../testcases/testcases.service';

describe('TestcasesController', () => {
  let testcasesController: TestcasesController;
  let testcasesService: TestcasesService;

  const mockTestcasesService = {
    generateTestCase: jest.fn((id) => ({ id, generated: true })),
    create: jest.fn((dto) => ({ ...dto, id: '1' })),
    findAll: jest.fn((useCaseId) => [{ testCaseId: '1', useCaseId }]),
    findOne: jest.fn((id) => ({ testCaseId: id, name: 'Test Case' })),
    update: jest.fn((id, dto) => ({ testCaseId: id, ...dto })),
    remove: jest.fn((id) => ({ testCaseId: id, removed: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestcasesController],
      providers: [
        {
          provide: TestcasesService,
          useValue: mockTestcasesService,
        },
      ],
    }).compile();

    testcasesController = module.get<TestcasesController>(TestcasesController);
    testcasesService = module.get<TestcasesService>(TestcasesService);
  });

  it('should be defined', () => {
    expect(testcasesController).toBeDefined();
  });

  describe('generate', () => {
    it('should generate a testcase', async () => {
      const id = '1';
      const result = await testcasesController.generate(id);
      expect(result).toEqual({ id, generated: true });
      expect(testcasesService.generateTestCase).toHaveBeenCalledWith(id);
    });
  });

  describe('create', () => {
    it('should create a testcase', async () => {
      const createTestCaseDto: CreateTestCaseDto = {
        code: '1',
        name: 'New Test Case',
        description: 'Test case description',
        steps: 'test, test',
        expectedResult: 'test result',
        explanationDetails: 'explanation test',
        inputData: 'inputdata test',
        explanationSummary: 'summary test',
        useCaseId: '1',
      };
      const result = await testcasesController.create(createTestCaseDto);
      expect(result).toEqual({ ...createTestCaseDto, id: '1' });
      expect(testcasesService.create).toHaveBeenCalledWith(createTestCaseDto);
    });
  });

  describe('findAll', () => {
    it('should return all testcases for a use case', async () => {
      const useCaseId = '1';
      const result = await testcasesController.findAll(useCaseId);
      expect(result).toEqual([{ testCaseId: '1', useCaseId }]);
      expect(testcasesService.findAll).toHaveBeenCalledWith(useCaseId);
    });
  });

  describe('findOne', () => {
    it('should return a single testcase', async () => {
      const id = '1';
      const result = await testcasesController.findOne(id);
      expect(result).toEqual({ testCaseId: id, name: 'Test Case' });
      expect(testcasesService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should update a testcase', async () => {
      const id = '1';
      const updateTestCaseDto: UpdateTestCaseDto = {
        name: 'Updated Test Case',
      };
      const result = await testcasesController.update(id, updateTestCaseDto);
      expect(result).toEqual({ testCaseId: id, ...updateTestCaseDto });
      expect(testcasesService.update).toHaveBeenCalledWith(
        id,
        updateTestCaseDto,
      );
    });
  });

  describe('remove', () => {
    it('should remove a testcase', async () => {
      const id = '1';
      const result = await testcasesController.remove(id);
      expect(result).toEqual({ testCaseId: id, removed: true });
      expect(testcasesService.remove).toHaveBeenCalledWith(id);
    });
  });
});
