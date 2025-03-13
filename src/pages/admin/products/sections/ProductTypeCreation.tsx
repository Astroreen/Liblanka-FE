import React from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import {ProductTypeDto} from "../../../../dto/ProductTypeDto";
import {AddCircle, Delete, Send} from "@mui/icons-material";
import {BASE_URL, ENDPOINTS} from "../../../../api/apiConfig";
import {useProtectedAxios} from "../../../../hooks/useProtectedAxios";

export interface ProductTypeCreationProps {
    header: string;
    types: ProductTypeDto[];
}

export const ProductTypeCreation: React.FC<ProductTypeCreationProps> = ({header, types}) => {
    const protectedAxios = useProtectedAxios();
    const [productTypes, setProductTypes] = React.useState<ProductTypeDto[]>(types);
    const [submitTypes, setSubmitTypes] = React.useState<string[]>([]);
    const [dialog, setDialog] = React.useState(false);
    const [possibleName, setPossibleName] = React.useState("");

    function handleOpenDialog() {
        setDialog(true);
    }

    function handleCloseDialog(reason: "backdropClick" | "escapeKeyDown" | undefined) {
        if(reason && reason === "backdropClick") return;
        setDialog(false);
    }

    function handleDeleteProductType(type: ProductTypeDto) {

        //post to server to delete type
        //if all successful:
        setProductTypes([...productTypes].filter((el) => el !== type));
        setSubmitTypes([...submitTypes].filter((el) => el !== type.name));
    }

    function handleAddNewProductType() {
        //not empty strings
        if(possibleName === "") return;
        //do not allow duplicates
        if(productTypes.some(type => type.name === possibleName)) return;
        if(submitTypes.some(name => name === possibleName)) return;

        const type = {id: undefined, name: possibleName} as ProductTypeDto;

        setProductTypes([...productTypes, type]);
        setSubmitTypes([...submitTypes, type.name]);
        setPossibleName("");

        handleCloseDialog(undefined);
    }

    function handleProductTypeNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPossibleName(event.target.value);
    }

    async function onSubmitProductTypes() {
        //send data to server
        try {
            await protectedAxios.post(BASE_URL + ENDPOINTS.product_types, submitTypes);
        } catch (err) {
            console.error("Error posting product types", err);
        }

        //clear array
        setSubmitTypes([]);

        //reload page?
    }

    return (
        <Paper elevation={3} className="px-14 pb-14 pt-5 mx-10 my-20">
            <Typography variant="h4" className="mb-10">
                {header}
            </Typography>

            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                    gap: 2
                }}>
                {productTypes.map((type, index) => (
                    <Box
                        key={`${type.name}` + index}
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            mb: 2,
                            gap: 1
                        }}
                    >
                        <TextField
                            variant="standard"
                            defaultValue={type.name}
                            slotProps={{
                                input: {
                                    readOnly: true,
                                },
                            }}
                        />

                        {/* DELETE BUTTON */}
                        <Button onClick={() => handleDeleteProductType(type)}>
                            <Delete color={"error"}/>
                        </Button>
                    </Box>
                ))}

                <Dialog
                    disableEscapeKeyDown
                    open={dialog || false}
                    onClose={(event, reason) => handleCloseDialog(reason)}
                    maxWidth={"sm"}
                    fullWidth
                >
                    <DialogTitle>Product Name</DialogTitle>
                    <DialogContent>
                        <TextField
                            fullWidth
                            placeholder="Product Name"
                            onChange={handleProductTypeNameChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => handleAddNewProductType()}>Add</Button>
                        <Button onClick={() => handleCloseDialog(undefined)}>Close</Button>
                    </DialogActions>
                </Dialog>

                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: 2
                    }}
                >
                    {/* CREATE BUTTON */}
                    <Button  variant="contained" color="primary" onClick={handleOpenDialog}>
                        <AddCircle/> Add New Type
                    </Button>

                    {/* SUBMIT BUTTON */}
                    {submitTypes.length > 0 &&
                        <Button type="submit" variant="contained" color="success" onClick={onSubmitProductTypes}>
                            <Send/> Create
                        </Button>
                    }
                </Box>

            </Box>

        </Paper>
    )
}