// textAreaComponent.jsx

import React from "react";
import { TextareaAutosize } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function TextAreaComponent({
  placeholderText,
  value,
  onChange,
  required,
  disabled,
  readOnly = false,
}) {
  const isLargeScreen = useMediaQuery("(min-width: 601px)");

  const textStyle = {
    height: "200px",
    resize: "none",
    fontFamily: "Heebo, sans-serif",
    margin: 0,
    width: isLargeScreen ? "500px" : "100%", 
    backgroundColor: "white",
    // ...(readOnly && {
    //   pointerEvents: "none",
    //   backgroundColor: "white",
    //   border: "1px solid #00000061",
    //   //color: isLargeScreen ? "gray" : "black",
    //   color: "red",
    // }),
  };

  return (
    <div>
      <TextareaAutosize
        style={{ ...textStyle }}
        placeholder={placeholderText}
        value={value}
        onChange={onChange}
        required={required}
        disabled = {disabled}
      />
    </div>
  );
}
