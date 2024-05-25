import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.schema';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from 'src/users/dto/login.dto';
import { JwtPayload } from 'src/shared/interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(
    createUserDto: CreateUserDto,
    imageFile: Express.Multer.File = null,
  ): Promise<{ accessToken: string }> {
    try {
      const salt = 10;

      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      const createdUser = await this.usersService.createUser({
        ...createUserDto,
        password: hashedPassword,
        ...(imageFile && { image: imageFile?.buffer?.toString('base64') }),
      });

      const payload = this.constructJwtPayload(createdUser);

      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findUserByEmail(loginDto.email);
      if (!user) throw new UnauthorizedException('Wrong credentials');

      const passwordsMatch = await bcrypt.compare(
        loginDto.password,
        user.password,
      );
      if (!passwordsMatch) throw new UnauthorizedException('Wrong credentials');

      const payload = this.constructJwtPayload(user);

      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  private constructJwtPayload(user: User): JwtPayload {
    return {
      sub: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
