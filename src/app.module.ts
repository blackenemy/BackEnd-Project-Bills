import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { BillsModule } from './bills/bills.module';
import { BillLogsModule } from './bill_logs/bill_logs.module';
import { BillFollowersModule } from './bill_followers/bill_followers.module';
import { Bill } from './bills/entities/bill.entity';
import { BillFollower } from './bill_followers/entities/bill_follower.entity';
import { BillLog } from './bill_logs/entities/bill_log.entity';
import { CustomersModule } from './customers/customers.module';
import { Customer } from './customers/entities/customer.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT ?? 5432),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities: [User, Bill, BillFollower, BillLog, Customer],
        synchronize: process.env.NODE_ENV !== 'production',
        logging: process.env.NODE_ENV === 'development',
    }),

    UserModule,
    AuthModule,
    BillsModule,
    BillLogsModule,
    BillFollowersModule,
    CustomersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
