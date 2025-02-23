import React from "react";
import {ProductCreation} from "./sections/ProductCreation";
import {ProductTypeDto} from "../../../dto/ProductTypeDto";
import {ProductSizeDto} from "../../../dto/ProductSizeDto";
import {ProductColorDto} from "../../../dto/ProductColorDto";

export const ProductManager: React.FC = () => {

    return (
        <ProductCreation
            types={[
                {name: "Лифчик"},
                {name: "Трусы"}
            ] as ProductTypeDto[]}
            colors={[
                {name: "White", hex: "#ffffff"},
                {name: "Black", hex: "#000000"},
                {name: "Red", hex: "#ff0000"},
            ] as ProductColorDto[]}
            sizes={[
                {name: "XL"},
                {name: "L"},
            ] as ProductSizeDto[]}/>
    )
}