import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/user-login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { Roles } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private revokedTokens: Set<string> = new Set();

  
  revokeToken(token: string) {
    this.revokedTokens.add(token);
  }

  isTokenRevoked(token: string): boolean {
    return this.revokedTokens.has(token);
  }

  async logout(token: string) {
    this.revokeToken(token);
    return { message: 'Successfully logged out' };
  }

  async register({
    firstName,
    lastName,
    email,
    password,
  }: RegisterUserDto) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    await this.usersService.createUser({
      firstName,
      lastName,
      email,
      password,
      role: Roles.User
    });

    return {
      firstName,
      lastName,
      email,
      password,
      role: Roles.User
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

    const payload = { email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email,
      role: user.role,
    };
  }

  
  async profile({ email, role }: { email: string; role: string }) {
    return await this.usersService.findByEmail(email);
  }
}
