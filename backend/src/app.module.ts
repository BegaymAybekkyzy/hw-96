import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemes/user.schema';
import { CocktailsController } from './cocktails/cocktails.controller';
import { Cocktail, CocktailSchema } from './schemes/cocktail.schema';
import { LocalStrategy } from './auth/local.strategy';
import { AuthService } from './auth/auth.service';
import config from './config';

@Module({
  imports: [
    MongooseModule.forRoot(config.db),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: Cocktail.name, schema: CocktailSchema },
    ]),
  ],
  controllers: [AppController, UsersController, CocktailsController],
  providers: [AppService, LocalStrategy, AuthService],
})
export class AppModule {}
