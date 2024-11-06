import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto'; // Asegúrate de tener los DTOs definidos
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcryptjs';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    // Encriptar la contraseña y crear un nuevo objeto con la contraseña encriptada
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const newUser = await this.prisma.user.create({
        data: {
          ...userData,
          password: hashedPassword,
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

  // Obtener todos los usuarios
  async getUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
  }

  // Obtener un usuario por id
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        role: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { user };
  }

  // Actualizar usuario
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const { password, ...userData } = updateUserDto;
    const hashedPassword = password
      ? await bcrypt.hash(password, 10)
      : undefined;

    try {
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: {
          ...userData,
          password: hashedPassword || undefined,
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

  // Método para encontrar un usuario por email
  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }
    return user;
  }
}
