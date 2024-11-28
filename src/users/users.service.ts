import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { password, firstName, lastName, email, role, ...userData } =
      createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Buscar el rol por nombre
      const roleRecord = await this.prisma.role.findUnique({
        where: { name: role },
      });

      if (!roleRecord) {
        throw new NotFoundException(`Role ${role} not found`);
      }

      // Crear el usuario junto con la entidad
      const newUser = await this.prisma.user.create({
        data: {
          email: email,
          password: hashedPassword,
          status: true,
          role: {
            connect: { id: roleRecord.id },
          },
          entity: {
            create: {
              firstName,
              lastName,
            },
          },
        },
        include: {
          entity: true,
          role: true,
        },
      });

      return { user: newUser };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        status: true,
        entity: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
      },
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        email: true,
        status: true,
        entity: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { user };
  }

  async updateProfileUser(id: string, updateUserDto: UpdateUserDto) {
    const { firstName, lastName, email, image, password } = updateUserDto;

    const userDataToUpdate: any = {};
    const entityDataToUpdate: any = {};

    if (password) {
      userDataToUpdate.password = await bcrypt.hash(password, 10);
    }

    if (email) userDataToUpdate.email = email;
    if (firstName) entityDataToUpdate.firstName = firstName;
    if (lastName) entityDataToUpdate.lastName = lastName;
    if (image) entityDataToUpdate.imageEntity = image;

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...userDataToUpdate,
          entity: {
            update: entityDataToUpdate,
          },
        },
        include: {
          entity: true,
          role: true,
        },
      });

      return { user: updatedUser };
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new NotFoundException(`User with id ${id} not found`);
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: {
        entity: true,
        role: true,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const { firstName, lastName, email, role, status } = updateUserDto;

    try {
      const userUpdate = await this.prisma.user.update({
        where: { id },
        data: {
          email,
          status,
          entity: {
            update: {
              firstName,
              lastName,
            },
          },
          role: role
            ? {
                connect: { name: role },
              }
            : undefined,
        },
        include: {
          entity: true,
          role: true,
        },
      });

      if (!userUpdate) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      return userUpdate;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with id ${id} not found`);
        }
      }
      throw error;
    }
  }
}
