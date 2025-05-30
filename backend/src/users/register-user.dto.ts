import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export class RegisterUserDto {
  @Matches(regex, { message: 'Email invalid' })
  @IsEmail({}, { message: 'Email invalid' })
  @IsNotEmpty({ message: 'The email field must not be empty' })
  email: string;

  @IsString({ message: 'The password must be a string' })
  @IsNotEmpty({ message: 'The password field must not be empty' })
  @MinLength(6, { message: 'The password must be at least 6 characters' })
  password: string;

  @IsString({ message: 'The displayName must be a string' })
  @IsNotEmpty({ message: 'The displayName field must not be empty' })
  displayName: string;

  @IsOptional()
  googleID: string;
}
