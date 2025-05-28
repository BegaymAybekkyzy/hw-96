import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as argon2 from 'argon2';
import jwt from 'jsonwebtoken';

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 2 ** 16,
  timeCost: 5,
  parallelism: 1,
};

export const JWT_SECRET: string = process.env.JWT_SECRET || 'defaultSecret';

export interface UserDocument extends Document, User {
  checkPassword(password: string): Promise<boolean>;
  generateToken: () => void;
}

@Schema()
export class User {
  @Prop({ type: String })
  email: string;

  @Prop({ type: String })
  displayName: string;

  @Prop({ type: String })
  avatar: string;

  @Prop({ type: String })
  password: string;

  @Prop({ type: String, default: 'user' })
  role: string;

  @Prop({ type: String })
  token: string;

  @Prop({ type: String })
  googleID: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre<UserDocument>('save', async function (this: UserDocument) {
  if (!this.isModified('password')) return;
  this.password = await argon2.hash(this.password, ARGON2_OPTIONS);
});

UserSchema.methods.checkPassword = async function (
  this: UserDocument,
  password: string,
) {
  return await argon2.verify(this.password, password);
};

UserSchema.methods.generateToken = function (this: UserDocument) {
  this.token = jwt.sign({ id: this._id }, JWT_SECRET, { expiresIn: '30d' });
};

UserSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    delete returnedObject.password;
    return returnedObject;
  },
});
