// src/dtos/update-user.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { UserDto } from './CreateUser.dto';

export class UpdateUserDto extends PartialType(UserDto) {}
