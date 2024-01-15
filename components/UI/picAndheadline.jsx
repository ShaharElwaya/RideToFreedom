import React, { useState } from 'react'
import style from "../../styles/loginPage.module.css"
import { Typography } from '@mui/material';

export default function PicAndHeadlines({ pictureName, picturePath, primaryHeadline, secondaryHeadline }) {

    return (
        <div>
            <img src={picturePath} alt={pictureName} className={style.logo_pic} />
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
