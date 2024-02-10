import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Typography, TextField, Button } from '@mui/material';
import style from "../styles/loginRegisterPage.module.css";
import TextFieldComponent from '@/components/UI/TextFiled';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import { setUserData, userStore } from '../stores/userStore';

export default function login() {
  const router = useRouter(); 
  const [isSaving, setIsSaving] = useState(false);

  const handleClickLogin = async (e) => {
    e.preventDefault()
    try {
      const email = e.target[0].value
      const password = e.target[2].value
      const res = await axios.post("api/login", { email, password });
      
      setIsSaving(true); 

      await setUserData({
        type: res.data.type,
        email: res.data.email,
        id: res.data.id,
        is_logged_in: true
      });

      if (res.data.type === 1 ) {
        const response = await fetch(`/api/login/parent?id=${res.data.id}`);
        const isOneChild = await response.json();

        if(isOneChild.hasOneChild) {
          const { id: patientId, name, gender } = isOneChild.childDetails;
          router.push({
            pathname: "/personalMenu",
            query: { patientId, name, gender },
          });
        }
      } else {
        await router.push(`/customerFile`);
      }
    } catch (err) {
      alert('Incorrect credenetials!')
    } finally {
      setIsSaving(false);
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
        <Button type="submit" variant="contained" disabled={isSaving} >התחבר</Button>
      </form>
    </>
  );
}
