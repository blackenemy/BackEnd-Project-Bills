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

  @ApiProperty({example: 'สมชาย', description: 'ชื่อจริง'})
  @IsString()
  @IsOptional()
  firstname: string;

  @ApiProperty({example: 'ใจดี', description: 'นามสกุล'})
  @IsString()
  @IsOptional()
  lastname: string

  @ApiProperty({example: RoleEnum.USER, description: 'สิทธิ์การใช้งาน'})
  @IsEnum(RoleEnum)
  @IsOptional()
  role: RoleEnum;

}