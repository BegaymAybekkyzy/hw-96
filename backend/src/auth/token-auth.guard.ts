import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { JWT_SECRET, User, UserDocument } from '../schemes/user.schema';

@Injectable()
export class TokenAuthGuard implements CanActivate {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const token = request.get('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return false;
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
      const user = await this.userModel.findOne({ _id: decoded.id, token });

      if (!user) {
        return false;
      }

      request.user = user;

      return true;
    } catch (err) {
      console.error('JWT verification failed:', err);
      return false;
    }
  }
}
