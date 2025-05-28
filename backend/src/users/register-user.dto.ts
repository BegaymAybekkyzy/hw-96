import {
  IsEmail,
  IsEnum,
  IsJWT,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Min,
} from 'class-validator';
import { UserRole } from '../common/role.enum';

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class RegisterUserDto {
  @Matches(regex, { message: 'Email invalid' })
  @IsEmail({}, { message: 'Email invalid' })
  @IsNotEmpty({ message: 'The email field must not be empty' })
  email: string;

  @IsString({ message: 'The password must be a string' })
  @IsNotEmpty({ message: 'The password field must not be empty' })
  @Min(6, { message: 'The password must be at least 6 characters' })
  password: string;

  @IsJWT({ message: 'The token invalid' })
  @IsNotEmpty({ message: 'Invalid token' })
  token: string;

  @IsString({ message: 'The displayName must be a string' })
  @IsNotEmpty({ message: 'The displayName field must not be empty' })
  displayName: string;

  @IsNotEmpty({ message: 'The avatar field must not be empty' })
  avatar: string;

  @IsOptional()
  googleID: string;

  @IsEnum(UserRole)
  @IsNotEmpty({ message: 'There must be a role for the user' })
  role: string;
}
