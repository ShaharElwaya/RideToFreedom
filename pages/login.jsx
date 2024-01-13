import React from 'react';
import { Typography, TextField, Button } from '@mui/material';
import style from "../styles/loginPage.module.css";
import TextFieldComponent from '@/components/UI/TextFiled';

export default function login() {
  return (
    <>
      <div className={style.login_general}>
        <img src="/logo.jpeg" alt="logo" className={style.logo_pic}/>
        <div className={style.space}>
          <Typography variant='h4' className={style.bold}>
            לרכב אל החופש
          </Typography>
          <Typography>
            אימון והדרכת משפחות בשילוב סוסים
          </Typography>
        </div>
        <div className={style.space}>
          <div>
            <TextFieldComponent id="outlined-basic" outlinedText="שם משתמש"/>
          </div>
          <div>
            <TextFieldComponent id="outlined-basic" outlinedText="סיסמה"/>
          </div>
        </div>
        <Button variant="contained">התחבר</Button>
      </div>
    </>
  );
}
