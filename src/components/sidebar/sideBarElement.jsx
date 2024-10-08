import { Typography } from "@mui/material";
import React from "react";

const SideBarElement = ({
  flexDirection = "row",
  justifyContent = "center",
  open,
  icon,
  title,
}) => {
  return (
    <Typography
      display={"flex"}
      gap={"10px"}
      alignItems={"center"}
      {...{ flexDirection, justifyContent }}
    >
      {icon}
      {open && <Typography>{title}</Typography>}
    </Typography>
  );
};

export default SideBarElement;
