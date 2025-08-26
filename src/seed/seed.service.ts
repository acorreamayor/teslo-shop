import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { ProductsService } from '../products/products.service';
import { initialData } from './seed-data';
import { User } from 'src/auth/entities/user.entity';
import {Repository } from 'typeorm';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService,
    
    @InjectRepository( User )
    private readonly userRepository: Repository<User>,
    
  ){}

  async runSeed() {

    await this.deleteTables();

    const user = await this.insetarNewUsers();

    await this.insetarNewProducts( user );

    return `This action returns all seed`;
  }

  private async insetarNewProducts( user: User ) {
    this.productsService.removeAll();

    const products = initialData.products;

    const insertPromises: any[] = [];

    products.forEach( product => {
      insertPromises.push(this.productsService.create(product, user));
      
    })

    await Promise.all(insertPromises);

    return true;
  }

  private async insetarNewUsers() {
    const seedUsers = initialData.users;
    const users : User[] = [];

    seedUsers.forEach( user => {
      user.password = bcrypt.hashSync( user.password, 10 );
      users.push( this.userRepository.create( user ) );
    })

    await this.userRepository.save( users );

    return users[0];
  }


  private async deleteTables( ) {
    await this.productsService.removeAll();

    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({  })
      .execute(); 
  }
}
