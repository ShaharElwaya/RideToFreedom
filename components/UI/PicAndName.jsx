import React, { useRef, useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";

export const PicAndText = ({ pictureName, name, containerWidth }) => {
  const [displayText, setDisplayText] = useState(name);
  const [nameLength, setNameLength] = useState(name.length);
  const textRef = useRef(null);

  useEffect(() => {
    const maxChars = Math.floor(containerWidth / 8); // Assuming an average character width of 8px
    if (displayText.length > maxChars) {
      setDisplayText(displayText.substring(0, maxChars) + "...");
      setNameLength(maxChars);
    }
  }, [containerWidth, displayText]);

  return (
    <Tooltip
      title={nameLength < name.length ? name : ""}
      arrow
      placement="bottom"
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          margin: "0px",
          padding: "0px",
          width: "100%", // Adjusted width to 100%
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        <img
          src={`../${pictureName}.png`}
          alt={pictureName}
          style={{ width: "80px", height: "80px" }}
        />
        <Typography ref={textRef}>{displayText}</Typography>
      </div>
    </Tooltip>
  );
};
