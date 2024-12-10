import { Test, TestingModule } from '@nestjs/testing';
import { CreateUseCaseDto } from '../usecases/dto/create-usecase.dto';
import { UpdateUseCaseDto } from '../usecases/dto/update-usecase.dto';
import { UsecasesController } from '../usecases/usecases.controller';
import { UsecasesService } from '../usecases/usecases.service';

describe('UsecasesController', () => {
  let usecasesController: UsecasesController;
  let usecasesService: UsecasesService;

  const mockUsecasesService = {
    create: jest.fn((dto) => ({ ...dto, id: '1' })),
    findAll: jest.fn((projectId) => [{ usecaseId: '1', projectId }]),
    findOne: jest.fn((id) => ({ usecaseId: id, name: 'Test Usecase' })),
    update: jest.fn((id, dto) => ({ usecaseId: id, ...dto })),
    remove: jest.fn((id) => ({ usecaseId: id, removed: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsecasesController],
      providers: [
        {
          provide: UsecasesService,
          useValue: mockUsecasesService,
        },
      ],
    }).compile();

    usecasesController = module.get<UsecasesController>(UsecasesController);
    usecasesService = module.get<UsecasesService>(UsecasesService);
  });

  it('should be defined', () => {
    expect(usecasesController).toBeDefined();
  });

  describe('create', () => {
    it('Debe crear un caso de uso', async () => {
      const createUseCaseDto: CreateUseCaseDto = {
        code: '123',
        name: 'New Usecase',
        description: 'Usecase description',
        preconditions: 'test',
        postconditions: 'test',
        mainFlow: 'inicia y termina',
        projectId: '1',
        alternateFlows: 'termina e inicia',
      };
      const result = await usecasesController.create(createUseCaseDto);
      expect(result).toEqual({ ...createUseCaseDto, id: '1' });
      expect(usecasesService.create).toHaveBeenCalledWith(createUseCaseDto);
    });
  });

  describe('findAll', () => {
    it('Debe devolver todos los casos de uso de un proyecto', async () => {
      const projectId = '1';
      const result = await usecasesController.findAll(projectId);
      expect(result).toEqual([{ usecaseId: '1', projectId }]);
      expect(usecasesService.findAll).toHaveBeenCalledWith(projectId);
    });
  });

  describe('findOne', () => {
    it('Debe devolver un caso de uso', async () => {
      const id = '1';
      const result = await usecasesController.findOne(id);
      expect(result).toEqual({ usecaseId: id, name: 'Test Usecase' });
      expect(usecasesService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('Debe actualizar un caso de uso', async () => {
      const id = '1';
      const updateUseCaseDto: UpdateUseCaseDto = { name: 'Updated Usecase' };
      const result = await usecasesController.update(id, updateUseCaseDto);
      expect(result).toEqual({ usecaseId: id, ...updateUseCaseDto });
      expect(usecasesService.update).toHaveBeenCalledWith(id, updateUseCaseDto);
    });
  });

  describe('remove', () => {
    it('Debe eliminar un caso de uso', async () => {
      const id = '1';
      const result = await usecasesController.remove(id);
      expect(result).toEqual({ usecaseId: id, removed: true });
      expect(usecasesService.remove).toHaveBeenCalledWith(id);
    });
  });
});
