import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const { password, firstName, lastName, email, role } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      // Buscar el rol por nombre
      const roleRecord = await this.prisma.role.findUnique({
        where: { name: role },
      });

      if (!roleRecord) {
        throw new NotFoundException(`Rol ${role} no encontrado`);
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
        throw new ConflictException('El email ya existe');
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
      throw new NotFoundException(`Usuario no encontrado`);
    }
    return { user };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const { firstName, lastName, email, password, role, status } = updateUserDto;

    const userDataToUpdate: any = {};
    const entityDataToUpdate: any = {};

    if (password) {
      userDataToUpdate.password = await bcrypt.hash(password, 10);
    }

    if (email) userDataToUpdate.email = email;
    if (firstName) entityDataToUpdate.firstName = firstName;
    if (lastName) entityDataToUpdate.lastName = lastName;

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...userDataToUpdate,
          entity: {
            update: entityDataToUpdate,
          },
          role: role
            ? {
                connect: { name: role },
              }
            : undefined,
          status:  status
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
        throw new NotFoundException(`Usuario no encontrado`);
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
}
