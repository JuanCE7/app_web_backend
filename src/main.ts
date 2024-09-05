import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api')


  const config = new DocumentBuilder()
    .setTitle('Project Test Case Use Case')
    .setDescription('The project API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  const cors ={
    origin: ['http://localhost:4000'],
    methods: 'GET, HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  }

  app.enableCors(cors);

  await app.listen(4000);
}
bootstrap();
