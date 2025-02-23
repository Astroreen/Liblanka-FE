import React, {useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputAdornment,
    InputLabel,
    Paper,
    Select,
    TextField,
} from "@mui/material";
import {styled} from '@mui/material/styles';
import {AddCircle, Circle, CloudUpload, Delete, Send} from "@mui/icons-material";
import {ProductDto} from "../../../../dto/ProductDto";
import {ProductTypeDto} from "../../../../dto/ProductTypeDto";
import {ProductSizeDto} from "../../../../dto/ProductSizeDto";
import {ProductColorDto} from "../../../../dto/ProductColorDto";
import {SplitButton} from "../../../../components/button/SplitButton";
import MenuItem from "@mui/material/MenuItem";

const enum ProductField {
    NAME,
    DESCRIPTION,
    PRICE,
    COLOR,
    ATTRIBUTE,
    IMAGE,
}

const enum DialogType {
    DESCRIPTION,
    SIZE,
}

const initialProductProps = {
    name: '',
    price: 0,
    quantity: 0,
    size: [],
}

export interface ProductCreationProps {
    types: ProductTypeDto[];
    sizes: ProductSizeDto[];
    colors: ProductColorDto[];
}

export const ProductCreation: React.FC<ProductCreationProps> = ({types, sizes, colors}) => {
    const [products, setProducts] = useState<ProductDto[]>([]);
    const [openDescDialogs, setOpenDescDialogs] = React.useState<boolean[]>([]);
    const [openSizeDialogs, setOpenSizeDialogs] = React.useState<boolean[]>([]);

    const handleChange = (index: number, field: ProductField) => (event: { target: { value: any; }; }) => {
        const values: ProductDto[] = [...products];
        switch (field) {
            case ProductField.NAME:
                values[index].name = event.target.value;
                break;
            case ProductField.DESCRIPTION:
                if (event.target.value === '') {
                    values[index].description = undefined;
                } else {
                    values[index].description = event.target.value;
                }
                break;
            case ProductField.PRICE:
                values[index].price = event.target.value;
                break;
            case ProductField.COLOR:
                values[index].color = event.target.value;
                break;
            case ProductField.ATTRIBUTE:
                values[index].attribute = event.target.value;
                break;
            case ProductField.IMAGE:
                values[index].image = event.target.value;
                break;
        }
        setProducts(values);
    };

    const handleOpenDialog = (dialog: DialogType, index: number) => {
        if (dialog === DialogType.DESCRIPTION) {
            setOpenDescDialogs(prev => {
                const dialogs = [...prev];
                dialogs[index] = true;
                return dialogs;
            });
        } else if (dialog === DialogType.SIZE) {
            setOpenSizeDialogs(prev => {
                const dialogs = [...prev];
                dialogs[index] = true;
                return dialogs;
            });
        }
    };

    const handleCloseDialog = (dialog: DialogType, index: number, reason?: string) => {
        if (reason && reason === "backdropClick") return;
        if (dialog === DialogType.DESCRIPTION) {
            setOpenDescDialogs(prev => {
                const dialogs = [...prev];
                dialogs[index] = false;
                return dialogs;
            });
        } else if (dialog === DialogType.SIZE) {
            setOpenSizeDialogs(prev => {
                const dialogs = [...prev];
                dialogs[index] = false;
                return dialogs;
            });
        }
    };

    const VisuallyHiddenInput = styled('input')({
        clipPath: 'inset(50%)',
        height: 1,
        overflow: 'hidden',
        position: 'absolute',
        bottom: 0,
        left: 0,
        whiteSpace: 'nowrap',
        width: 1,
    });

    const addProductRow = (productType: string) => {
        const product: ProductDto = {
            ...initialProductProps,
            type: {name: productType} as ProductTypeDto,
            color: colors[0]
        };
        setProducts([...products, product]);
        console.log(products)
    };

    const handleDeleteProductRow = (id: number) => {
        let values: ProductDto[] = [...products];
        setProducts(values.filter((value, index) => index !== id));
    }

    return (
        <Paper elevation={3} className="p-20 mt-20">
            {products.map((product: ProductDto, index) => (
                <Box
                    key={product.type.name + `${index}`}
                    display="flex"
                    flexDirection="row"
                    alignItems="center"
                    justifyContent={"flex-start"}
                    mb={2}
                    gap={1}>
                    {/* TYPE */}
                    <TextField
                        label="Type"
                        variant="outlined"
                        defaultValue={product.type.name}
                        slotProps={{
                            input: {readOnly: true},
                        }}
                        sx={{maxWidth: 160}}
                    />

                    {/* NAME */}
                    <TextField
                        required
                        label="Name"
                        variant="outlined"
                        onChange={handleChange(index, ProductField.NAME)}
                        sx={{maxWidth: 170}}
                    />

                    {/* COLOR */}
                    <FormControl sx={{minWidth: 150}}>
                        <InputLabel>Color</InputLabel>
                        <Select
                            value={product.color ? product.color.name : ""}
                            label="Color"
                            onChange={(event) => {
                                const selectedColor = colors.find(color => color.name === event.target.value);
                                if (selectedColor) {
                                    handleChange(index, ProductField.COLOR)({target: {value: selectedColor}});
                                }
                            }}
                        >
                            {
                                colors.map((color) => (
                                    <MenuItem key={color.name} value={color.name}><Circle
                                        sx={{color: color.hex}}/> {color.name}</MenuItem>
                                ))
                            }
                        </Select>
                    </FormControl>

                    {/* PRICE */}
                    <TextField
                        required
                        label="Price"
                        variant="outlined"
                        type="number"
                        slotProps={{
                            input: {
                                endAdornment: <InputAdornment position="end">€</InputAdornment>,
                            },
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        sx={{maxWidth: 130}}
                        onChange={handleChange(index, ProductField.PRICE)}
                    />

                    {/* SIZES */}
                    <Button
                        variant="outlined"
                        onClick={() => handleOpenDialog(DialogType.SIZE, index)}
                        color={"primary"}
                    >
                        Add size
                    </Button>
                    <Dialog
                        disableEscapeKeyDown
                        open={openSizeDialogs[index] || false}
                        onClose={(event, reason) => handleCloseDialog(DialogType.SIZE, index, reason)}
                        maxWidth={"sm"}
                        fullWidth
                    >
                        <DialogTitle>Fill the form</DialogTitle>
                        <DialogContent>
                            {
                                product.size.map((size: ProductSizeDto, sizeIndex) => (
                                    <Box
                                        key={size.name + sizeIndex}
                                        display="flex"
                                        flexDirection="row"
                                        alignItems="conter"
                                        justifyContent="flex-start"
                                        my={2}
                                    >
                                        <TextField
                                            label="Size"
                                            variant="standard"
                                            value={products[index]?.size[sizeIndex]?.name || ""}
                                            slotProps={{
                                                input: {readOnly: true},
                                            }}
                                            sx={{maxWidth: 85}}
                                        />
                                        <TextField
                                            required
                                            label="Amount"
                                            variant="standard"
                                            type="number"
                                            placeholder="0"
                                            defaultValue={products[index]?.size[sizeIndex]?.amount}
                                            onChange={(event) => {
                                                const selectedSize = sizes.find(value => value.name === products[index]?.size[sizeIndex]?.name);
                                                if (selectedSize) {
                                                    const updatedProducts = [...products];
                                                    updatedProducts[index].size[sizeIndex].amount = Number(event.target.value)
                                                    setProducts(updatedProducts);
                                                }
                                            }}

                                        />

                                        {/* SIZE DELETE BUTTON */}
                                        <Button onClick={() => {
                                            let updatedProducts= [...products];
                                            updatedProducts[index].size = updatedProducts[index].size.filter(value => value.name !== products[index].size[sizeIndex]?.name)
                                            setProducts(updatedProducts);
                                        }}>
                                            <Delete color={"error"}/>
                                        </Button>
                                    </Box>
                                ))
                            }
                            <SplitButton
                                prefix={<AddCircle/>}
                                options={sizes.map(value => value.name)}
                                onClick={(value: string): void => {
                                    const sizeDto = {name: value, amount: 0} as ProductSizeDto;
                                    const newProducts = [...products];
                                    if (newProducts[index]?.size?.find(value => value.name === sizeDto.name)) return;
                                    newProducts[index]?.size?.push(sizeDto);
                                    setProducts(newProducts);
                                }}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleCloseDialog(DialogType.SIZE, index)}>Close</Button>
                        </DialogActions>
                    </Dialog>

                    {/* DESCRIPTION */}
                    <Button
                        variant="outlined"
                        onClick={() => handleOpenDialog(DialogType.DESCRIPTION, index)}
                        color={product.description === undefined ? "primary" : "secondary"}
                    >
                        {product.description === undefined ? "Add description" : "Edit description"}
                    </Button>
                    <Dialog
                        disableEscapeKeyDown
                        open={openDescDialogs[index] || false}
                        onClose={(event, reason) => handleCloseDialog(DialogType.DESCRIPTION, index, reason)}
                        maxWidth={"sm"}
                        fullWidth
                    >
                        <DialogTitle>Fill the form</DialogTitle>
                        <DialogContent>
                            <TextField
                                multiline
                                fullWidth
                                label="Description"
                                variant="outlined"
                                defaultValue={product.description}
                                onChange={handleChange(index, ProductField.DESCRIPTION)}
                                className="mt-3"
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => handleCloseDialog(DialogType.DESCRIPTION, index)}>Close</Button>
                        </DialogActions>
                    </Dialog>

                    {/* UPLOAD IMAGE BUTTON */}
                    <Button
                        component="label"
                        role={undefined}
                        variant="outlined"
                        tabIndex={-1}
                        startIcon={<CloudUpload/>}
                    >
                        Upload image
                        <VisuallyHiddenInput
                            type="file"
                            onChange={(event) => console.log(event.target.files)}
                            // multiple
                        />
                    </Button>

                    {/* DELETE BUTTON */}
                    <Button onClick={() => handleDeleteProductRow(index)}>
                        <Delete color={"error"}/>
                    </Button>
                </Box>
            ))}
            <Box display="flex" flexDirection="row" alignItems="flex-start" gap={2} mb={2}>
                <SplitButton prefix={<AddCircle/>} options={types.map(product => product.name)}
                             onClick={addProductRow}/>
                {products.length > 0 &&
                    <Button type="submit" variant="contained" color="success">
                        <Send/> Create
                    </Button>
                }
            </Box>
        </Paper>
    )
}