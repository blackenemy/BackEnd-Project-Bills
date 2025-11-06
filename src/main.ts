import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { apiReference } from '@scalar/nestjs-api-reference';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { statusEnum } from 'src/common/enum/status-enum';
import { BillLogAction } from 'src/common/enum/bill-enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // เปิด CORS สำหรับ frontend ที่ port 3000
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'https://projectbill.netlify.app/',
      'http://localhost:5173', // สำหรับ Vite
      'http://localhost:4200'  // สำหรับ Angular
    ],
    credentials: true,
  });

  // สร้างเอกสาร OpenAPI (แก้ข้อมูลให้ตรงกับโปรเจกต์)
  const config = new DocumentBuilder()
    .setTitle('Bills Management API')
    .setDescription('API สำหรับจัดการบิล — สร้าง แก้ไข ติดตาม และบันทึกสถานะ')
    .setVersion('0.0.1')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'bearer',
    )
    .addTag('Bill', 'จัดการบิล')
    .addTag('BillLog', 'บันทึกการเปลี่ยนสถานะ/กิจกรรม')
    .addTag('User', 'จัดการผู้ใช้และสิทธิ์')
    .addTag('Customer', 'ข้อมูลลูกค้า')
    .build();

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  // ระบุพอร์ตก่อนสร้างเอกสารเพื่อใช้ใน server URLs ของ OpenAPI
  const port = Number(process.env.PORT ?? 3001);

  const document = SwaggerModule.createDocument(app, config);

  // เติมข้อมูล servers ให้ OpenAPI (จะแสดงใน /openapi.json และ UI)
  document.servers = [
    { url: `http://localhost:${port}`, description: 'Local development' },
    { url: process.env.API_URL ?? `http://localhost:${port}`, description: 'Configured API URL' },
  ];

  // เพิ่มตัวอย่างตัวเต็มสำหรับ DTOs ใน components.examples เพื่อให้ UI แสดง request examples
  (document as any).components = (document as any).components ?? {};
  (document as any).components.examples = {
    CreateBillDto: {
      summary: 'ตัวอย่างการสร้างบิล (ฉบับร่าง)',
      value: {
        title: 'รายชื่อสินค้า',
        description: 'ค่าใช้จ่ายของสินค้าทั้งหมด',
        amount: '1250.50',
        status: statusEnum.DRAFT,
      },
    },
    UpdateBillDto: {
      summary: 'ตัวอย่างการอัปเดตบิล',
      value: {
        title: 'แก้ไขชื่อบิล',
        description: 'ปรับจำนวนเงิน',
        amount: '1300.00',
        status: statusEnum.APPROVED,
      },
    },
    CreateBillLogDto: {
      summary: 'ตัวอย่างการสร้างบันทึกบิล',
      value: {
        billId: 1,
        action: BillLogAction.CREATED,
        userId: 1,
        oldStatus: statusEnum.PENDING,
        newStatus: statusEnum.APPROVED,
        note: 'สร้างบิลแล้ว',
      },
    },
  };

  app.use('/openapi.json', (req, res) => res.json(document));

  // ---- Scalar UI (อ่านจาก /openapi.json) ----
  // ติดตั้งหน้า Scalar API Reference ที่ /reference
  app.use(
    '/reference',
    apiReference({
      url: '/openapi.json',
      theme: 'purple',
      content: document,
      // ระบุการตั้งค่า authentication ให้ชัดเจนสำหรับ UI
      authentication: {
        preferredSecurityScheme: 'bearer',
      },
      // ข้อมูล UI เบื้องต้น (ถ้ามี static assets ให้วางไว้ใน public)
      // ui: {
      //   title: 'Bills API Reference',
      //   logoUrl: '/assets/logo.png',
      //   faviconUrl: '/assets/favicon.ico',
      // },
    }),
  );

  await app.listen(port);
  
  console.log(`🚀 API Server is running on: http://localhost:${port}`);
  console.log(`📚 OpenAPI JSON:             http://localhost:${port}/openapi.json`);
  console.log(`📖 Scalar UI:                http://localhost:${port}/reference`);
  console.log(`🧪 Test Endpoint:            http://localhost:${port}/test`);
  console.log(`❤️  Health Check:            http://localhost:${port}/health`);
}
void bootstrap();
