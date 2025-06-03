export interface ProductDto {
    id?: number;
    name: string;
    typeId: number;
    description?: string;
    price: number;
    variants: string; //json
    attributes?: string; //json
    images?: File[];
    colorIds?: string; //json
}