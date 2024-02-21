import React from "react";
import style from "../../styles/patientRowCss.module.css";
import { Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";

export default function SuggestionRow({
  isCenter = false,
  suggestion,
  suggestions,
  setSuggestions,
}) {
  const router = useRouter();
  const query = useRouter();

  const onClick = () => {
    router.push({
      pathname: "/specialProgramSuggestion/specialProgramSuggestionView",
      query: {
        suggestionId: suggestion.id,
        patientName: suggestion.patientName,
        guideName: suggestion.guideName,
        patientId: suggestion.patient_id,
        date:suggestion.date
      },
    });
  };

  const handleCreateTreatmentPlan = async (e) => {
    e.stopPropagation();
    router.push({
      pathname: "/specialProgram",
      query: {
        patientName: suggestion.patientName,
        patientId: suggestion.patient_id,
        suggestionId: suggestion.id
      },
    });
  };
  

  const handleSetMeeting = async (e) => {
    e.stopPropagation();
    const {data:guideUser} = await axios.get('/api/users/getUserById', {params:{id:suggestion.guide_id}})
    const {data:patientUser} = await axios.get('/api/patient/getPatient', {params:{patient_id:suggestion.patient_id}})
    const {data:parentUser} = await axios.get('/api/users/getUserById', {params:{id:patientUser[0].parent_id}})
    const {data:managerGuideUser} = await axios.get('/api/users/getUserByType', {params:{type:3}})

    try {
      const body = {
        name: "פגישה",
        date: new Date(),
        location: "Israel",
        description: suggestion.suggestion,
        users: [
          parentUser.email,
          guideUser.email,
          managerGuideUser.email
        ],
      };
      const updatedSuggestion = {
        ...suggestion,
        status: "ממתין ליצירת תכנית",
      };
      const filteredSuggestions = suggestions.filter(
        (suggestion) => suggestion.patient_id !== updatedSuggestion.patient_id
      );
      const newSuggestions = [...filteredSuggestions, updatedSuggestion];
      await axios.post("/api/suggestions/update", {
        id: updatedSuggestion.id,
        status: updatedSuggestion.status,
      });

      setSuggestions(newSuggestions);

      await axios.post("/api/google", body);
    } catch (error) {
      console.error("Error setting meeting:", error);
    }
  };

  const formattedDate = (date) => {
    if (!date) return "";
    
    const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Jerusalem"
    };

    const formattedDateTime = new Date(date).toLocaleString("en-IL", options);
    return formattedDateTime.replace(",", ""); 
};
  

  return (
    <div
      className={`${isCenter ? style.containerCenter : style.container} ${
        style.bottomBorder
      }`}
      onClick={onClick}
    >
      <img
        src={`../${suggestion.gender === "F" ? "boyPic" : "girlPic"}.png`}
        alt={suggestion.gender}
        className={style.pic}
      />
      <div className={style.textContainer}>
        <Typography className={style.txt}>
          {suggestion.date && formattedDate(suggestion.date)} &nbsp;
          {suggestion.patientName && <>&nbsp;{suggestion.patientName}&nbsp;</>}
          {suggestion.guideName && <>&nbsp;{suggestion.guideName}&nbsp;</>}
          {suggestion.status && <>&nbsp;{suggestion.status}</>}
        </Typography>
      </div>
      { suggestion.status === "ממתין לקביעת פגישה" && (
          <Button variant="contained" onClick={handleSetMeeting}>
            קביעת פגישה
          </Button>
        )}

        { suggestion.status === "ממתין ליצירת תכנית" && (
          <Button variant="contained" onClick={handleCreateTreatmentPlan}>
            צור תכנית טיפול
          </Button>
        )}
        
    </div>
  );
}
