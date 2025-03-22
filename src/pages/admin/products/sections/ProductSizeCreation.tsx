import React from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Select,
    SelectChangeEvent,
    TextField,
    Typography
} from "@mui/material";
import {AddCircle, Delete, Send} from "@mui/icons-material";
import {BASE_URL, ENDPOINTS} from "../../../../api/apiConfig";
import {useProtectedAxios} from "../../../../hooks/useProtectedAxios";
import MenuItem from "@mui/material/MenuItem";
import {ProductSizeDto} from "../../../../dto/ProductSizeDto";

export interface ProductSizeCreationProps {
    header: string;
    sizes: ProductSizeDto[];
}

export const ProductSizeCreation: React.FC<ProductSizeCreationProps> = ({header, sizes}) => {
    const protectedAxios = useProtectedAxios();
    const [productSizes, setProductSizes] = React.useState<ProductSizeDto[]>(sizes);
    const [submitSizes, setSubmitSizes] = React.useState<string[]>([]);
    const [dialog, setDialog] = React.useState(false);
    const [removeDialog, setRemoveDialog] = React.useState(false);
    const [removeSize, setRemoveSize] = React.useState<ProductSizeDto>(sizes[0]);
    const [possibleName, setPossibleName] = React.useState("");

    function handleOpenDialog() {
        setDialog(true);
    }

    function handleCloseDialog(reason: "backdropClick" | "escapeKeyDown" | undefined) {
        if (reason && reason === "backdropClick") return;
        setDialog(false);
        setRemoveDialog(false);
        setPossibleName("");
    }

    async function handleDeleteProductType(type: ProductSizeDto, change: string) {
        handleCloseDialog(undefined);
        setPossibleName("");

        //post to server to delete type and change to another
        try {
            await protectedAxios.delete(BASE_URL + ENDPOINTS.product_sizes + `?delete=${type?.name}&replace=${change}`);
        } catch (err) {
            console.error("Could not delete product size:", err);
            return;
        }

        //if all successful:
        setProductSizes([...productSizes].filter((el) => el !== type));
        setSubmitSizes([...submitSizes].filter((el) => el !== type.name));
    }

    function handleAddNewProductType() {
        //not empty strings
        if (possibleName === "") return;
        //do not allow duplicates
        if (productSizes.some(type => type.name === possibleName)) return;
        if (submitSizes.some(name => name === possibleName)) return;

        const type = {id: undefined, name: possibleName, amount: 0} as ProductSizeDto;

        setProductSizes([...productSizes, type]);
        setSubmitSizes([...submitSizes, type.name]);
        setPossibleName("");

        handleCloseDialog(undefined);
    }

    function handleProductSizeNameSelect(event: SelectChangeEvent){
        setPossibleName(event.target.value);
    }

    function handleProductSizeNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPossibleName(event.target.value);
    }

    async function onSubmitProductSizes() {
        //send data to server
        try {
            await protectedAxios.post(BASE_URL + ENDPOINTS.product_sizes, submitSizes);
        } catch (err) {
            console.error("Error posting product types", err);
        }

        //clear array
        setSubmitSizes([]);

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
                {productSizes.map((type) => (
                    <Box key={`${type.name}`}>
                        <Box
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
                            <Button onClick={() =>
                            {
                                setRemoveDialog(true);
                                setRemoveSize(type);
                            }}>
                                <Delete color={"error"}/>
                            </Button>
                        </Box>

                        <Dialog
                            disableEscapeKeyDown
                            open={removeDialog || false}
                            onClose={(event, reason) => handleCloseDialog(reason)}
                            maxWidth={"sm"}
                            fullWidth
                        >
                            <DialogTitle>Change Product Type</DialogTitle>
                            <DialogContent>
                                    <Select
                                        label="Change this type to"
                                        value={possibleName}
                                        onChange={handleProductSizeNameSelect}
                                    >
                                        {
                                            productSizes
                                                .filter((el) => el !== removeSize)
                                                .map((sel) => (
                                                    <MenuItem value={sel.name} key={`${sel.name}`}>{sel.name}</MenuItem>
                                                ))
                                        }
                                    </Select>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => handleDeleteProductType(removeSize, possibleName)}>Remove</Button>
                                <Button onClick={() => handleCloseDialog(undefined)}>Close</Button>
                            </DialogActions>
                        </Dialog>
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
                            onChange={handleProductSizeNameChange}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleAddNewProductType}>Add</Button>
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
                    <Button variant="contained" color="primary" onClick={() => {
                        setRemoveDialog(false);
                        handleOpenDialog();
                    }}>
                        <AddCircle/> Add New Type
                    </Button>

                    {/* SUBMIT BUTTON */}
                    {submitSizes.length > 0 &&
                        <Button type="submit" variant="contained" color="success" onClick={onSubmitProductSizes}>
                            <Send/> Create
                        </Button>
                    }
                </Box>

            </Box>

        </Paper>
    )
}