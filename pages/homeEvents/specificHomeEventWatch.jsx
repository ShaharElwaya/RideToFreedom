// pages/lessonSummary/specificSummaryWatch.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Checkbox, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import PatientRow from '@/components/UI/patientRow';
import style from '../../styles/summariesPatientLessons.module.css';
import TextAreaComponent from '@/components/UI/textAreaComponent';
import { useRouter } from 'next/router';
import LoadingSpinner from '@/components/loadingSpinner';
import useCustomQuery from "@/utils/useCustomQuery";

export default function SpecificHomeEventWatch() {
  const [eventDetails, setEventDetails] = useState({});
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();
  const { eventId } = router.query;


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
        setIsLoading(false); // Set loading to false when patient data is fetched
      } catch (error) {
        alert("error");
        console.error('Error fetching lesson details:', error);
        setIsLoading(false); // Set loading to false when patient data is fetched
      }
    };

    fetchLessonDetails();
  }, [eventId]);

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
            value={eventDetails.event_summary}
            required
            disabled
          />
        </div>
      </form>
    </>
  );
}
