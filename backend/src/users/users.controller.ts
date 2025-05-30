import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterUserDto } from './register-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User, UserDocument } from '../schemes/user.schema';
import { TokenAuthGuard } from '../auth/token-auth.guard';
import { RequestWithUser } from '../types';
import { FileInterceptor } from '@nestjs/platform-express';
import { imageStorage } from '../common/multer';
import { OAuth2Client } from 'google-auth-library';
import config from '../config';
import { Request } from 'express';

interface GoogleRegisterRequestBody {
  credential: string;
}

const client = new OAuth2Client(config.google.clientID);

@Controller('users')
export class UsersController {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  @Post()
  async googleRegister(
    @Req() req: Request<any, any, GoogleRegisterRequestBody>,
  ) {
    const credential = req.body?.credential;
    if (!credential) {
      throw new BadRequestException('Google login error: credential missing');
    }

    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: config.google.clientID,
    });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new BadRequestException('Google login error: invalid payload');
    }

    const email = payload['email'];
    const displayName = payload['name'];
    const googleID = payload['sub'];
    const avatar = payload['picture'];

    let user = await this.userModel.findOne({ googleID });
    const passwordGeneration = crypto.randomUUID();

    if (!user) {
      user = new this.userModel({
        email,
        password: passwordGeneration,
        displayName,
        googleID,
        avatar,
      });
    }

    user.generateToken();
    await user.save();
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar', imageStorage()))
  registration(
    @UploadedFile() file: Express.Multer.File,
    @Body() registrationDto: RegisterUserDto,
  ) {
    const newUser = new this.userModel({
      email: registrationDto.email,
      password: registrationDto.password,
      avatar: `/avatars/${file.filename}`,
      displayName: registrationDto.displayName,
    });

    if (!file) {
      throw new BadRequestException('The avatar file must be provided');
    }

    newUser.generateToken();
    return newUser.save();
  }

  @UseGuards(AuthGuard('local'))
  @Post('/sessions')
  login(@Req() req: RequestWithUser) {
    req.user.generateToken();
    return req.user.save();
  }

  @UseGuards(TokenAuthGuard)
  @Delete('/sessions')
  async logout(@Req() req: RequestWithUser) {
    req.user.generateToken();
    await req.user.save();
    return 'Success logout';
  }
}
