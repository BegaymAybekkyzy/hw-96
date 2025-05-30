import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Ingredient } from '../types';
import { Document } from 'mongoose';

export type CocktailDocument = Cocktail & Document;

@Schema()
export class Cocktail {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user: Types.ObjectId;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  image: string;

  @Prop({ type: String })
  recipe: string;

  @Prop({ type: Boolean, default: false })
  isPublished: boolean;

  @Prop({
    type: [{ name: String, quantity: Number }],
  })
  ingredients: Ingredient[];
}

export const CocktailSchema = SchemaFactory.createForClass(Cocktail);
