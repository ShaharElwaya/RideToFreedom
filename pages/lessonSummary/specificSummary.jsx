import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Button, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import PatientRow from '@/components/UI/patientRow';
import style from '../../styles/summariesPatientLessons.module.css';
import TextAreaComponent from '@/components/UI/textAreaComponent';
import CustomizedDialogs from '@/components/dialog';
import LoadingSpinner from '@/components/loadingSpinner';
import { useRouter } from 'next/router';
import { userStore } from '@/stores/userStore';
import useCustomQuery from "@/utils/useCustomQuery";

export default function SummariesPatientLessons() {
  const [summary, setSummary] = useState('');
  const [parentPermission, setParentPermission] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [lessonType, setUserType] = useState('');
  const [options, setOptions] = useState([]);
  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [guidetName, setGuideName] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { time, patientId } = router.query;
  const { type, id } = userStore.getState(); 
  const [isSaving, setIsSaving] = useState(false); 

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
      router.push(`/lessonSummary/summariesPatientLessons?patientId=${encodeURIComponent(patientId)}`);
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleClickSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!summary.trim()) {
        setDialogError("סיכום השיעור אינו יכול להיות ריק, אל תחסוך עלינו סיפורים..");
        setDialogOpen(true);
        return;
      }

      const date = formattedDateTime;

      setIsSaving(true); 

      const res = await axios.post("../api/lessonsSummaries/specificSummary", {
        date,
        summary,
        patientId,
        id,
        parentPermission,
        lessonType
      });
      setDialogError('');
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

  const selectStyle = {
    width: '240px',
  };

  useCustomQuery(() => {
    if (type == 1) {
      router.back();
    }

    async function fetchData() {
      try {
        const [optionsData, patientData, guideData] = await Promise.all([
          fetchOptions(),
          getPatientName(),
          getGuideName(),
        ]);

        setOptions(optionsData);
        setName(patientData.name);
        setGender(patientData.gender);
        setGuideName(guideData.name);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      } finally {
        setIsLoading(false);
      }
    }

    async function fetchOptions() {
      try {
        const response = await fetch('../api/lessonsSummaries/lesson_types_options');
        const data = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching options:', error);
        throw error;
      }
    }

    async function getPatientName() {
      try {
        if (router.query.patientId) {
          const response = await fetch(`../api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(router.query.patientId)}`);
          const data = await response.json();
          console.log('Patient Name Data:', data);
          return data;
        }
      } catch (error) {
        console.error('Error fetching patient name:', error);
        throw error;
      }
    }

    async function getGuideName() {
      try {
        const response = await axios.get('/api/lessonsSummaries/guideIdToName', {
          params: { id: id },
        });
        return response.data;
      } catch (error) {
        console.error('Error fetching parent name:', error);
        throw error;
      }
    }

    fetchData();
  }, []);

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
    setUserType(event.target.value);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}

      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>

      <PicAndHeadlines
        pictureName="lessonSummary"
        picturePath="../lessonSummary.png"
        primaryHeadline="סיכומי שיעורים"
        secondaryHeadline={name ? name : 'No Name Data'}
      />
      <PatientRow
        pictureName="GenderPic"
        picturePath={`../${gender === 'F' ? 'girlPic' : 'boyPic'}.png`}
        date={date}
        time={timeOfDay}
        name={guidetName}
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
            placeholderText=" ספר איך היה השיעור *"
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
          <Button type='submit' disabled={isSaving} variant="contained" onClick={handleClickSubmit}>הגש סיכום</Button>
        </div>
      </form>

      <CustomizedDialogs
        title={dialogError ? "הוספת הסיכום נכשל" : "הוספת הסיכום הושלם"}
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
