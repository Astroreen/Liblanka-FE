import {ProductAttributeDto} from "./ProductAttributeDto";
import {ProductColorDto} from "./ProductColorDto";
import {ProductSizeDto} from "./ProductSizeDto";
import {ProductTypeDto} from "./ProductTypeDto";

export interface ProductDto {
    id?: number;
    name: string;
    type: ProductTypeDto;
    description?: string;
    price: number;
    color: ProductColorDto;
    size: ProductSizeDto[];
    attribute?: ProductAttributeDto[];
    image?: string;
}