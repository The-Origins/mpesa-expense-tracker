import React from "react";
import ConfirmationModal from "../modals/confirm";
import { Box, Typography } from "@mui/material";

const DeleteModal = ({
  open,
  message = "Are you sure you want to delete this item?",
  handleClose,
  onCancel = () => {},
  onConfirm = () => {},
}) => {
  return (
    <ConfirmationModal
      title={"Delete"}
      color="error"
      width={"400px"}
      {...{ open, handleClose, onCancel, onConfirm }}
    >
      <Box display={"flex"} padding={"20px"}>
        <Typography textAlign={"center"}>{message}</Typography>
      </Box>
    </ConfirmationModal>
  );
};

export default DeleteModal;
