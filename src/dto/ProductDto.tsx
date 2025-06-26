import { ProductColorDto } from "./ProductColorDto";
import { ProductSizeDto } from "./ProductSizeDto";
import { ProductTypeDto } from "./ProductTypeDto";
import { ProductVariantDto } from "./ProductVariantDto";

export interface ProductDto {
    id?: number;
    name: string;
    typeId: number;
    typeName?: string;
    description?: string;
    price: number;
    attributes?: string[];
    imageData?: string[]; // base64 images
    imagesByColor?: Record<number, string[]>;
    variants?: ProductVariantDto[];
    variantsByColor?: Record<number, ProductVariantDto[]>;
    colors?: ProductColorDto[];
    sizes?: ProductSizeDto[];
    type?: ProductTypeDto;
}