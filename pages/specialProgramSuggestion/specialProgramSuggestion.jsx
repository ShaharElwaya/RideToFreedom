import React, { useState } from "react";
import { useRouter } from 'next/router';
import PicAndHeadlines from "@/components/UI/picAndheadline";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/summariesPatientLessons.module.css";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import CustomizedDialogs from "@/components/dialog";
import LoadingSpinner from "@/components/loadingSpinner";
import { Button } from "@mui/material";
import axios from "axios";

export default function SpecialProgramSuggestion() {
  const [proposalText, setProposalText] = useState("");
  const router = useRouter();
  const { query } = router;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);


  const handleProposalChange = (event) => {
    setProposalText(event.target.value);
  };

  const formattedDate = () => {
    const currentDate = new Date().toISOString(); // Rename variable to avoid conflict

    if (currentDate) {
      const [date, time] = currentDate.split("T");
      const currentTime = time ? time.split(".")[0] : "";
      const formattedDateString = `${date
        .split("-")
        .reverse()
        .join("-")} ${currentTime.slice(0, -3)}`;
      return formattedDateString;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const body = {
        suggestion: proposalText,
        patientId: query.patientId,
        guideId: query.guideId,
      };

      await axios.post("/api/suggestions/saveSuggestion", body);

      setDialogTitle("ההצעה הוגשה בהצלחה");
      setDialogContent("");
    } catch (error) {
      console.error("Error saving suggestion:", error.message);
      setDialogTitle("שגיאה בהגשת ההצעה");
      setDialogContent("הייתה שגיאה בעת שמירת ההצעה. נסה שוב מאוחר יותר.");
    } finally {
      setDialogOpen(true);
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogTitle("");
    setDialogContent("");

    if (!dialogContent) {
      router.push("/customerFile");
    }
  };

  return (
    <>
    {isLoading && <LoadingSpinner />}
    <div>
      <PicAndHeadlines
        pictureName="specialProgramSuggestion"
        picturePath="../specialProgramSuggestion.png"
        primaryHeadline="הצעה לתכנית טיפול מיוחדת"
        secondaryHeadline={query.patientName}
      />

      <PatientRow
        pictureName="GenderPic"
        picturePath={`../girlPic.png`}
        date={formattedDate()}
        name={query.guideName}
        isCenter
      />

      <form onSubmit={handleSubmit}>
        <div className={style.container}>
          <TextAreaComponent
            placeholderText="* רשום את ההצעה לתכנית טיפול מיוחדת"
            value={proposalText}
            onChange={handleProposalChange}
            required
          />
        </div>
        <div className={style.submitButtonStyle}>
          <Button variant="contained" type="submit">
            הגש הצעה
          </Button>
        </div>
      </form>
      <CustomizedDialogs
          title={dialogTitle}
          text={dialogContent}
          open={dialogOpen}
          onClose={handleCloseDialog}
          actions={[
            <Button key="confirmButton" autoFocus onClick={handleCloseDialog}>
              הבנתי
            </Button>,
          ]}
        />
      </div>
       </>
  );
}