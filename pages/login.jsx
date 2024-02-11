import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { Typography, TextField, Button } from "@mui/material";
import style from "../styles/loginRegisterPage.module.css";
import TextFieldComponent from "@/components/UI/TextFiled";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import { setUserData, userStore } from "../stores/userStore";
import CustomizedDialogs from "@/components/dialog";

export default function login() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleClickLogin = async (e) => {
    e.preventDefault();
    try {
      const email = e.target[0].value;
      const password = e.target[2].value;

      setIsSaving(true);

      const res = await axios.post("api/login", { email, password });

      await setUserData({
        type: res.data.type,
        email: res.data.email,
        id: res.data.id,
        is_logged_in: true,
      });

      if (res.data.type === 1) {
        const response = await fetch(`/api/login/parent?id=${res.data.id}`);
        const isOneChild = await response.json();

        if (isOneChild.hasOneChild) {
          const { id: patientId, name, gender } = isOneChild.childDetails;
          router.push({
            pathname: "/personalMenu",
            query: { patientId, name, gender },
          });
        }
        else{
          await router.push(`/customerFile`);
        }
      } else {
        await router.push(`/customerFile`);
      }
    } catch (err) {
      let errorMessage = "פרטים ההתחברות אינם נכונים, נסה שנית"; // Default error message

      if (err.response && err.response.data && err.response.data.error) {
        // If there is a specific error message from the server, use that
        errorMessage = `Login failed: ${err.response.data.error}`;
      }

      // Open the error dialog with the specific error message
      setDialogError(errorMessage); // Set the error message in the state
      setDialogOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogError(""); // Clear the error message when the dialog is closed
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
        <Button type="submit" variant="contained" disabled={isSaving}>
          התחבר
        </Button>
      </form>

      <CustomizedDialogs
        title="ההתחברות נכשלה"
        text={dialogError}
        open={dialogOpen}
        onClose={handleCloseDialog}
        actions={[
          <Button key="confirmButton" autoFocus onClick={handleCloseDialog}>
            OK
          </Button>,
        ]}
      />
    </>
  );
}
