import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../schemes/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async userVerification(email: string, password: string) {
    const user = await this.userModel.findOne({ email });

    if (user && (await user.checkPassword(password))) {
      user.generateToken();
      await user.save();
      return user;
    }

    return null;
  }
}
