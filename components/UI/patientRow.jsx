// PatientRow.jsx

import React from "react";
import style from "../../styles/patientRowCss.module.css";
import { Typography, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

export default function PatientRow({
  pictureName,
  picturePath,
  date,
  time,
  name,
  lesson,
  isCenter = false,
  hasBottomBorder = false,
  maxTextLengthName,
  maxTextLengthLesson,
  nameWidth,
  lessonWidth,
  canEdit,
}) {
  let needTooltipName = false;
  let needTooltipLesson = false;

  const getFormattedName = (text) => {
    if (text && text.length > maxTextLengthName) {
      needTooltipName = true;
      return `${text.substring(0, maxTextLengthName)}...`;
    }
    return text;
  };

  const getFormattedLesson = (text) => {
    if (text && text.length > maxTextLengthLesson) {
      needTooltipLesson = true;
      return `${text.substring(0, maxTextLengthLesson)}...`;
    }
    return text;
  };

  const renderTooltip = (text, variableName, width) => {
    if (!text) {
      return null; 
    }

    let formattedText = "";

    if (variableName === "name") {
      formattedText = getFormattedName(text);
    } else {
      formattedText = getFormattedLesson(text);
    }

    return (
      <Tooltip
        title={
          (variableName === "name" && needTooltipName) ||
          (variableName === "lesson" && needTooltipLesson)
            ? text
            : ""
        }
        key={variableName}
      >
        <div
          style={{
            width: `${width}px`,
            display: "inline-block",
            textAlign: "right",
          }}
        >
          {formattedText}
        </div>
      </Tooltip>
    );
  };

  return (
    <div
      className={`${isCenter ? style.containerCenter : style.container} ${
        hasBottomBorder ? style.bottomBorder : ""
      }`}
    >
      {picturePath && (
        <img src={picturePath} alt={pictureName} className={style.pic} />
      )}
      <div className={style.textContainer}>
        <Typography className={style.txt}>
          {date}
          {date && <> &nbsp;</>}
          {time}
          {time && <> &nbsp;</>}
          {renderTooltip(name, "name", nameWidth)}
          {name && <>&nbsp;</>}
          {renderTooltip(lesson, "lesson", lessonWidth)}
        </Typography>
        {canEdit && (
          <IconButton style={{ fontSize: "12px", padding: "2px" }}>
            <EditIcon style={{ fontSize: "12px" }} />
          </IconButton>
        )}
      </div>
    </div>
  );
}
