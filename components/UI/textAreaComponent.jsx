// textAreaComponent.jsx

import React from "react";
import { TextareaAutosize } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function TextAreaComponent({
  placeholderText,
  value,
  onChange,
  required,
  readOnly = false,
}) {
  const isLargeScreen = useMediaQuery("(min-width: 601px)");

  const textStyle = {
    height: "200px",
    resize: "none",
    fontFamily: "Heebo, sans-serif",
    margin: 0,
    width: isLargeScreen ? "500px" : "100%", 
    ...(readOnly && {
      pointerEvents: "none",
      backgroundColor: "white",
      border: "1px solid #00000061",
      color: "#00000061",
    }),
  };

  return (
    <div>
      <TextareaAutosize
        style={{ ...textStyle }}
        placeholder={placeholderText}
        value={value}
        onChange={onChange}
        required={required}
        disabled={readOnly}
      />
    </div>
  );
}
