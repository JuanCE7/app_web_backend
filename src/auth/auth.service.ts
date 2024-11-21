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
    return { message: 'Successfully logged out' };
  }

  async register({ firstName, lastName, email, password }: RegisterUserDto) {
    console.log(firstName,lastName,email,password)
    const user = await this.usersService.findByEmail(email);
    if (user) {
      throw new BadRequestException('User already exists');
    }

    await this.usersService.createUser({
      firstName,
      lastName,
      email,
      password,
      status: true,
      role: Roles.Tester,
      image: '',
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
      console.log(process.env.SMTP_USER);
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error('Error sending email:', error);
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
      'Recuperación de contraseña en CaseCraft',
      htmlContent
    );

    return { otpToken };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<boolean> {
    try {
      const decoded = await this.jwtService.verifyAsync(verifyOtpDto.token);

      // Verificar si el OTP ingresado coincide con el OTP almacenado en el token
      if (decoded.otp === verifyOtpDto.enteredOtp) {
        return true;
      } else {
        throw new UnauthorizedException('El código OTP es incorrecto');
      }
    } catch (error) {
      throw new UnauthorizedException(
        'El código OTP ha expirado o es inválido',
      );
    }
  }

  async login({ email, password }: LoginDto) {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Correo incorrecto');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta');
    }

    const payload = { email: user.email, role: user.role };
    const token = await this.jwtService.signAsync(payload);

    return {
      token,
      email,
      role: user.role.name,
    };
  }

  async profile({ email, role }: { email: string; role: string }) {
    return await this.usersService.findByEmail(email);
  }
}
