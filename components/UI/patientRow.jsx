// PatientRow.jsx

import React from 'react';
import style from "../../styles/patientRowCss.module.css";
import { Typography } from '@mui/material';

export default function PatientRow({ pictureName, picturePath, date, time, name, isCenter = false}) {
  return (
    <div className={isCenter ? style.containerCenter : style.container} >
      <img src={picturePath} alt={pictureName} className={style.pic} />
      <Typography className={style.txt}>
        {date} &nbsp; {time} &nbsp; {name}
      </Typography>
    </div>
  );
}
