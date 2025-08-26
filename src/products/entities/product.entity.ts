import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";


@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        description: 'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: 'Carlos Torre',
        description: 'Title of the product'
    })
    @Column('text', {
        unique: true
    })
    title: string;

    @ApiProperty()
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: 'Aliquip laboris sint aliqua occaecat nostrud ad eiusmod id fugiat enim duis.',
        description: 'Product description'
    })
    @Column({
        type: 'text',
        nullable: true
    })
    description: string;

    @ApiProperty({
        example: 't_shirt_teslo',
        description: 'Product SLUG - for SEO',
        uniqueItems: true
    })
    @Column({
        type: 'text',
        unique: true
    })
    slug: string;

    
    @ApiProperty({
        example: 25,
        description: 'Producto stock',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    @ApiProperty()
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'women',
        description: 'Product gender'
    })
    @Column('text')
    gender: string;

    @ApiProperty()
    @Column('text', {
        array: true,
        default: []
    })
    tags: string[];

    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        { cascade: true }
    )
    images?: ProductImage[]

    @ManyToOne(
        () => User,
        //(user) => user.product,
        { eager: true }
        
    )
    user: User;
    

    @BeforeInsert()
    checkSlugtInsert() {
        if ( !this.slug ) {
            this.slug = this.title;
          } 

        this.slug = this.slug
                    .toLowerCase()
                    .replaceAll(' ', '_')
                    .replaceAll("'", '')
                    ;
    }

    @BeforeUpdate()
    checkSlugtUpdate() {
        this.slug = this.slug
                    .toLowerCase()
                    .replaceAll(' ', '_')
                    .replaceAll("'", '')
                    ;
    }
}
