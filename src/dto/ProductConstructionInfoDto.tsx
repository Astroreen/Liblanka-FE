import { ProductColorDto } from "./ProductColorDto";
import { ProductSizeDto } from "./ProductSizeDto";
import { ProductTypeDto } from "./ProductTypeDto";

export interface ProductConstructionInfoDto {
    types: ProductTypeDto[];
    colors: ProductColorDto[];
    sizes: ProductSizeDto[];
}