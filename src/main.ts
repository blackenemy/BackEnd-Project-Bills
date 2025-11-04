import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เปิด CORS สำหรับ frontend ที่ port 3000
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'http://localhost:5173', // สำหรับ Vite
      'http://localhost:4200'  // สำหรับ Angular
    ],
    credentials: true,
  });

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

  const port = process.env.PORT ?? 3001;
  await app.listen(port);
  
  console.log(`🚀 API Server is running on: http://localhost:${port}`);
  console.log(`📚 OpenAPI JSON:             http://localhost:${port}/openapi.json`);
  console.log(`📖 Scalar UI:                http://localhost:${port}/reference`);
  console.log(`🧪 Test Endpoint:            http://localhost:${port}/test`);
  console.log(`❤️  Health Check:            http://localhost:${port}/health`);
}
void bootstrap();
