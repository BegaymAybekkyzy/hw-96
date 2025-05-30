import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCocktailDto {
  @IsString({ message: 'The cocktail name must be a string' })
  @IsNotEmpty({ message: 'Cocktail name is required' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Cocktail recipe is required' })
  recipe: string;

  @IsNotEmpty({ message: 'Ingredients recipe is required' })
  ingredients: string;
}
