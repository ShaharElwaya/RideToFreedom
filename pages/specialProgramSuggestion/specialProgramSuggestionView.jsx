import React, { useState, useEffect } from "react";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/summariesPatientLessons.module.css";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import axios from "axios";
import { useRouter } from "next/router";
import { Button } from "@mui/material";

export default function SpecialProgramSuggestion() {
  const [data, setData] = useState();
  const {query, push} = useRouter();
  console.log("🚀 ~ SpecialProgramSuggestion ~ query:", query)

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

  const handleCreateProgram = () => {
    push({
        pathname: "/specialProgram",
        query: {
          patientName: query.patientName,
          patientId:query.patientId
        },
      });
  };
  if (!query.date || !query.guideName || !query.suggestionId || !query.patientName) return <div>Not valid!</div>

  return (
    <div>
      <PicAndHeadlines
        pictureName="specialProgramSuggestion"
        picturePath="../specialProgramSuggestion.png"
        primaryHeadline="הצעה לתכנית טיפול מיוחדת"
      />

      <PatientRow
        pictureName="GenderPic"
        picturePath="../girlPic.png"
        date={query.date}
        name={query.guideName}
        isCenter
      />

      <form>
        <div className={style.container}>
          <TextAreaComponent value={data?.suggestion} required />
        </div>
      </form>
      {data?.status === "wait for program" && (
        <Button variant="outlined" onClick={handleCreateProgram}>
          יצירת תכנית
        </Button>
      )}
    </div>
  );
}
