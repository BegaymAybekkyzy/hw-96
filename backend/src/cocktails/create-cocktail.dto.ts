import { Ingredient } from '../types';
import {
  IsArray,
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsString,
} from 'class-validator';

export class CreateCocktailDto {
  @IsMongoId()
  user: string;

  @IsString({ message: 'The cocktail name must be a string' })
  @IsNotEmpty({ message: 'Cocktail name is required' })
  name: string;

  @IsNotEmpty({ message: 'Cocktail image is required' })
  image: File;

  @IsString()
  @IsNotEmpty({ message: 'Cocktail recipe is required' })
  recipe: string;

  @IsBoolean()
  isPublished: boolean;

  @IsArray()
  ingredients: Ingredient[];
}
