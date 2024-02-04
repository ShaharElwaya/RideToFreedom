// pages/lessonSummary/specificSummaryWatch.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import PatientRow from '@/components/UI/patientRow';
import style from '../../styles/summariesPatientLessons.module.css';
import TextAreaComponent from '@/components/UI/textAreaComponent';
import CustomizedDialogs from '@/components/dialog';
import LoadingSpinner from '@/components/loadingSpinner';
import { useRouter } from 'next/router';

export default function SpecificSummaryWatch() {
  const [lessonDetails, setLessonDetails] = useState({});
  const router = useRouter();
  const { lessonId } = router.query;
  const [parentPermission, setParentPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleGoBack = () => {
    router.back();
  };

  const selectStyle = {
    width: '240px',
  };

  useEffect(() => {
    // Fetch lesson details based on lessonId from the URL
    const fetchLessonDetails = async () => {;
      try {
        const response = await axios.get("/api/lessonsSummaries/specificSummaryWatch", {
            params: { lesson_id: lessonId }, 
        });        
        setLessonDetails(response.data);
        setParentPermission(response.data.parent_permission);
        setIsLoading(false);
      } catch (error) {
        alert("error");
        console.error('Error fetching lesson details:', error);
        setIsLoading(false);
      }
    };

    fetchLessonDetails();
  }, [lessonId]);

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
        secondaryHeadline={lessonDetails.patient_name ? lessonDetails.patient_name : 'No Name Data'}
      />
      <PatientRow
        pictureName="GenderPic"
        picturePath={`../${lessonDetails.gender === 'F' ? 'girlPic' : 'boyPic'}.png`}
        date={lessonDetails.formatted_date}
        time={lessonDetails.formatted_time}
        name={lessonDetails.guide_name}
        lesson={lessonDetails.lesson_type_name}
        isCenter
      />
      <form>
        <div className={style.container}>
          <TextAreaComponent
            placeholderText=" ספר איך היה השיעור *"
            value={lessonDetails.summary}
            required
            disabled
          />
          <Checkbox
            checked={parentPermission}
            disabled
          /> האם לאפשר להורה לצפות בשיעור?
        </div>
      </form>
    </>
  );
}
