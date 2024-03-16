// login.jsx

import TextFieldComponent from "@/components/UI/TextFiled";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import CustomizedDialogs from "@/components/dialog";
import { Button } from "@mui/material";
import axios from "axios";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { setUserData } from "../stores/userStore";
import style from "../styles/loginRegisterPage.module.css";
import { userStore } from "@/stores/userStore";

export default function login() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { is_logged_in } = userStore.getState();

  useEffect(() => {
    if (is_logged_in) {
      router.push("/customerFile");
    }
  }, []);

  const handleClickLogin = async (e) => {
    e.preventDefault();
    try {
      const email = e.target[0].value;
      const password = e.target[2].value;

      setIsSaving(true);

      const res = await axios.post("api/login", { email, password });

      setUserData({
        type: res.data.type,
        email: res.data.email,
        id: res.data.id,
        is_logged_in: true,
      });

      if (res.data.type === 1) {
        const response = await fetch(`/api/login/parent?id=${res.data.id}`);
        const isOneChild = await response.json();
        const numberOfChildren = isOneChild.childDetails.length;

        if (isOneChild.hasOneChild) {
          const { id: patientId } = isOneChild.childDetails;
          router.push({
            pathname: "/personalMenu",
            query: { patientId },
          });
        } else if (numberOfChildren === 0) {
          await router.push(`/introMeeting/introductionMeeting`);
        } else {
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
    setDialogError(""); 
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
