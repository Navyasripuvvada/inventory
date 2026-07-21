
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({ origin:["http://localhost:3000",],
      methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
      credentials: true,});

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, 
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  
  const config = new DocumentBuilder()
    .setTitle('Inventory Application API')
    .setDescription('API documentation for Inevntory Backend')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 5000);

  console.log(
    `🚀 Application running at: http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📚 Swagger available at: http://localhost:${process.env.PORT ?? 3000}/api`,
  );
}

bootstrap();