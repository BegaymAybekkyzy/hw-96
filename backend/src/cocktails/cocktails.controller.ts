import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cocktail, CocktailDocument } from '../schemes/cocktail.schema';
import { Ingredient, RequestWithUser } from '../types';
import { FileInterceptor } from '@nestjs/platform-express';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { CreateCocktailDto } from './create-cocktail.dto';
import { imageStorage } from '../common/multer';
import { Model, Types } from 'mongoose';

@Controller('cocktails')
export class CocktailsController {
  constructor(
    @InjectModel(Cocktail.name)
    private readonly cocktailModel: Model<CocktailDocument>,
  ) {}

  @UseGuards(TokenAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('image', imageStorage()))
  create(
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File,
    @Body() createCocktailDto: CreateCocktailDto,
  ) {
    const parsedIngredients = JSON.parse(
      createCocktailDto.ingredients,
    ) as Ingredient[];
    const cocktail = new this.cocktailModel({
      user: req.user._id,
      name: createCocktailDto.name,
      image: `/cocktail-images/${file.filename}`,
      recipe: createCocktailDto.recipe,
      ingredients: parsedIngredients,
    });
    return cocktail.save();
  }

  @Get()
  getAll() {
    return this.cocktailModel
      .find({ isPublished: true })
      .populate('user', 'displayName');
  }

  @Get('/:id')
  getByUser(@Param('id') id: string) {
    return this.cocktailModel
      .find({ user: new Types.ObjectId(id) })
      .populate('user', 'displayName');
  }
}
