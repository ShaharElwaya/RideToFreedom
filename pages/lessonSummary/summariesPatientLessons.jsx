// pages/lessonSummary/summariesPatientLessons.js

import { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import PatientRow from '@/components/UI/patientRow';
import style from '../../styles/summariesPatientLessons.module.css';
import { useRouter } from 'next/router';

export default function SummariesPatientLessons() {
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [addTime, setAddTime] = useState('');

  // Handle function to navigate to the specificSummary page
  const handleAdd = () => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Jerusalem", // Set the timezone to Israel
    });

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: "UTC",
      timeZone: "Asia/Jerusalem", // Set the timezone to Israel
    });

    const formattedDateTime = `${currentDate} ${currentTime}`;
    setAddTime(formattedDateTime);

    router.push(`/lessonSummary/specificSummary?time=${encodeURIComponent(formattedDateTime)}`);
  };  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get('/api/lessonsSummaries/summariesPatientLessons', {
          params: { patient_id: 12 }, // Adjust the patient_id as needed
        });
        setLessons(data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

  return (
    <>
      <PicAndHeadlines
        pictureName="lessonSummary"
        picturePath="../lessonSummary.png"
        primaryHeadline="סיכומי שיעורים"
        secondaryHeadline="להשלים שם מטופל"
      />
      <div className={style.addButtonStyle}>
        <Button onClick={handleAdd}>+ הוספת סיכום</Button>
      </div>
      {lessons.map((lesson) => (
        <PatientRow
          pictureName={lesson.type}
          picturePath={`../${lesson.patient_gender === 'F' ? 'girlPic' : 'boyPic'}.png`}
          date={lesson.formatted_date}
          time={lesson.formatted_time}
          name={lesson.guide_name}  
          lesson={lesson.lesson_type}
        />
      ))}
    </>
  );
}
