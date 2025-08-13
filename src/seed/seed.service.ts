import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productsService: ProductsService
  ){}

  async runSeed() {
    await this.insetarNewProducts();

    return `This action returns all seed`;
  }

  private async insetarNewProducts() {
    this.productsService.removeAll();

    const products = initialData.products;

    const insertPromises: any[] = [];

    products.forEach( product => {
      insertPromises.push(this.productsService.create(product));
      
    })

    await Promise.all(insertPromises);

    return true;
  }
}
