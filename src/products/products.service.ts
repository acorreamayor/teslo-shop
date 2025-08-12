import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Param, ParseUUIDPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export  class ProductsService {
  
  private readonly logger = new Logger('ProductsService');
  private default_limit: number;


  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    private readonly configService: ConfigService
    
  ) {
    this.default_limit = configService.get<number>('default_limit') || 10;
  }
  
  async create(createProductDto: CreateProductDto) {

    try {

      const product = this.productRepository.create(createProductDto);
      await this.productRepository.save(product);

      return product;

    } catch(error) {
      this.handleExceptions(error);
    }
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = this.default_limit, offset = 0 } = paginationDto;

    return await this.productRepository.findAndCount({
      skip: offset,
      take: limit,
      //order: { title: 'DESC' },
    });
  }

  async findOne(id: string) {
      const product = await this.productRepository.findOneBy({ id });

      if (!product)
        throw new NotFoundException(`producto con id ${ id } no fue encontrado`);

      return product;
  }

  async findOneFor_slug_title(term: string) {

    const product = await this.productRepository
      .createQueryBuilder('product')
      .where('LOWER(product.slug) = LOWER(:term)', { term })
      .orWhere('LOWER(product.title) = LOWER(:term)', { term })
      .getOne();
    
    if (!product)
      throw new NotFoundException(`producto con term ${ term } no fue encontrado`);

    return product;
  }


  async update(id: string, updateProductDto: UpdateProductDto) {

      let product = await this.productRepository.preload({ 
        id: id, 
        ...updateProductDto
      });

      if (!product)
        throw new NotFoundException(`producto con id ${ id } no fue encontrado`);

      try {

        product = await this.productRepository.save( product );
  
      } catch(error) {
        this.handleExceptions(error);
      }      

      return product;
  }

  async remove(id: string) {
    await this.findOne(id);

    try {

      this.productRepository.delete({ id: id });

    } catch(error) {
      this.handleExceptions(error);
    }
  }


  private handleExceptions( error: any ) {
    this.logger.error(error);

    if (error.detail)
      throw new BadRequestException(error.detail);

    if (error.where)
      throw new BadRequestException(error.where);

    throw new InternalServerErrorException(error);
}
}
