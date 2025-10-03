import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsOptional, IsString } from "class-validator";
import { RoleEnum } from "src/common/enum/role-enum";

export class CreateUserDto {
  @ApiProperty({example: 'ben', description: 'ชื่อผู้ใช้'})
  @IsString()
  @IsOptional()
  username: string;

  @ApiProperty({example: '1234', description: 'รหัสผ่าน'})
  @IsString()
  @IsOptional()
  password: string

  @ApiProperty({example: 'คำมี', description: 'ชื่อจริง'})
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiProperty({example: 'แสนคำ', description: 'นามสกุล'})
  @IsString()
  @IsOptional()
  lastName: string

  @ApiProperty({example: RoleEnum.USER, description: 'สิทธิ์การใช้งาน'})
  @IsEnum(RoleEnum)
  @IsOptional()
  role: RoleEnum;

  @ApiProperty({example: '2023-10-10T14:48:00.000Z', description: 'วันที่สร้าง'})
  @IsDate()
  @IsOptional()
  created_At: Date;

  @ApiProperty({example: '2023-10-10T14:48:00.000Z', description: 'วันที่แก้ไขล่าสุด'})
  @IsDate()
  @IsOptional()
  updated_At: Date;
}
