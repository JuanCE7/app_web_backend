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
        status: true,
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
        password: true,
        role: true,
      },
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return { user };
  }

  // Actualizar usuario
  async updateProfileUser(id: string, updateUserDto: UpdateUserDto) {
    // Desestructuramos solo los campos que se deben actualizar
    const { firstName, lastName, email, image, password } = updateUserDto;

    // Creamos un objeto con los datos que vamos a actualizar
    const userDataToUpdate: any = {};

    // Solo actualizamos la contraseña si se proporciona una nueva
    if (password) {
      userDataToUpdate.password = await bcrypt.hash(password, 10);
    }

    // Si se proporcionan los demás campos, los agregamos al objeto de actualización
    if (firstName) userDataToUpdate.firstName = firstName;
    if (lastName) userDataToUpdate.lastName = lastName;
    if (email) userDataToUpdate.email = email;
    if (image) userDataToUpdate.image = image;

    try {
      // Realizamos la actualización solo con los campos que fueron modificados
      const updatedUser = await this.prisma.user.update({
        where: { id },
        data: userDataToUpdate,
      });

      // Retornamos la respuesta con el usuario actualizado
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
  // Actualizar usuario
  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    try {
      const userUpdate = await this.prisma.user.update({
        where: { id },
        data: {
          firstName: updateUserDto.firstName,
          lastName: updateUserDto.lastName,
          email: updateUserDto.email,
          role: updateUserDto.role,
          status: updateUserDto.status,
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
