import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, Min } from "class-validator";
import { OrderBy } from "src/common/enum/orderby-enum";
import { RoleEnum } from "src/common/enum/role-enum";

export class getUserDto {
  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsEnum(RoleEnum)
  role?: RoleEnum;

  @ApiProperty({required: false})
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({required: false})
  @IsOptional()
  @IsEnum(OrderBy)
  orderBy?: OrderBy;

  @ApiProperty({required: false})
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  findAll?: boolean;
}