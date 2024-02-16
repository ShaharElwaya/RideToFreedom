import React, { useState } from "react";
import { Button, Radio, RadioGroup, FormControlLabel } from "@mui/material";
import style from "../styles/loginRegisterPage.module.css";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import TextFieldComponent from "@/components/UI/TextFiled";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { userStore } from "../stores/userStore";
import { useRouter } from "next/router";
import TextAreaComponent from '@/components/UI/textAreaComponent'


export default function introduction_meeting() {
  const [childRealId, setChildRealId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [address, setAddress] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [reasonForRequest, setReasonForRequest] = useState(null);
  const [gender, setGender] = useState("");
    const router = useRouter()

  const handleChange = (event) => {
    setGender(event.target.value);
  };

  const createMeetingReq = async (e) => {
    e.preventDefault();
    try {
      const body = {
        child_real_id: childRealId,
        name: patientName,
        address: address,
        birthday: birthday,
        gender: gender,
        parent_id:userStore.getState().id,
        reason_for_request: reasonForRequest
      };

      await axios.post("/api/patient/insertPatient", body);
      alert('Successfully added')
      router.push('/customerFile')
    } catch (error) {
      console.error("Error creating meeting request:", error);
      alert('Something went wrong...')

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
        <div className={style.space}>
          <div>
            <TextFieldComponent
              type="number"
              outlinedText="תז"
              required
              onChange={(e) => setChildRealId(e.target.value)}
            />
          </div>
          <div>
            <TextFieldComponent
              type="text"
              outlinedText="שם הילד/ה"
              required
              onChange={(e) => setPatientName(e.target.value)}
            />
          </div>
          <div>
            <TextFieldComponent
              type="text"
              outlinedText="כתובת"
              required
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <div>
            <DatePicker
              label="תאריך לידה"
              sx={{ width: "265px" }}
              value={birthday}
              onChange={(v) => setBirthday(new Date(v))}
            />
          </div>
          <RadioGroup
            value={gender}
            onChange={handleChange}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
            }}
          >
            <FormControlLabel value="M" control={<Radio />} label="זכר" />
            <FormControlLabel value="F" control={<Radio />} label="נקבה" />
          </RadioGroup>
        </div>
        <div>
        <TextAreaComponent
            placeholderText="סיבת בקשה*"
            value={reasonForRequest}
            required
            onChange={(e) => setReasonForRequest(e.target.value)}
          />
        </div>
      
        <Button type="submit" variant="contained">
          צור בקשה
        </Button>
      </form>
    </div>
  );
}
