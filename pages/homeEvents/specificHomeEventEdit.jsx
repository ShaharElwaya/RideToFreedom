// pages/lessonSummary/specificSummaryWatch.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import PatientRow from '@/components/UI/patientRow';
import style from '../../styles/summariesPatientLessons.module.css';
import TextAreaComponent from '@/components/UI/textAreaComponent';
import CustomizedDialogs from "@/components/dialog";
import { useRouter } from 'next/router';
import { userStore } from "@/stores/userStore";
import LoadingSpinner from '@/components/loadingSpinner';
import useCustomQuery from "@/utils/useCustomQuery";

export default function SpecificHomeEventWatch() {
  const [eventDetails, setEventDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true); 
  const [summary, setSummary] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [patientId, setPatientId] = useState("");
  const [parentId, setParentId] = useState("");
  const router = useRouter();
  const { eventId } = router.query;
  const { type, id } = userStore.getState();
  const [isSaving, setIsSaving] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  useCustomQuery(() => {
    // Fetch lesson details based on lessonId from the URL
    const fetchLessonDetails = async () => {;
      try {
        const response = await axios.get("/api/homeEvents/specificHomeEventWatch", {
            params: { event_id: eventId }, 
        });        
        setEventDetails(response.data);
        setSummary(response.data.event_summary);
        setEventDate(response.data.event_date);
        setParentId(response.data.parent_id);
        setPatientId(response.data.patient_id);
        setIsLoading(false); // Set loading to false when patient data is fetched

        if (type === 1) {
          // Fetch comments for the specific lessonId
          const childrens = await axios.get(`/api/login/childrens?id=${id}`);
          let isOk = false;
  
          for (let i = 0; i < childrens.data.length && !isOk; i++) {
            if (childrens.data[i].id == response.data.patient_id) {
              isOk = true;
            }
          }
  
          if (isOk == false) {
            router.back(); // Use await to wait for the navigation to complete
          }
        }
      } catch (error) {
        console.error('Error fetching lesson details:', error);
        setIsLoading(false); // Set loading to false when patient data is fetched
      }
    };

    fetchLessonDetails();
  }, [eventId]);

  const handleClickSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!summary.trim()) {
        setDialogError("הדיווח אינו יכול להיות ריק, אל תחסוך עלינו סיפורים..");
        setDialogOpen(true);
        return;
      }

      setIsSaving(true); 

      const res = await axios.post("../api/homeEvents/specificHomeEventEdit", {
        summary, eventId, eventDate, parentId, patientId 
      });
      setDialogError("");
      setSaveSuccess(true);
      setDialogOpen(true);
    } catch (err) {
      let errorMessage = "We have a problem, try again";

      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = `Add lesson failed: ${err.response.data.error}`;
      }

      setSaveSuccess(false);
      setDialogOpen(true);
      setDialogError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);

    if (saveSuccess) {
      router.back();
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />} {/* Use LoadingSpinner component */}

      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>

      <PicAndHeadlines
        pictureName="homeEvents"
        picturePath="../homeEvents.png"
        primaryHeadline="דיווח אירוע"
        secondaryHeadline={eventDetails.patient_name ? eventDetails.patient_name : 'No Name Data'}
      />
      <PatientRow
        pictureName="GenderPic"
        picturePath={`../${eventDetails.patient_gender === 'F' ? 'girlPic' : 'boyPic'}.png`}
        date={eventDetails.formatted_date}
        time={eventDetails.formatted_time}
        name={eventDetails.parent_name}
        isCenter
      />
      <form>
        <div className={style.container}>
          <TextAreaComponent
            value={summary}
            required
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        
        <div className={style.submitButtonStyle}>
          <Button type="submit" disabled={isSaving} variant="contained" onClick={handleClickSubmit}>
            עדכן דיווח
          </Button>
        </div>
      </form>
      <CustomizedDialogs
        title={dialogError ? "עדכון הדיווח נכשל" : "עדכון הדיווח הושלם"}
        text={dialogError ? dialogError : ""}
        open={dialogOpen}
        onClose={handleCloseDialog}
        actions={[
          <Button key="confirmButton" autoFocus onClick={handleCloseDialog}>
            הבנתי
          </Button>,
        ]}
      />
    </>
  );
}
