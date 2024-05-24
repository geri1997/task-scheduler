import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/user.schema';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(createUserDto: CreateUserDto): Promise<{ accessToken: string }> {
    try {
      const salt = 10;

      const hashedPassword = await bcrypt.hash(createUserDto.password, salt);

      const createdUser = await this.usersService.createUser({
        ...createUserDto,
        password: hashedPassword,
      });

      const payload = this.constructJwtPayload(createdUser);

      return {
        accessToken: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  constructJwtPayload(user: User) {
    return {
      sub: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
  }
}
