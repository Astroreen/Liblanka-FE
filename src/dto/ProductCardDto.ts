export interface ProductCardDto {
  id: number;
  name: string;
  description: string;
  price: number;
  imageData: string | null; // base64 encoded image data
}
