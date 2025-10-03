import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // สร้างเอกสาร OpenAPI
  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API description')
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  // เสิร์ฟ JSON โดยตรงที่ /openapi.json (ให้ Scalar อ่านผ่าน url)
  app.use('/openapi.json', (req, res) => res.json(document));

  // ---- Scalar UI (อ่านจาก /openapi.json) ----
  // ติดตั้งหน้า Scalar API Reference ที่ /reference
  app.use(
    '/reference',
    apiReference({
      // ใช้ URL โชว์เอกสาร (ง่ายและเสถียร)
      url: '/openapi.json',
      theme: 'purple',
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log('API:           http://localhost:3000');
  console.log('OpenAPI JSON:  http://localhost:3000/openapi.json');
  console.log('Scalar UI:     http://localhost:3000/reference');
}
void bootstrap();
