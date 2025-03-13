import React, {useEffect, useState} from "react";
import {ProductCreation} from "./sections/ProductCreation";
import {ProductTypeDto} from "../../../dto/ProductTypeDto";
import {ProductSizeDto} from "../../../dto/ProductSizeDto";
import {ProductColorDto} from "../../../dto/ProductColorDto";
import {ProductTypeCreation} from "./sections/ProductTypeCreation";
import useFetch from "../../../hooks/useFetch";
import {BASE_URL, ENDPOINTS} from "../../../api/apiConfig";

export const ProductManager: React.FC = () => {

    const [productTypes, setProductTypes] = useState<ProductTypeDto[]>(
        [
            {name: "Лифчик"},
            {name: "Трусы"}
        ] as ProductTypeDto[]
    );

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
    const [data, isLoading, error] = useFetch(BASE_URL + ENDPOINTS.product_types);

    useEffect(() => {
        if (error) {
            console.error("Error fetching data while getting product types:", error);
            return;
        }

        if(data) {
            setProductTypes(data as ProductTypeDto[]);
        }
    }, [error, data]); // Depend on `error` to log errors

    return (
        <>
            {
                isLoading || !data ? <p>Loading...</p> :
                    <ProductTypeCreation
                        header="Create product type"
                        types={productTypes}
                    />
            }

            <ProductCreation
                    header="Create new product"
                    types={productTypes}
                    colors={productColors}
                    sizes={productSizes}/>
        </>
    )
}