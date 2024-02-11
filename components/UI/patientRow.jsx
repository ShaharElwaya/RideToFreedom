// PatientRow.jsx

import React from 'react';
import style from "../../styles/patientRowCss.module.css";
import { Typography, Tooltip } from '@mui/material';

export default function PatientRow({ pictureName, picturePath, date, time, name, lesson, isCenter = false, hasBottomBorder = false, maxLessonTextLength }) {
  const getFormattedLessonText = () => {
    if (lesson && lesson.length > maxLessonTextLength) {
      return `${lesson.substring(0, maxLessonTextLength)}...`;
    }
    return lesson;
  };

  const renderLessonText = () => {
    const formattedText = getFormattedLessonText();

    if (formattedText && formattedText.length < (lesson ? lesson.length : 0)) {
      return (
        <Tooltip title={lesson}>
          <span>{formattedText}</span>
        </Tooltip>
      );
    }

    return <span>{formattedText}</span>;
  };

  return (
    <div className={`${isCenter ? style.containerCenter : style.container} ${hasBottomBorder ? style.bottomBorder : ''}`}>
      <img src={picturePath} alt={pictureName} className={style.pic} />
      <div className={style.textContainer}>
        <Typography className={style.txt}>
          {date} &nbsp; {time} &nbsp; {name} &nbsp; {renderLessonText()}
        </Typography>
      </div>
    </div>
  );
}
