import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import PatientRow from '@/components/UI/patientRow';
import style from '../../styles/summariesPatientLessons.module.css';
import TextAreaComponent from '@/components/UI/textAreaComponent';
import CustomizedDialogs from '@/components/dialog';
import { useRouter } from 'next/router'; // Import useRouter from next/router

export default function SpecificHomeEvent() {
  const [summary, setSummary] = useState('');
  const [dialogError, setDialogError] = useState(""); // Add a state variable for error message
  const [dialogOpen, setDialogOpen] = React.useState(false); // Initialize state
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [parentName, setParentName] = useState('');
  const router = useRouter(); // Get the router object from next/router
  const { time } = router.query;
  const { patientId } = router.query;
  
  const parentId = '16';    // Adjust with the actual guide ID

  // Format the received time with Israel timezone
  const formattedDateTime = time ? new Date(time).toLocaleString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }) : '';

  const date = time ? new Date(time).toLocaleDateString("en-US", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }) : '';

  const timeOfDay = time ? new Date(time).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  }) : '';

  const handleCloseDialog = () => {
    setDialogOpen(false);

    if (saveSuccess) {
      router.push(`/homeEvents/homeEvents?patientId=${encodeURIComponent(patientId)}`);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleClickSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!summary.trim()) {
        // Display an error if the summary is empty or contains only whitespace
        setDialogError("הדיווח אינו יכול להיות ריק, אל תחסוך עלינו סיפורים..");
        setDialogOpen(true);
        return;
      }

      const date = formattedDateTime; // Use the formatted date and time

      const res = await axios.post("../api/homeEvents/specificHomeEvent", {
        date,
        summary,
        patientId,
        parentId
      });
      setDialogError('');
      setSaveSuccess(true); // Set save success to true 
      setDialogOpen(true);
    } catch (err) {
      let errorMessage = "We have a problem, try again"; // Default error message

      if (err.response && err.response.data && err.response.data.error) {
        // If there is a specific error message from the server, use that
        errorMessage = `Add lesson failed: ${err.response.data.error}`;
      }

      // Open the error dialog with the specific error message
      setSaveSuccess(false); // Set save success to false
      setDialogOpen(true);
      setDialogError(errorMessage); // Set the error message in the state
    }
  };

  useEffect(() => {
    async function getPatientName() {
      try {
        if (router.query.patientId) {
          const response = await fetch(`../api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(router.query.patientId)}`);
          const data = await response.json();
          console.log('Patient Name Data:', data);
          setName(data.name);
          setGender(data.gender);
        }
      } catch (error) {
        console.error('Error fetching patient name:', error);
      }
    }

    async function getParentName() {
        try {
          const response = await axios.get('/api/homeEvents/ParentIdToName', {
            params: { id: parentId },
          });
          setParentName(response.data.name);
        } catch (error) {
          console.error('Error fetching parent name:', error);
        }
      }
  
    getPatientName();
    getParentName();
  }, []);

  return (
    <>
      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}>Back &gt;</Button>
      </div>

      <PicAndHeadlines
        pictureName="homeEvents"
        picturePath="../homeEvents.png"
        primaryHeadline="דיווח אירוע"
        secondaryHeadline={name ? name : 'No Name Data'}
      />
          <PatientRow
            pictureName="GenderPic"
            picturePath={`../${gender === 'F' ? 'girlPic' : 'boyPic'}.png`}
            date={date} // Use the formatted date
            time={timeOfDay} // Use the formatted time
            name={parentName}
            isCenter
          />
      <form>
        <div className={style.container}>
          <TextAreaComponent
            placeholderText=" ספר על האירוע שקרה *"
            value={summary}
            required
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div className={style.submitButtonStyle}>
          <Button type='submit' onClick={handleClickSubmit}>הגש דיווח</Button>
        </div>
      </form>

      <CustomizedDialogs
        title={dialogError ? "הוספת הדיווח נכשל" : "הוספת הדיווח הושלם"}
        text={dialogError ? dialogError : ""}
        closeText="הבנתי"
        open={dialogOpen}
        onClose={handleCloseDialog} // Close the dialog and reset error state
      />
    </>
  );
}
