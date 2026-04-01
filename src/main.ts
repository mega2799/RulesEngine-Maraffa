import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Business Logic API')
    .setDescription("The MaraffaOnline's business logic API")
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.enableShutdownHooks();
  console.log(
    `🔍 Traces are being sent to: ${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}`,
  );

  const appService = app.get(AppService);
  process.on('SIGTERM', () => appService.shutdown());
  process.on('SIGINT', () => appService.shutdown());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
