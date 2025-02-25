import React from "react";
import {ProductCreation} from "./sections/ProductCreation";
import {ProductTypeDto} from "../../../dto/ProductTypeDto";
import {ProductSizeDto} from "../../../dto/ProductSizeDto";
import {ProductColorDto} from "../../../dto/ProductColorDto";
import {ProductTypeCreation} from "./sections/ProductTypeCreation";

export const ProductManager: React.FC = () => {

    let productTypes: ProductTypeDto[] = [
        {name: "Лифчик"},
        {name: "Трусы"}
    ] as ProductTypeDto[];

    let productColors: ProductColorDto[] = [
        {name: "White", hex: "#ffffff"},
        {name: "Black", hex: "#000000"},
        {name: "Red", hex: "#ff0000"},
    ] as ProductColorDto[];

    let productSizes: ProductSizeDto[] = [
        {name: "XL"},
        {name: "L"},
    ] as ProductSizeDto[];

    //get all this data from server using useEffect

    return (
        <>
            <ProductTypeCreation
                header = "Create product type"
                types={productTypes}
            />
            <ProductCreation
                header = "Create new product"
                types={productTypes}
                colors={productColors}
                sizes={productSizes}/>
        </>
    )
}