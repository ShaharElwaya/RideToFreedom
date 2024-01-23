import React from 'react';
import axios from 'axios';
import { Typography, TextField, Button } from '@mui/material';
import style from "../styles/loginRegisterPage.module.css";
import TextFieldComponent from '@/components/UI/TextFiled';
import PicAndHeadlines from '@/components/UI/picAndheadline';

export default function login() {
  const handleClickLogin = async (e) => {
    e.preventDefault()
    try {
      const email = e.target[0].value
      const password = e.target[2].value
      const res = await axios.post("api/login", { email, password });
      alert('Login successful!')
    } catch (err) {
      alert('Incorrect credenetials!')
    }
  };

  return (
    <>
      <PicAndHeadlines
        pictureName="logo"
        picturePath="../logo.jpeg"
        isMain
        primaryHeadline="לרכב אל החופש"
        secondaryHeadline="אימון והדרכת משפחות בשילוב סוסים"
      />
      <form onSubmit={handleClickLogin}>
        <div className={style.space}>
          <div>
            <TextFieldComponent type="email" outlinedText="שם משתמש" required />
          </div>
          <div>
            <TextFieldComponent type="password" outlinedText="סיסמה" required />
          </div>
        </div>
        <Button type="submit" variant="contained">התחבר</Button>
      </form>
    </>
  );
}
