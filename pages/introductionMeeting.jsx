import React, { useState } from "react";
import { Button, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import style from "../styles/loginRegisterPage.module.css";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import TextFieldComponent from "@/components/UI/TextFiled";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { userStore } from "../stores/userStore";
import { useRouter } from "next/router";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function introduction_meeting() {
  const [childRealId, setChildRealId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [meetingDate, setMeetingDate] = useState(null);
  const [reasonForRequest, setReasonForRequest] = useState("");
  const [gender, setGender] = useState("");
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleChange = (event) => {
    setGender(event.target.value);
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

      alert("Successfully added");

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
      setIsLoading(false);

      router.push("/customerFile");
    } catch (error) {
      console.error("Error creating meeting request:", error);
      alert("Something went wrong...");
      setIsLoading(false);
    }
  };

  return (
    <div className={style.general}>
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
              sx={{ width: '50%' }}
              required
              onChange={(e) => setChildRealId(e.target.value)}
            />
            <TextFieldComponent
              type="text"
              outlinedText="שם הילד/ה"
              sx={{ width: '50%' }}
              required
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>
          <div className={style.container}>
            <div className={style.divStyle}>
              <TextFieldComponent
                type="text"
                outlinedText="כתובת"
                sx={{ width: '50%' }}
                required
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className={style.divStyle}>
              <DatePicker
                label="תאריך לידה"
                sx={{ width: '100%' }}
                value={birthday}
                onChange={(v) => setBirthday(new Date(v))}
              />
            </div>
          </div>
          <div className={style.container}>
            <RadioGroup
              className={style.container}
              value={gender}
              onChange={handleChange}
              sx={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <FormControlLabel value="M" control={<Radio />} label="זכר" />
              <FormControlLabel value="F" control={<Radio />} label="נקבה" />
            </RadioGroup>
          </div>
        </div>
        <div className={style.textArea}>
          <div>
            <DatePicker
              label="בחירת תאריך לפגישה"
              sx={{ width: "265px" }}
              value={meetingDate}
              onChange={(v) => setMeetingDate(new Date(v))}
            />
          </div>
        </div>
        <div>
          <TextAreaComponent
            placeholderText="סיבת בקשה*"
            value={reasonForRequest}
            required
            onChange={(e) => setReasonForRequest(e.target.value)}
          />
        </div>
        <Button type="submit" variant="contained" disabled={isLoading}>
          קביעת פגישה לילד
        </Button>
      </form>
    </div>
  );
}
