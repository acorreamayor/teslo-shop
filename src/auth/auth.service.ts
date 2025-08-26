import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from './entities/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) {}

  
  // Registrar usuarios
  async create(createAuthDto: CreateUserDto) {

    try{

      const { password, ...userData } = createAuthDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });

      await this.userRepository.save(user);

      const { password: _, ...rest } = user;

      return {
        ...rest,
        token: this.getJwtToken({ id: rest.id })
      };

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async login(loginUserDto: LoginUserDto) {

    try{

      const { password, email } = loginUserDto;
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true }
      });

      if (!user)
        throw new BadRequestException('Invalid credentials (email)');

      if (!bcrypt.compareSync(password, user.password))
        throw new BadRequestException('Invalid credentials (password)');

      const { password: _, ...rest } = user;

      return {
        ...rest,
        token: this.getJwtToken({ id: rest.id })
      };
      
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async checkAuthStatus(user: User) {

    try{

      const { password: _, ...rest } = user;

      return {
        ...rest,
        token: this.getJwtToken({ id: rest.id })
      };
      
    } catch (error) {
      this.handleExceptions(error);
    }
  }


  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }


  private handleExceptions(error: any) {
    this.logger.error(error);
    if (error.detail)
      throw new BadRequestException(error.detail);
    if (error.where)
      throw new BadRequestException(error.where);

    throw new InternalServerErrorException('Unexpected error, check server logs');
  }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // // update(id: number, updateAuthDto: UpdateAuthDto) {
  // //   return `This action updates a #${id} auth`;
  // // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
