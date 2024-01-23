import React from 'react';
import style from "../../styles/picAndHeadlinesStyle.module.css";
import { Typography } from '@mui/material';

export default function PicAndHeadlines({ pictureName, picturePath, isMain = false, primaryHeadline, secondaryHeadline }) {
  return (
    <div>
      {picturePath && (
        <img
          src={picturePath}
          alt={pictureName}
          className={isMain ? style.main_pic : style.pic}
        />
      )}
      <div className={style.space}>
        <Typography variant='h4' className={style.bold}>
          {primaryHeadline}
        </Typography>
        <Typography>
          {secondaryHeadline}
        </Typography>
      </div>
    </div>
  );
}