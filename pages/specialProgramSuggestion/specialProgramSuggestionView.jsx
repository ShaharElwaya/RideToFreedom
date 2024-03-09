import React, { useState, useEffect } from "react";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/summariesPatientLessons.module.css";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import axios from "axios";
import { useRouter } from 'next/router';
import { Button } from "@mui/material";
import useCustomQuery from "@/utils/useCustomQuery";
import { userStore } from "@/stores/userStore";
import Nevigation from "@/components/nevigation";

export default function SpecialProgramSuggestion() {
  const [data, setData] = useState();
  const { query, push } = useRouter();
  const router = useRouter();
  const { type } = userStore.getState();

  useCustomQuery(() => {
    if (type == 1) {
      router.back();
    }
    
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

  const formattedDate = () => {
    if (data?.date) {
      const [date, time] = data?.date.split('T');
      const currentTime = time ? time.split('.')[0] : '';
      const formattedDateString = `${date.split("-").reverse().join("-")} ${currentTime.slice(0, -3)}`;
      return formattedDateString;
    }
  };

  const handleCreateProgram = () => {
    router.push(`../specialProgram?patientId=${data?.patient_id}&&patientName=${data?.patient_name}&&suggestionId=${query.suggestionId}`);
  };

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
          secondaryHeadline= {data?.patient_name}
        />

        <PatientRow
          pictureName="GenderPic"
          picturePath={`../${data?.patient_gender === 'F' ? 'girlPic' : 'boyPic'}.png`}
          date={formattedDate()}
          name={data?.guide_name}
          isCenter
        />

        <form>
          <div className={style.container}>
            <TextAreaComponent value={data?.suggestion} readOnly={true} />
          </div>
        </form>
        {data?.status == "ממתין ליצירת תכנית" && type === 3 && (
          <Button variant="contained" onClick={handleCreateProgram}>
            יצירת תוכנית טיפול מיוחדת
          </Button>
        )}
      </div>
      <Nevigation patientId={data?.patient_id} screen="specialProgramSuggestionView" />
    </>
  );
}
