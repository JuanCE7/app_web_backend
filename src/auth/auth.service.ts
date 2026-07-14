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
import { ResetPasswordDto } from './dto/reset-password.dto';
import { jwtSecret } from '../utils/constants';

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

  async logout(authHeader: string) {
    // El controlador entrega el header completo ("Bearer xxx"); guardamos solo el token.
    const token = authHeader?.replace(/^Bearer\s+/i, '') ?? authHeader;
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

    // No devolvemos la contraseña (ni siquiera el hash) en la respuesta.
    return {
      firstName,
      lastName,
      email,
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
      'Recuperación de contraseña en CaseCraft',
      htmlContent,
    );

    return { otpToken };
  }

  async verifyOtp({ token, enteredOtp }: VerifyOtpDto) {
    try {
      // verifyAsync valida la FIRMA y la expiración del token (antes se usaba
      // decode, que no verifica firma: cualquiera podía forjar un token OTP).
      const decoded = await this.jwtService.verifyAsync<{
        email: string;
        otp: string;
      }>(token, { secret: jwtSecret });

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
      // TokenExpiredError / JsonWebTokenError de la verificación de firma
      throw new UnauthorizedException('Código OTP inválido o expirado');
    }
  }

  async resetPassword({ token, newPassword }: ResetPasswordDto) {
    let email: string;
    try {
      // Autorizado por el token OTP firmado (mismo que valida verifyOtp).
      const decoded = await this.jwtService.verifyAsync<{ email: string }>(
        token,
        { secret: jwtSecret },
      );
      email = decoded.email;
    } catch {
      throw new UnauthorizedException(
        'El enlace de recuperación es inválido o expiró.',
      );
    }

    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado.');
    }

    await this.usersService.updateUser(user.id, { password: newPassword });
    return { success: true, message: 'Contraseña actualizada correctamente' };
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

    // El check de cuenta desactivada vive ahora en el backend (antes solo lo
    // hacía el frontend, que ya no puede consultar /users sin autenticación).
    if (!user.status) {
      throw new UnauthorizedException('CUENTA_DESACTIVADA');
    }

    return user;
  }

  async login({ email, password }: LoginDto) {
    try {
      const user = await this.validateUser(email, password);
      // El payload guarda el nombre del rol (string), no el objeto Role, para
      // que RolesGuard pueda comparar contra el enum. Expiry 1d: cómodamente
      // mayor que la sesión de NextAuth (1h) para evitar 401 a mitad de sesión.
      const payload = { email: user.email, role: user.role.name };
      const token = await this.jwtService.signAsync(payload, {
        expiresIn: '1d',
      });

      return {
        token,
        email: user.email,
        role: user.role.name,
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        if (error.message === 'CUENTA_DESACTIVADA') {
          throw new UnauthorizedException(
            'Tu cuenta ha sido desactivada. Contacta con soporte.',
          );
        }
        throw new UnauthorizedException('Correo o contraseña incorrectos.');
      }
      throw new InternalServerErrorException('Error al procesar la solicitud.');
    }
  }

  async profile({ email }: { email: string; role: string }) {
    return await this.usersService.findByEmail(email);
  }
}
