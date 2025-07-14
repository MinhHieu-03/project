import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
} from "class-validator";

export class MasterDataDto {
  @IsNotEmpty()
  @IsString()
  material_no: string;

  @IsNotEmpty()
  @IsString()
  material_nm: string;

  @IsNotEmpty()
  @IsString()
  material_tp: string;

  @IsOptional()
  @IsNumber()
  pk_style: number;

  @IsOptional()
  @IsNumber()
  new_pk_style: number;

  @IsOptional()
  @IsNumber()
  pcs_bag: number;

  @IsOptional()
  @IsNumber()
  flg: number;

  @IsOptional()
  @IsString()
  comment: string;

  @IsOptional()
  @IsString()
  user_id: string;

  @IsOptional()
  @IsDateString()
  ent_dt: Date;

  @IsOptional()
  @IsDateString()
  upd_dt: Date;
}

export class DeleteMultipleDto {
  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  ids: string[];
}
