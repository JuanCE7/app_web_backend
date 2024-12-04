import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersController } from '../users/users.controller';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';

describe('UsersController', () => {
  let app: INestApplication;
  let usersService = {
    createUser: jest.fn(),
    getUsers: jest.fn(),
    getUserById: jest.fn(),
    findByEmail: jest.fn(),
    updateProfileUser: jest.fn(),
    updateUser: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/POST users (create)', async () => {
    const createUserDto: CreateUserDto = { firstName: 'Test User', lastName: 'test lastName',
    email: 'test@example.com', password: 'test12345', role: 'Tester', status: false };
    usersService.createUser.mockReturnValue({ id: '1', ...createUserDto });

    return request(app.getHttpServer())
      .post('/users')
      .send(createUserDto)
      .expect(201)
      .expect(usersService.createUser.mock.results[0].value);
  });

  it('/GET users (findAll)', async () => {
    usersService.getUsers.mockReturnValue([{ id: '1', name: 'Test User', email: 'test@example.com' }]);

    return request(app.getHttpServer())
      .get('/users')
      .expect(200)
      .expect(usersService.getUsers.mock.results[0].value);
  });

  it('/GET users/:id (findOne)', async () => {
    const userId = '1';
    usersService.getUserById.mockReturnValue({ id: userId, name: 'Test User', email: 'test@example.com' });

    return request(app.getHttpServer())
      .get(`/users/${userId}`)
      .expect(200)
      .expect(usersService.getUserById.mock.results[0].value);
  });

  it('/GET users/mail/:email (findByEmail)', async () => {
    const email = 'test@example.com';
    usersService.findByEmail.mockReturnValue({ id: '1', name: 'Test User', email });

    return request(app.getHttpServer())
      .get(`/users/mail/${email}`)
      .expect(200)
      .expect(usersService.findByEmail.mock.results[0].value);
  });

//   it('/PATCH users/:id (update)', async () => {
//     const userId = '1';
//     const updateUserDto: UpdateUserDto = { name: 'Updated User' };
//     usersService.updateProfileUser.mockReturnValue({ id: userId, ...updateUserDto });

//     return request(app.getHttpServer())
//       .patch(`/users/${userId}`)
//       .send(updateUserDto)
//       .expect(200)
//       .expect(usersService.updateProfileUser.mock.results[0].value);
//   });

  it('Change Role', async () => {
    const userId = '1';
    const updateUserDto: UpdateUserDto = { role: 'Administrator'};
    usersService.updateUser.mockReturnValue({ id: userId, ...updateUserDto });

    return request(app.getHttpServer())
      .patch(`/users/admin/${userId}`)
      .send(updateUserDto)
      .expect(200)
      .expect(usersService.updateUser.mock.results[0].value);
  });

  afterAll(async () => {
    await app.close();
  });
});
