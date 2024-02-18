import React, { useState, useEffect } from "react";
import {
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";

import style from "../styles/loginRegisterPage.module.css";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import TextFieldComponent from "@/components/UI/TextFiled";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { userStore } from "../stores/userStore";
import { useRouter } from "next/router";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import useMediaQuery from "@mui/material/useMediaQuery";
import CustomizedDialogs from "@/components/dialog";
import LoadingSpinner from "@/components/loadingSpinner";
import { DateTimePicker } from "@mui/x-date-pickers";

export default function IntroductionMeeting() {
  const [childRealId, setChildRealId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [meetingDate, setMeetingDate] = useState(null);
  const [reasonForRequest, setReasonForRequest] = useState("");
  const [gender, setGender] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [previousRoute, setPreviousRoute] = useState("");
  const { type, id } = userStore.getState();

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);

    if (!dialogError) {
      router.push("/customerFile");
    }
  };

  const createMeetingReq = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const body = {
        child_real_id: childRealId,
        name: patientName,
        address: address,
        birthday: birthday,
        gender: gender,
        parent_id: userStore.getState().id,
        reason_for_request: reasonForRequest,
      };

      await axios.post("/api/patient/insertPatient", body);

      const { data: allUsers } = await axios.get("/api/users");
      const filteredUsers = allUsers.filter((user) => user.type !== 1);
      const randomIndex = Math.floor(Math.random() * filteredUsers.length);
      const randomGuide = filteredUsers[randomIndex];

      const googleMeetingBody = {
        users: [userStore.getState().email, randomGuide.email],
        date: meetingDate,
        location: "israel",
        description: reasonForRequest,
        name: `פגישה לילד: ${patientName}`,
      };

      await axios.post("/api/google", googleMeetingBody);

      setDialogError("");
      setDialogOpen(true);
    } catch (error) {
      console.error("Error creating meeting request:", error);
      setDialogError("Something went wrong...");
      setDialogOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = async () => {
    if (type === 1) {
      const response = await fetch(`/api/login/parent?id=${id}`);
      const isOneChild = await response.json();

      const numberOfChildren = response.childDetails
        ? response.childDetails.length
        : 0;

      if (numberOfChildren === 0) {
        await router.push(`/customerFile`);
      }
    } else {
      router.back();
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className={style.general}>
        <div className={style.leftStyle}>
          <Button onClick={handleGoBack}> חזור &gt;</Button>
        </div>
        <PicAndHeadlines
          pictureName="introicon"
          picturePath="../introicon.png"
          primaryHeadline="בקשה לפגישת היכרות"
        />
        <form onSubmit={createMeetingReq}>
          <div>
            <div className={style.container}>
              <TextFieldComponent
                type="number"
                outlinedText="תז"
                sx={{ width: "50%" }}
                required
                onChange={(e) => setChildRealId(e.target.value)}
              />
              <TextFieldComponent
                type="text"
                outlinedText="שם הילד/ה"
                sx={{ width: "50%" }}
                required
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>
            <div className={style.container}>
              <div className={style.divStyle}>
                <TextFieldComponent
                  type="text"
                  outlinedText="כתובת"
                  sx={{ width: "50%" }}
                  required
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <FormControl className={style.divStyle}>
                <InputLabel id="selectGender">מגדר *</InputLabel>
                <Select
                  value={gender}
                  onChange={handleChange}
                  label="מגדר"
                  required
                  sx={{ width: isSmallScreen ? "93%" : "95%" }}
                >
                  <MenuItem value="M">זכר</MenuItem>
                  <MenuItem value="F">נקבה</MenuItem>
                </Select>
              </FormControl>
            </div>
            <div className={style.container}>
              <div className={style.divStyle}>
                <DatePicker
                  label="תאריך לידה *"
                  required
                  sx={{ width: "100%" }}
                  value={birthday}
                  onChange={(v) => setBirthday(new Date(v))}
                />
              </div>
              <div className={style.divStyle}>
                <DateTimePicker
                  required
                  label="תאריך לפגישה *"
                  sx={{ width: "100%" }}
                  value={meetingDate}
                  onChange={(v) => setMeetingDate(new Date(v))}
                />
              </div>
            </div>
          </div>
          <div>
            <TextAreaComponent
              placeholderText="סיבת בקשה *"
              value={reasonForRequest}
              required
              onChange={(e) => setReasonForRequest(e.target.value)}
            />
          </div>
          <Button type="submit" variant="contained" disabled={isLoading}>
            קביעת פגישה לילד
          </Button>
        </form>
        <CustomizedDialogs
          title={dialogError ? "קביעת הפגישה נכשלה" : "קביעת הפגישה הושלמה"}
          text={dialogError ? dialogError : ""}
          open={dialogOpen}
          onClose={handleCloseDialog}
          actions={[
            <Button key="confirmButton" autoFocus onClick={handleCloseDialog}>
              הבנתי
            </Button>,
          ]}
        />
      </div>
    </>
  );
}
