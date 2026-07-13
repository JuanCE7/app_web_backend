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
  await app.listen(port);
}
bootstrap();