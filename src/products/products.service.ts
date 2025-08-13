import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException, Param, ParseUUIDPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProductImage } from './entities';

@Injectable()
export  class ProductsService {
  
  private readonly logger = new Logger('ProductsService');
  private default_limit: number;


  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSourse: DataSource,

    private readonly configService: ConfigService
    
  ) {
    this.default_limit = configService.get<number>('default_limit') || 10;
  }
  
  async create(createProductDto: CreateProductDto) {

    try {

      const { images = [], ...productDetails } = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map( image => this.productImageRepository.create({ url: image }) )
      });
      
      await this.productRepository.save(product);

      return { ...product, images: images };

    } catch(error) {
      this.handleExceptions(error);
    }
  }

  async findAll( paginationDto: PaginationDto ) {

    const { limit = this.default_limit, offset = 0 } = paginationDto;

    const products = await this.productRepository.find({
      skip: offset,
      take: limit,
      relations: {
        images: true
      }
      //order: { title: 'DESC' },
    });

    return products.map( ({ images,  ...product } ) => ({
      ...product,
      images: images?.map( img => img.url )
    }) );

    // return products.map( product => ({
    //   ...product,
    //   images: product.images?.map( img => img.url )
    // }) );

  }

  async findOne(id: string) {
      const product = await this.productRepository.findOne({ 
        where: [{ id:id }],
        relations: {
          images: true
        }
      });

      if (!product)
        throw new NotFoundException(`producto con id ${ id } no fue encontrado`);

      return { ...product, images: product.images?.map( img => img.url ) };
  }

  async findOneFor_slug_title(term: string) {

    const product = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.images', 'producImages')
      .where('LOWER(product.slug) = LOWER(:term)', { term })
      .orWhere('LOWER(product.title) = LOWER(:term)', { term })
      .getOne();

    //console.log(term);

    // const product = await this.productRepository.findOne({ 
    //   where: [
    //     { slug: term.toLocaleLowerCase() },
    //     { title: term.toLocaleLowerCase() },
    //   ],
    //   relations: {
    //     images: true
    //   }
    // });

    
    if (!product)
      throw new NotFoundException(`producto con term ${ term } no fue encontrado`);

    return { ...product, images: product.images?.map( img => img.url ) };
  }


  async update(id: string, updateProductDto: UpdateProductDto) {

      const { images, ...toUpdate } = updateProductDto;

      let product = await this.productRepository.preload({ 
        id: id, 
        ...toUpdate,
        images: []
      });

      if (!product)
        throw new NotFoundException(`producto con id ${ id } no fue encontrado`);

      // create query runner
      const queryRunner = this.dataSourse.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {

        if (images) {
          await queryRunner.manager.delete(ProductImage, { product: { id } });

          product.images = images.map(image => this.productImageRepository.create({ url: image }));

        } else {
          product.images = await this.productImageRepository.findBy({ product: { id: id } });
        }

        await queryRunner.manager.save( product );

        await queryRunner.commitTransaction();
        await queryRunner.release();
        // product = await this.productRepository.save( product );
  
        this.findOne(id);

      } catch(error) {
        await queryRunner.rollbackTransaction();
        await queryRunner.release();

        this.handleExceptions(error);
      }      

      return product;
  }

  async remove(id: string) {
    await this.findOne(id);

    try {

      await this.productRepository.delete({ id: id });

    } catch(error) {
      this.handleExceptions(error);
    }
  }

  async removeAll() {
    const query = this.productRepository.createQueryBuilder('product');

    try {

      // await this.productRepository.delete({ });

      return await query
        .delete()
        .where({})
        .execute();

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
