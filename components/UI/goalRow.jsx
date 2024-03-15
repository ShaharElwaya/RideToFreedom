// GoalRow.jsx

import React from "react";
import style from "../../styles/goalRowCss.module.css";
import { Typography } from "@mui/material";

export default function GoalRow({ goal, isCenter = true }) {
  return (
    <div className={isCenter ? style.containerCenter : style.container}>
      <Typography className={style.txt}>{goal}</Typography>
    </div>
  );
}
