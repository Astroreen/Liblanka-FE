import { ProductColorDto } from "./ProductColorDto";
import { ProductSizeDto } from "./ProductSizeDto";
import { ProductTypeDto } from "./ProductTypeDto";
import { ProductVariantDto } from "./ProductVariantDto";
import { ProductImageDto } from "./ProductImageDto";

export interface ProductDto {
    id?: number;
    name: string;
    typeId: number;
    typeName?: string;
    description?: string;
    price: number;
    attributes?: string[];
    variants?: ProductVariantDto[];
    variantsByColor?: Record<number, ProductVariantDto[]>;
    colors?: ProductColorDto[];
    sizes?: ProductSizeDto[];
    type?: ProductTypeDto;
    images?: ProductImageDto[]; // Array of image objects
}
