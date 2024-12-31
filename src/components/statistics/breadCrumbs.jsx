import { Home, KeyboardArrowRight } from "@mui/icons-material";
import { Box, Chip, IconButton, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const BreadCrumbs = () => {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const scrollRef = useRef();
  const [crumbs, setCrumbs] = useState([]);

  useEffect(() => {
    setCrumbs(location.pathname.split("/").slice(2));
  }, [location.pathname]);

  useEffect(() => {
    scrollToEnd();
  }, [crumbs]);

  const scrollToEnd = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
    }
  };

  const handleClick = (index) => {
    navigate(`/statistics/${crumbs.slice(0, index + 1).join("/")}`);
  };

  return (
    <Box width={"100%"} display={"flex"} alignItems={"center"}>
      <IconButton
        color={location.pathname === "/statistics" ? "primary" : "default"}
        sx={{ mb: "2px" }}
        onClick={() => navigate("/statistics")}
      >
        <Home />
      </IconButton>
      <Box
        ref={scrollRef}
        width={"100%"}
        sx={{
          overflowX: "scroll",
          "&::-webkit-scrollbar": {
            bgcolor: "transparent",
            height: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "10px",
            bgcolor: "white",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            cursor: "pointer",
            bgcolor: theme.palette.grey[400],
          },
          ":hover": {
            "&::-webkit-scrollbar-thumb": {
              bgcolor: theme.palette.grey[300],
            },
          },
        }}
      >
        <Box display={"flex"} gap={"10px"} padding={"10px"}>
          {crumbs.map((crumb, index) => (
            <Box display={"flex"} alignItems={"center"} gap={"5px"} key={index}>
              <KeyboardArrowRight />
              <Chip
                key={index}
                label={crumb}
                color={crumbs.length - 1 === index ? "primary" : "default"}
                onClick={() => handleClick(index)}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default BreadCrumbs;
