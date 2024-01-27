import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
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
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [lessonType, setUserType] = useState('');
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState('');
  const router = useRouter(); // Get the router object from next/router
  const { time } = router.query;

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
      router.push('/lessonSummary/summariesPatientLessons');
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
        setDialogError("סיכום השיעור אינו יכול להיות ריק, אל תחסוך עלינו סיפורים..");
        setDialogOpen(true);
        return;
      }

      const date = formattedDateTime; // Use the formatted date and time
      const patientId = '12';  // Adjust with the actual patient ID
      const guideId = '14';    // Adjust with the actual guide ID

      const res = await axios.post("../api/lessonsSummaries/specificSummary", {
        date,
        summary,
        patientId,
        guideId,
        parentPermission,
        lessonType
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

  const selectStyle = {
    width: '240px',

  };

  useEffect(() => {
    async function fetchOptions() {
      try {
        const response = await fetch('../api/lessonsSummaries/lesson_types_options');
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    }

    fetchOptions();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    setUserType(event.target.value); // Use setUserType to update lessonType
  };

  return (
    <>
      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}>Back &gt;</Button>
      </div>

      <PicAndHeadlines
        pictureName="lessonSummary"
        picturePath="../lessonSummary.png"
        primaryHeadline="סיכומי שיעורים"
        secondaryHeadline="להשלים שם מטופל"
      />
      <PatientRow
        pictureName="boyPic"
        picturePath="../boyPic.png"
        date={date} // Use the formatted date
        time={timeOfDay} // Use the formatted time
        name="שם מטופל"
        isCenter
      />
      <form>
        <div className={style.container}>
          <FormControl className={style.rightStyle}>
            <InputLabel id="selectUsersTypes">סוג שיעור *</InputLabel>
            <Select
              labelId="selectUsersTypes"
              id="selectUsersTypesId"
              label="סוג שיעור"
              value={lessonType}
              onChange={handleSelectChange}
              required
              style={selectStyle}
            >
              {options.map(option => (
                <MenuItem key={option.id} value={option.id}>
                  {option.type}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextAreaComponent
            placeholderText=" ספר איך היה השיעור"
            value={summary}
            required
            onChange={(e) => setSummary(e.target.value)}
          />
          <Checkbox
            checked={parentPermission}
            onChange={(e) => setParentPermission(e.target.checked)}
          /> האם לאפשר להורה לצפות בשיעור?
        </div>
        <div className={style.submitButtonStyle}>
          <Button type='submit' onClick={handleClickSubmit}>הגש סיכום</Button>
        </div>
      </form>

      <CustomizedDialogs
        title={dialogError ? "הוספת הסיכום נכשל" : "הוספת הסיכום הושלם"}
        text={dialogError ? dialogError : ""}
        closeText="הבנתי"
        open={dialogOpen}
        onClose={handleCloseDialog} // Close the dialog and reset error state
      />
    </>
  );
}
