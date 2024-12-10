import { Test, TestingModule } from '@nestjs/testing';
import { ProjectsController } from '../projects/projects.controller';
import { ProjectsService } from '../projects/projects.service';
import { CreateProjectDto } from '../projects/dto/create-project.dto';
import { ShareProjectDto } from '../projects/dto/share-project.dto';
import { ExitProjectDto } from '../projects/dto/exit-project.dto';
import { UpdateProjectDto } from '../projects/dto/update-project.dto';

describe('ProjectsController', () => {
  let projectsController: ProjectsController;
  let projectsService: ProjectsService;

  const mockProjectsService = {
    create: jest.fn((dto) => ({ ...dto, id: '1' })),
    shareProject: jest.fn((dto) => ({ ...dto, shared: true })),
    exitProject: jest.fn((dto) => ({ ...dto, exited: true })),
    findAll: jest.fn((userId) => [{ projectId: '1', userId }]),
    findOne: jest.fn((id) => ({ projectId: id, name: 'Test Project' })),
    update: jest.fn((id, dto) => ({ projectId: id, ...dto })),
    remove: jest.fn((id) => ({ projectId: id, removed: true })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjectsController],
      providers: [
        {
          provide: ProjectsService,
          useValue: mockProjectsService,
        },
      ],
    }).compile();

    projectsController = module.get<ProjectsController>(ProjectsController);
    projectsService = module.get<ProjectsService>(ProjectsService);
  });

  it('should be defined', () => {
    expect(projectsController).toBeDefined();
  });

  describe('create', () => {
    it('Debe crear un proyecto', async () => {
      const createProjectDto: CreateProjectDto = {
        name: 'New Project',
        description: 'Project description',
        userId: '1',
      };
      const result = await projectsController.create(createProjectDto);
      expect(result).toEqual({ ...createProjectDto, id: '1' });
      expect(projectsService.create).toHaveBeenCalledWith(createProjectDto);
    });
  });

  describe('shareProject', () => {
    it('Debe compartir un proyecto', async () => {
      const shareProjectDto: ShareProjectDto = { code: '1', userId: '2' };
      const result = await projectsController.shareProject(shareProjectDto);
      expect(result).toEqual({ ...shareProjectDto, shared: true });
      expect(projectsService.shareProject).toHaveBeenCalledWith(
        shareProjectDto,
      );
    });
  });

  describe('exitProject', () => {
    it('should exit a project', async () => {
      const exitProjectDto: ExitProjectDto = { projectId: '1', userId: '2' };
      const result = await projectsController.exitProject(exitProjectDto);
      expect(result).toEqual({ ...exitProjectDto, exited: true });
      expect(projectsService.exitProject).toHaveBeenCalledWith(exitProjectDto);
    });
  });

  describe('findAll', () => {
    it('Debe devolver todos los proyectos de un usuario', async () => {
      const userId = '2';
      const result = await projectsController.findAll(userId);
      expect(result).toEqual([{ projectId: '1', userId }]);
      expect(projectsService.findAll).toHaveBeenCalledWith(userId);
    });
  });

  describe('findOne', () => {
    it('should return a single project', async () => {
      const id = '1';
      const result = await projectsController.findOne(id);
      expect(result).toEqual({ projectId: id, name: 'Test Project' });
      expect(projectsService.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('Debe actualizar un proyecto', async () => {
      const id = '1';
      const updateProjectDto: UpdateProjectDto = { name: 'Updated Project' };
      const result = await projectsController.update(id, updateProjectDto);
      expect(result).toEqual({ projectId: id, ...updateProjectDto });
      expect(projectsService.update).toHaveBeenCalledWith(id, updateProjectDto);
    });
  });

  describe('remove', () => {
    it('Debe eliminar un proyecto', async () => {
      const id = '1';
      const result = await projectsController.remove(id);
      expect(result).toEqual({ projectId: id, removed: true });
      expect(projectsService.remove).toHaveBeenCalledWith(id);
    });
  });
});
