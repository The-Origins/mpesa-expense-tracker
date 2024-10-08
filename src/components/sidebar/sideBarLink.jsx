import { MenuItem, Typography, useTheme } from "@mui/material";
import React from "react";
import SideBarElement from "./sideBarElement";
import { useLocation, useNavigate } from "react-router-dom";

const SideBarLink = ({ path, icon, open }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentPath] = location.pathname.split("/").slice(1);

  const handleClick = () => {
    navigate(`/${path}`, { replace: true });
  };

  return (
    <MenuItem
      onClick={handleClick}
      sx={{
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: currentPath === path ? theme.palette.grey[300] : "transparent",
        ":hover": {
          color: "primary.main",
        },
      }}
    >
      <SideBarElement
        open={open}
        icon={icon}
        title={
          <Typography width={"100px"}>
            {path.charAt(0).toUpperCase() + path.substring(1)}
          </Typography>
        }
      />
    </MenuItem>
  );
};

export default SideBarLink;
