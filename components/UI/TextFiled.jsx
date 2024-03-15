// TextField.jsx

import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function TextFieldComponent({
  outlinedText,
  type,
  value,
  onChange,
  required,
}) {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const textFieldStyle = {
    width: "265px",
  };

  const iconStyle = {
    fontSize: "20px",
    marginLeft: "7px",
  };

  return (
    <TextField
      label={outlinedText}
      variant="outlined"
      type={type === "password" && showPassword ? "text" : type}
      value={value}
      onChange={onChange}
      required={required}
      style={textFieldStyle}
      InputProps={{
        endAdornment:
          type === "password" ? (
            <InputAdornment position="end" style={{ marginLeft: "-20px" }}>
              <IconButton
                onClick={handleTogglePassword}
                edge="end"
                style={iconStyle}
              >
                {showPassword ? (
                  <VisibilityOff style={iconStyle} />
                ) : (
                  <Visibility style={iconStyle} />
                )}
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
    />
  );
}
