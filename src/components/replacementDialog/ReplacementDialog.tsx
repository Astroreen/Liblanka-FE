import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface ReplacementDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (replacementId: number) => void;
  items: Array<{ id?: number; name: string; hex?: string }>;
  itemToDelete: { id?: number; name: string; hex?: string };
  type: "type" | "size" | "color";
}

const ReplacementDialog: React.FC<ReplacementDialogProps> = ({
  open,
  onClose,
  onConfirm,
  items,
  itemToDelete,
  type,
}) => {
  const { t } = useTranslation();
  const [selectedReplacement, setSelectedReplacement] = useState<number | "">("");

  const handleConfirm = () => {
    if (selectedReplacement !== "") {
      onConfirm(selectedReplacement as number);
      setSelectedReplacement("");
    }
  };

  const handleClose = () => {
    setSelectedReplacement("");
    onClose();
  };

  const filteredItems = items.filter((item) => item !== undefined && item?.id !== itemToDelete?.id);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t("page.products.information.replacement.title")}</DialogTitle>
      <DialogContent>
        <Typography variant="body2" className="mb-4">
          {t("page.products.information.replacement.description")}
        </Typography>
        
        <Box className="mb-4">
          <Typography variant="subtitle2" className="mb-2">
            Item to delete: <strong>{itemToDelete?.name}</strong>
            {itemToDelete?.hex && (
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: itemToDelete?.hex,
                  border: "1px solid #ddd",
                  ml: 1,
                  verticalAlign: "middle",
                }}
              />
            )}
          </Typography>
        </Box>

        <FormControl fullWidth>
          <InputLabel>{t("page.products.information.replacement.selectReplacement")}</InputLabel>
          <Select
            value={selectedReplacement}
            onChange={(e) => {
              const value = e.target.value;
              setSelectedReplacement(value === "" ? "" : Number(value));
            }}
            label={t("page.products.information.replacement.selectReplacement")}
          >
            {filteredItems.map((item) => item !== undefined && (
              <MenuItem key={item?.id} value={item?.id}>
                <Box className="flex items-center">
                  <span>{item?.name}</span>
                  {item?.hex && (
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: "50%",
                        bgcolor: item?.hex,
                        border: "1px solid #ddd",
                        ml: 1,
                      }}
                    />
                  )}
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          {t("page.products.information.replacement.cancel")}
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          color="error"
          disabled={selectedReplacement === ""}
        >
          {t("page.products.information.replacement.confirm")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReplacementDialog; 