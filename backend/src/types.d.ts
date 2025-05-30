import { UserDocument } from './schemes/user.schema';

export class Ingredient {
  name: string;
  quantity: number;
}

export interface RequestWithUser extends Request {
  user: UserDocument;
}
