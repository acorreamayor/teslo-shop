import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {

  private readonly logger = new Logger('AuthService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async create(createAuthDto: CreateUserDto) {

    try{
      const user = this.userRepository.create(createAuthDto);
      await this.userRepository.save(user);

      return user;
    } catch (error) {
      this.handleExceptions(error);
    }

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
