import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')

  const config = new DocumentBuilder()
    .setTitle('Test Case Craft App')
    .setDescription('El proyecto es una API REST')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useGlobalPipes(
    new ValidationPipe({ 
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Orígenes permitidos: producción (Vercel) + desarrollo local, más
  // cualquier valor extra que se pase por FRONTEND_URL (coma-separado).
  const defaultOrigins = [
    'https://testcasecraftunl.vercel.app',
    'http://localhost:3000',
  ];
  const extraOrigins = (process.env.FRONTEND_URL ?? '')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  const cors = {
    origin: [...new Set([...defaultOrigins, ...extraOrigins])],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  };

  app.enableCors(cors);
  // Render (y la mayoría de PaaS) inyecta el puerto vía la variable PORT.
  const port = process.env.PORT ?? 4000;
  // Enlazamos explícitamente a 0.0.0.0: sin host, Node puede escuchar solo en
  // IPv6 (::) y Render (que escanea 0.0.0.0/IPv4) no detecta el puerto →
  // "No open ports detected". Con 0.0.0.0 queda accesible en todas las interfaces.
  await app.listen(port, '0.0.0.0');
}
bootstrap();