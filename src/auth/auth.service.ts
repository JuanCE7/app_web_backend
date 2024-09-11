import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { LoginDto } from './dto/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register({
    firstName,
    lastName,
    email,
    password,
    userType,
  }: CreateUserDto) {
    const user = await this.usersService.findByEmail(email);

    if (user) {
      throw new BadRequestException('User already exists');
    }

    await this.usersService.createUser({
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(password, 10),
      userType,
    });

    return {
      name,
      email,
    };
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('email is wrong');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('password is wrong');
    }

    const payload = { email: user.email, role: user.userType };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email,
    };
  }

  async profile({ email, userType }: { email: string; userType: string }) {
    return await this.usersService.findByEmail(email);
  }
}
