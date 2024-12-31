import { Box, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import { generatePalette } from "../../theme";
import { PieChart } from "@mui/x-charts";

const CustomPieChart = ({
  height = 400,
  width = 400,
  legend = { position: "bottom", height: undefined },
  data,
  style = { paddingAngle: 0.5, cornerRadius: 10, innerRadius: 10 },
  margin = { top: 0, right: 0, bottom: 10, left: 0 },
}) => {
  const theme = useTheme();
  const [pallette, setPalette] = useState([]);

  useEffect(() => {
    setPalette(generatePalette(data.length));
  }, [data]);

  return (
    <Box
      display={"flex"}
      flexDirection={legend.position === "bottom" ? "column" : legend.position === "top" ? "column-reverse" : legend.position === "right" ? "row" : "row-reverse"}
      height={`${height}px`}
      width={`${width}px`}
    >
      <PieChart
        colors={pallette}
        series={[
          {
            data: data,
            ...style,
          },
        ]}
        slotProps={{
          legend: {
            hidden: true,
          },
        }}
        margin={margin}
        width={height}
        height={width}
      />
      <Box
        height={legend.height}
        sx={{
          overflowY: legend.height ? "scroll" : undefined,
          "&::-webkit-scrollbar": {
            bgcolor: "transparent",
            width: "5px",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "10px",
            bgcolor: theme.palette.grey[300],
          },
          "&::-webkit-scrollbar-thumb:hover": {
            cursor: "pointer",
            bgcolor: theme.palette.grey[400],
          },
        }}
      >
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          gap={"10px"}
          padding={"0px 10px"}
        >
          {data.map((item, index) => (
            <Box display={"flex"} alignItems={"center"} gap={"5px"}>
              <Box
                width={"10px"}
                height={"10px"}
                bgcolor={pallette[index]}
                borderRadius={"50%"}
              />
              <Typography fontSize={"0.8rem"}>{item.label}</Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default CustomPieChart;
