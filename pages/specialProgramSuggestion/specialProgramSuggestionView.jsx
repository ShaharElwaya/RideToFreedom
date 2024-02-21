import React, { useState, useEffect } from "react";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/summariesPatientLessons.module.css";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import axios from "axios";
import { useRouter } from 'next/router';
import { Button } from "@mui/material";

export default function SpecialProgramSuggestion() {
  const [data, setData] = useState();
  const { query, push } = useRouter();
  const router = useRouter();

  
  useEffect(() => {
    const fetchSuggestion = async () => {
      try {
        const res = await axios.post(`/api/suggestions/getById`, {
          id: query.suggestionId,
        });
        setData(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSuggestion();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleCreateProgram = () => {
    push({
      pathname: "/specialProgram",
      query: {
        patientName: query.patientName,
        patientId: query.patientId,
      },
    });
  };

  const formattedDate = () => {
    if (query.date) {
      const [date, time] = query.date.split('T');
      const currentTime = time ? time.split('.')[0] : '';
      const formattedDateString = `${date.split("-").reverse().join("-")} ${currentTime.slice(0, -3)}`;
      return formattedDateString;
    }
  };
  

  if (!query.date || !query.guideName || !query.suggestionId || !query.patientName) return <div>Not valid!</div>;

  return (
    <>
      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>

      <div>
        <PicAndHeadlines
          pictureName="specialProgramSuggestion"
          picturePath="../specialProgramSuggestion.png"
          primaryHeadline="הצעה לתכנית טיפול מיוחדת"
          secondaryHeadline= {query.patientName}
        />

        <PatientRow
          pictureName="GenderPic"
          picturePath="../girlPic.png"
          date={formattedDate()}
          name={query.guideName}
          isCenter
        />

        <form>
          <div className={style.container}>
            <TextAreaComponent value={data?.suggestion} required />
          </div>
        </form>
        {/* {data?.status === "ממתין ליצירת תכנית" && (
          <Button variant="contained" onClick={handleCreateProgram}>
            יצירת תכנית
          </Button>
        )} */}
      </div>
    </>
  );
}
