import React from 'react';
import { Typography, TextField, Button } from '@mui/material';
import style from "../styles/loginPage.module.css";
import TextFieldComponent from '@/components/UI/TextFiled';

export default function login() {
  const handleClickLogin = async (e) => {
    e.preventDefault()
    try {
      const email = e.target[0].value
      const password = e.target[1].value
      const res = await axios.post("api/login", {email, password});
      alert('Login successful!')
    }catch(err) {
      alert('Incorrect credenetials!')
    }
  };

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
        <form onSubmit={handleClickLogin}>
          <div className={style.space}>
            <div>
              <TextFieldComponent type="email" outlinedText="שם משתמש"/>
            </div>
            <div>
              <TextFieldComponent type="password" outlinedText="סיסמה"/>
            </div>
          </div>
          <Button type="submit" variant="contained">התחבר</Button>
        </form>
      </div>
    </>
  );
}
