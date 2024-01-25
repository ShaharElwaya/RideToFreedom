import React, { useState } from 'react';
import axios from 'axios';
import { Typography, Button, Checkbox } from '@mui/material';
import { TextareaAutosize } from '@mui/material';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import PatientRow from '@/components/UI/patientRow';
import style from '../../styles/summariesPatientLessons.module.css';
import TextAreaComponent from '@/components/UI/textAreaComponent';
import CustomizedDialogs from '@/components/dialog';
import { useRouter } from 'next/router'; // Import useRouter from next/router

export default function SummariesPatientLessons() {
  const [summary, setSummary] = useState('');
  const [parentPermission, setParentPermission] = useState(false);
  const [dialogError, setDialogError] = useState(""); // Add a state variable for error message
  const [dialogOpen, setDialogOpen] = React.useState(false); // Initialize state
  const router = useRouter(); // Get the router object from next/router

  const handleCloseDialog = () => {
    setDialogOpen(false);
    router.push('/lessonSummary/summariesPatientLessons');
  };

  const handleClickSubmit = async (e) => {
    e.preventDefault();

    try {
      const date = '01-23-2023 16:07';
      const patientId = '12';  // Adjust with the actual patient ID
      const guideId = '12';    // Adjust with the actual guide ID

      const res = await axios.post("../api/lessonsSummaries/specificSummary", {
        date,
        summary,
        patientId,
        guideId,
        parentPermission,
      });
      setDialogOpen(true);
    } catch (err) {
        let errorMessage = "We have a problem, try again"; // Default error message

        if (err.response && err.response.data && err.response.data.error) {
            // If there is a specific error message from the server, use that
            errorMessage = `Add lesson failed: ${err.response.data.error}`;
        }

        // Open the error dialog with the specific error message
        setDialogOpen(true);
        setDialogError(errorMessage); // Set the error message in the state
    }
  };

  return (
    <>
      <PicAndHeadlines
        pictureName="lessonSummary"
        picturePath="../lessonSummary.png"
        primaryHeadline="סיכומי שיעורים"
        secondaryHeadline="להשלים שם מטופל"
      />
      <PatientRow
        pictureName="boyPic"
        picturePath="../boyPic.png"
        date="12.3.12"
        time="23:34"
        name="שם מטופל"
        isCenter
      />
      <div className={style.container}>
        <TextAreaComponent
          placeholderText=" ספר איך היה השיעור"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <Checkbox
          checked={parentPermission}
          onChange={(e) => setParentPermission(e.target.checked)}
        /> האם לאפשר להורה לצפות בשיעור?
      </div>
      <div className={style.submitButtonStyle}>
        <Button onClick={handleClickSubmit}>הגש סיכום</Button>
      </div>

      <CustomizedDialogs
                title={dialogError ? "הוספת הסיכום נכשל" : "הוספת הסיכום הושלם"}
                text={dialogError ? dialogError: ""}
                closeText="הבנתי"
                open={dialogOpen}
                onClose={handleCloseDialog} // Close the dialog and reset error state
            />
    </>
  );
}
