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
import {AddCircle, Delete} from "@mui/icons-material";

export interface ProductTypeCreationProps {
    header: string;
    types: ProductTypeDto[];
}

export const ProductTypeCreation: React.FC<ProductTypeCreationProps> = ({header, types}) => {

    const [productTypes, setProductTypes] = React.useState<ProductTypeDto[]>(types);
    const [dialog, setDialog] = React.useState(false);
    const [possibleName, setPossibleName] = React.useState("");

    function handleOpenDialog() {
        setDialog(true);
    }

    function handleCloseDialog(reason: "backdropClick" | "escapeKeyDown" | undefined) {
        if(reason && reason === "backdropClick") return;
        setDialog(false);
    }

    function handleDeleteProductType(index: number) {
        const editedTypes = [...productTypes];
        //remember type to then delete in db using const typeToDelete = editedTypes[index];

        setProductTypes(editedTypes.filter((_el, elIndex) => elIndex !== index));

        //post to server to delete type
    }

    function handleAddNewProductType() {
        const editedTypes = [...productTypes, {id: undefined, name: possibleName} as ProductTypeDto];
        setProductTypes(editedTypes);
        handleCloseDialog(undefined);

        //post method to server to create new type
    }

    function handleProductTypeNameChange(event: React.ChangeEvent<HTMLInputElement>) {
        setPossibleName(event.target.value);
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
                        <Button onClick={() => handleDeleteProductType(index)}>
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

                <Button  variant="contained" color="success" onClick={handleOpenDialog}>
                    <AddCircle/> Create
                </Button>
            </Box>

        </Paper>
    )
}