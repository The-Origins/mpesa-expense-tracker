import {
  Autocomplete,
  ClickAwayListener,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";

const Cell = ({
  index,
  onClick = () => {},
  name = "",
  value = "",
  input,
  handleChange,
  handleSave,
  suggestions,
  format = (value) => value,
  isGrey = false,
  isBold = false,
  enableEdit = false,
}) => {
  const theme = useTheme();
  const [isEdit, setIsEdit] = useState(false);
  const [open, setOpen] = useState(false);

  const onChange = ({ target }) => {
    setOpen(true);
    handleChange({ target });
  };

  const onSave = () => {
    handleSave(name);
    setIsEdit(false);
    setOpen(false);
  };

  const handleClick = () => {
    if (enableEdit) {
      setIsEdit(true);
    }
    onClick();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSave();
  };

  const handleClickAway = () => {
    if (isEdit) {
      onSave();
    }
  };

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <button
        key={index}
        onClick={handleClick}
        style={{
          backgroundColor: "transparent",
          textTransform: "none",
          width: "100%",
          textDecoration: "none",
          fontSize: "initial",
          margin: "none",
          textAlign: "left",
          border: "none",
          cursor: "pointer",
          padding: "0px",
        }}
      >
        {isEdit ? (
          <form
            onSubmit={handleSubmit}
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            {suggestions ? (
              <Autocomplete
                fullWidth
                freeSolo
                disableClearable
                getOptionLabel={(option) => String(option)}
                options={suggestions}
                open={open}
                onOpen={() => setOpen(true)}
                onClose={() => setOpen(false)}
                value={value}
                onChange={(_, value) => onChange({ target: { name, value } })}
                renderInput={(params) =>
                  input ? (
                    input(params, true)
                  ) : (
                    <TextField
                      {...params}
                      autoFocus
                      sx={{ width: "100%", height: "100%" }}
                      name={name}
                      value={value}
                      onChange={onChange}
                      fullWidth
                    />
                  )
                }
              />
            ) : input ? (
              input()
            ) : (
              <TextField
                autoFocus
                sx={{ width: "100%", height: "100%" }}
                name={name}
                value={value}
                onChange={onChange}
                fullWidth
              />
            )}
          </form>
        ) : (
          <Typography
            height={"100%"}
            textAlign={"center"}
            fontWeight={isBold ? "bold" : "regular"}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `0.5px solid ${theme.palette.grey[400]}`,
              minHeight: "40px",
              bgcolor: isGrey ? theme.palette.grey[300] : "white",
              ":hover": {
                bgcolor: theme.palette.grey[200],
              },
            }}
          >
            {format(value)}
          </Typography>
        )}
      </button>
    </ClickAwayListener>
  );
};

export default Cell;
