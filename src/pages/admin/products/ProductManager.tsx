import React, {useEffect, useState} from "react";
import {ProductCreation} from "./sections/ProductCreation";
import {ProductTypeDto} from "../../../dto/ProductTypeDto";
import {ProductSizeDto} from "../../../dto/ProductSizeDto";
import {ProductColorDto} from "../../../dto/ProductColorDto";
import {ProductTypeCreation} from "./sections/ProductTypeCreation";
import {ProductSizeCreation} from "./sections/ProductSizeCreation";
import useFetch from "../../../hooks/useFetch";
import {BASE_URL, ENDPOINTS} from "../../../api/apiConfig";

export const ProductManager: React.FC = () => {

    const [productTypes, setProductTypes] = useState<ProductTypeDto[]>(
        [
            {name: "Лифчик"},
            {name: "Трусы"}
        ] as ProductTypeDto[]
    );

    const [productSizes, setProductSizes] = useState<ProductSizeDto[]>([
        {name: "XL"},
        {name: "L"},
    ] as ProductSizeDto[]);

    let productColors: ProductColorDto[] = [
        {name: "White", hex: "#ffffff"},
        {name: "Black", hex: "#000000"},
        {name: "Red", hex: "#ff0000"},
    ] as ProductColorDto[];

    //get all this data from server using useEffect
    const [data, isLoading, error] = useFetch(BASE_URL + ENDPOINTS.all_product_info);

    useEffect(() => {
        if (error) {
            console.error("Error fetching data while getting product types:", error);
            return;
        }

        if (!isLoading && data) {
            setProductTypes(data?.types as ProductTypeDto[]);
            setProductSizes(data?.sizes as ProductSizeDto[]);
        }
    }, [error, isLoading, data]); // Depend on `error` to log errors

    return (
        isLoading || !data ? <p className="place-self-center">Loading...</p> :
            <>
                <ProductCreation
                    header="Product creation"
                    types={productTypes}
                    colors={productColors}
                    sizes={productSizes}
                />

                <ProductTypeCreation
                    header="Types"
                    types={productTypes}
                />

                <ProductSizeCreation
                    header="Sizes"
                    sizes={productSizes}
                />
            </>
    )
}