import React from "react";
import style from "../../styles/patientRowCss.module.css";
import { Typography } from "@mui/material";
import { useRouter } from "next/router";

export default function SuggestionRow({
  pictureName,
  patientId,
  picturePath,
  patient_name,
  guide_name,
  date,
  status,
  isCenter = false,
  onSetMeeting,
  suggestionId,
}) {
  const router = useRouter();
  const onClick = () => {
    router.push({
      pathname: "/specialProgramSuggestion/specialProgramSuggestionView",
      query: {
        suggestionId,
        patientName: patient_name,
        guideName: guide_name,
        date: date,
        patientId,
      },
    });
  };

  return (
    <div
      className={isCenter ? style.containerCenter : style.container}
      onClick={onClick}
    >
      <img src={picturePath} alt={pictureName} className={style.pic} />
      <Typography className={style.txt}>
        {patient_name} &nbsp; {guide_name} &nbsp; {date} &nbsp; {status}
      </Typography>
      {status === "onhold" && (
        <button onClick={onSetMeeting}>Set a Meeting</button>
      )}
    </div>
  );
}
