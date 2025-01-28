import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from './dto/user-login.dto';
import { RegisterUserDto } from './dto/register.dto';
import { Roles } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { transporter } from '../utils/mailer';
import { VerifyOtpDto } from './dto/verifyOtp.dto';

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
    return { message: 'Sesión Cerrada correctamente' };
  }

  async register({ firstName, lastName, email, password }: RegisterUserDto) {
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException('El Correo ya existe');
    }

    await this.usersService.createUser({
      firstName,
      lastName,
      email,
      password,
      status: true,
      role: Roles.Tester,
    });

    return {
      firstName,
      lastName,
      email,
      password,
      status: true,
      role: Roles.Tester,
    };
  }

  private async sendEmail(to: string, subject: string, html: string) {
    try {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
      });
    } catch (error) {
      throw new Error('No se ha podido enviar el correo' + error);
    }
  }

  private async loadTemplate(
    filePath: string,
    variables: { [key: string]: string },
  ) {
    const templatePath = path.resolve(__dirname, filePath);
    let template = fs.readFileSync(templatePath, 'utf8');

    for (const key in variables) {
      template = template.replace(
        new RegExp(`{{${key}}}`, 'g'),
        variables[key],
      );
    }
    return template;
  }

  async generateOtp(email: string): Promise<string> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpToken = await this.jwtService.signAsync(
      { email, otp },
      { expiresIn: '10m' },
    );
    return otpToken;
  }

  async passwordRecovery(email: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException(
        'Este email no se encuentra en la base de datos',
      );
    }
    const firstName = user.entity.firstName;

    const otpToken = await this.generateOtp(email);
    const decoded = (await this.jwtService.decode(otpToken)) as { otp: string };
    const htmlContent = await this.loadTemplate(
      '../../src/utils/templates/passwordRecovery.html',
      {
        firstName,
        otpCode: decoded.otp,
      },
    );

    await this.sendEmail(
      email,
      'Recuperación de contraseña en TestCaseCraft',
      htmlContent,
    );

    return { otpToken };
  }

  async verifyOtp({ token, enteredOtp }: VerifyOtpDto) {
    try {
      const decoded = this.jwtService.decode(token) as {
        email: string;
        otp: string;
        exp: number;
      };
      if (!decoded) {
        throw new UnauthorizedException('Token inválido');
      }
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (decoded.exp && decoded.exp < currentTimestamp) {
        throw new UnauthorizedException('El código OTP ha expirado');
      }
      if (decoded.otp !== enteredOtp) {
        throw new UnauthorizedException('Código OTP inválido');
      }
      return {
        success: true,
        message: 'OTP validado correctamente',
        email: decoded.email,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Error al procesar el código OTP');
    }
  }

  private async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        'No se encontró una cuenta con ese correo electrónico',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    return user;
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.validateUser(email, password);
      const payload = { email: user.email, role: user.role };
      const token = await this.jwtService.signAsync(payload);

      return {
        token,
        email: user.email,
        role: user.role.name,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Correo o contraseña incorrectos.');
      }
      throw new InternalServerErrorException('Error al procesar la solicitud.');
    }
  }

  async profile({ email }: { email: string; role: string }) {
    return await this.usersService.findByEmail(email);
  }
}
