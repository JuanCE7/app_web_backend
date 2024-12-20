import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  const mockUsersService = {
    createUser: jest.fn(),
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('Create User', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'Administrator',
      };

      const createdUser = { ...createUserDto, id: '1' };
      mockUsersService.createUser.mockResolvedValue(createdUser);

      const result = await usersController.create(createUserDto);
      expect(result).toEqual(createdUser);
      expect(usersService.createUser).toHaveBeenCalledWith(createUserDto);
    });

    it('should throw ConflictException if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'Administrator',
      };

      mockUsersService.createUser.mockRejectedValue(
        new ConflictException('Email already exists'),
      );

      await expect(usersController.create(createUserDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('Find All', () => {
    it('Debe devolver todos los usuarios', async () => {
      const result = await usersController.findAll();
      expect(result);
      expect(usersService.getUsers).toHaveBeenCalled();
    });
  });

  describe('Get User By Id', () => {
    it('should return a user by ID', async () => {
      const user = {
        id: '1',
        email: 'john@example.com',
        entity: { firstName: 'John', lastName: 'Doe' },
        role: { name: 'Administrator' },
      };
      mockUsersService.getUserById.mockResolvedValue(user);

      const result = await usersController.findOne('1');
      expect(result).toEqual(user);
      expect(usersService.getUserById).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockUsersService.getUserById.mockRejectedValue(
        new NotFoundException('User not found'),
      );

      await expect(usersController.findOne('999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('Update Profile User', () => {
    it('should update user profile', async () => {
      const updateUserDto: UpdateUserDto = {
        firstName: 'UpdatedName',
        lastName: 'UpdatedLastName',
        email: 'updated@example.com',
        password: 'updatedPassword',
        role: 'Administrator',
      };

      const updatedUser = {
        id: '1',
        email: updateUserDto.email,
        entity: {
          firstName: updateUserDto.firstName,
          lastName: updateUserDto.lastName,
        },
        role: { name: updateUserDto.role },
      };

      mockUsersService.updateUser.mockResolvedValue(updatedUser);

      const result = await usersController.update('1', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(usersService.updateUser).toHaveBeenCalledWith('1', updateUserDto);
    });

    it('Debe cambiar el rol de usuario', async () => {
      const updateUserDto: UpdateUserDto = {
        role: 'Administrator',
      };
      const updatedUser = {
        id: '1',
        role: { name: updateUserDto.role },
      };
      mockUsersService.updateUser.mockResolvedValue(updatedUser);
      const result = await usersController.update('1', updateUserDto);
      expect(result).toEqual(updatedUser);
      expect(usersService.updateUser).toHaveBeenCalledWith('1', updateUserDto);
    });
  });
});
