import { Close } from "@mui/icons-material";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import React from "react";

const ConfirmationModal = ({
  onCancel = () => {},
  onConfirm = () => {},
  open,
  width,
  title = "Confirm",
  color = "primary",
  handleClose,
  children,
}) => {
  const handleCancel = () => {
    onCancel();
    handleClose();
  };

  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        width={width || "min(600px, 90%)"}
        borderRadius={"10px"}
        bgcolor={"white"}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box
          width={"100%"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          padding={"20px"}
        >
          <Typography fontWeight={"bold"} fontSize={"1.2rem"}>
            {title}
          </Typography>
          <IconButton onClick={handleClose}>
            <Close />
          </IconButton>
        </Box>
        {children}
        <Box
          width={"100%"}
          display={"flex"}
          justifyContent={"space-between"}
          padding={"20px"}
        >
          <Button onClick={handleCancel} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color={color}
            variant="contained"
            disableElevation
          >
            Confirm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;
