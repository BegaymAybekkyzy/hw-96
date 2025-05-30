import { UserDocument } from './schemes/user.schema';
import { Request } from 'express';

export class Ingredient {
  name: string;
  quantity: number;
}

export interface RequestWithUser extends Request {
  user: UserDocument;
}
