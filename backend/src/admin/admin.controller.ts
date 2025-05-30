import {
  Controller,
  Delete,
  NotFoundException,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cocktail, CocktailDocument } from '../schemes/cocktail.schema';
import { Model } from 'mongoose';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { PermitGuard } from '../auth/permit.guard';
import { Roles } from '../common/roles.decorator';

@Controller('admin')
export class AdminController {
  constructor(
    @InjectModel(Cocktail.name)
    private readonly cocktailModel: Model<CocktailDocument>,
  ) {}

  @UseGuards(TokenAuthGuard, PermitGuard)
  @Roles('admin')
  @Delete('cocktails/:id')
  async deleteCocktail(@Param('id') id: string) {
    const cocktail = await this.cocktailModel.findByIdAndDelete(id);

    if (!cocktail) {
      throw new NotFoundException('Cocktail not found');
    }

    return { message: 'Cocktail deleted successfully' };
  }

  @UseGuards(TokenAuthGuard, PermitGuard)
  @Roles('admin')
  @Patch('cocktails/:id')
  async publicationStatusChange(@Param('id') id: string) {
    const cocktail = await this.cocktailModel.findById(id);

    if (!cocktail) {
      throw new NotFoundException('Cocktail not found');
    }

    cocktail.isPublished = !cocktail.isPublished;
    await cocktail.save();

    return {
      message: 'Status changed',
      cocktail,
    };
  }
}
