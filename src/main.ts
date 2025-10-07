import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // สร้างเอกสาร OpenAPI
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API description')
    .setVersion('1.0.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer',
    )
    .addSecurityRequirements('bearer')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const document = SwaggerModule.createDocument(app, config);
  app.use('/openapi.json', (req, res) => res.json(document));

  // ---- Scalar UI (อ่านจาก /openapi.json) ----
  // ติดตั้งหน้า Scalar API Reference ที่ /reference
  app.use(
    '/reference',
    apiReference({
      url: '/openapi.json',
      theme: 'purple',
      content: document,
      authentication: { preferredSecurityScheme: 'bearer' },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log('API:           http://localhost:3000');
  console.log('OpenAPI JSON:  http://localhost:3000/openapi.json');
  console.log('Scalar UI:     http://localhost:3000/reference');
}
void bootstrap();
