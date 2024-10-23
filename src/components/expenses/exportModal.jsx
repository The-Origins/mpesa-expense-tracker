import React, { useState } from "react";
import ConfirmationModal from "../modals/confirm";
import { Box, ListItemIcon, MenuItem, Radio, Typography } from "@mui/material";

const ExportModal = ({
  open,
  handleClose,
  results,
  expenses,
  onCancel = () => {},
  onConfirm = () => {},
}) => {
  const [value, setValue] = useState("all");

  const handleConfirm = () => {
    onConfirm(value);
  };
  return (
    <ConfirmationModal
      title="Select what to export"
      width={"400px"}
      onConfirm={handleConfirm}
      {...{ open, handleClose, onCancel }}
    >
      <Box
        padding={"20px"}
        display={"flex"}
        flexDirection={"column"}
        gap={"20px"}
      >
        {Boolean(results.length) && (
          <MenuItem
            selected={value === "current"}
            onClick={() => setValue("current")}
          >
            <ListItemIcon>
              <Radio checked={value === "current"} />
            </ListItemIcon>
            <Box display={"flex"} alignItems={"center"} gap={"5px"}>
              <Typography>Current page</Typography>
              <Typography>
                ({Number(results.length).toLocaleString()}
                {" Item"}
                {results.length === 1 ? "" : "s"})
              </Typography>
            </Box>
          </MenuItem>
        )}
        <MenuItem selected={value === "all"} onClick={() => setValue("all")}>
          <ListItemIcon>
            <Radio checked={value === "all"} />
          </ListItemIcon>
          <Box display={"flex"} gap={"5px"}>
            <Typography>All pages</Typography>
            <Typography>
              ({Number(expenses.length).toLocaleString()}
              {" Item"}
              {expenses.length === 1 ? "" : "s"})
            </Typography>
          </Box>
        </MenuItem>
      </Box>
    </ConfirmationModal>
  );
};

export default ExportModal;
