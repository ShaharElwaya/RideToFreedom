import React, { useState } from "react";
import { useRouter } from "next/router";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/summariesPatientLessons.module.css";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import CustomizedDialogs from "@/components/dialog";
import LoadingSpinner from "@/components/loadingSpinner";
import { Button } from "@mui/material";
import axios from "axios";
import useCustomQuery from "@/utils/useCustomQuery";
import { userStore } from "@/stores/userStore";

export default function SpecialProgramSuggestion() {
  const [proposalText, setProposalText] = useState("");
  const router = useRouter();
  const { query } = router;
  const { time, patientId } = router.query;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [guidetName, setGuideName] = useState("");
  const { type, id } = userStore.getState();
  const [isOk, setIsOk] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleProposalChange = (event) => {
    setProposalText(event.target.value);
  };

  const parseDateString = (dateString) => {
    const [datePart, timePart] = dateString.split(' ');
    const [month, day, year] = datePart.split('/');
    const [hour, minute] = timePart.split(':');
  
    let parsedDate = new Date(year, month - 1, day, hour, minute);
  
    // Set hours to 00 instead of 24
    if (hour === '24') {
      parsedDate.setHours(0);
      parsedDate.setDate(parsedDate.getDate() - 1);
    }
  
    return parsedDate;
  };
  
  const parsedDate = time ? parseDateString(time) : null;
  
  const formattedDateTime = parsedDate
  ? `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}-${parsedDate.getDate().toString().padStart(2, '0')} ` +
    `${parsedDate.getHours().toString().padStart(2, '0')}:${parsedDate.getMinutes().toString().padStart(2, '0')}:00`
  : '';
  
  const date = parsedDate
    ? `${parsedDate.getDate().toString().padStart(2, '0')}/${(parsedDate.getMonth() + 1).toString().padStart(2, '0')}/${parsedDate.getFullYear()}`
    : '';
  
  const hours = parsedDate ? parsedDate.getHours().toString().padStart(2, '0') : '';
  const minutes = parsedDate ? parsedDate.getMinutes().toString().padStart(2, '0') : '';
  const timeOfDay = parsedDate ? `${hours}:${minutes}` : '';

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setIsSaving(true); 

    try {
      const date = formattedDateTime;
      const body = {
        suggestion: proposalText,
        patientId: router.query.patientId,
        guideId: id,
        date,
      };

      await axios.post("/api/suggestions/saveSuggestion", body);

      setDialogTitle("ההצעה הוגשה בהצלחה");
      setDialogContent("");
      setIsOk(true);
    } catch (error) {
      console.error("Error saving suggestion:", error.message);
      setDialogTitle("שגיאה בהגשת ההצעה");
      setDialogContent("הייתה שגיאה בעת שמירת ההצעה. נסה שוב מאוחר יותר.");
    } finally {
      setDialogOpen(true);
      setIsLoading(false);
      setIsSaving(false);
    }
  };

  const handleCloseDialog = async () => {
    setDialogOpen(false);
    setDialogTitle("");
    setDialogContent("");

    if(isOk) {
        router.push(`../personalMenu?patientId=${router.query.patientId}`);
    }
  };

  useCustomQuery(() => {
    if (type == 1) {
      router.back();
    }

    async function fetchData() {
      try {
        const [patientData, guideData] = await Promise.all([
          getPatientName(),
          getGuideName(),
        ]);

        setName(patientData.name);
        setGender(patientData.gender);
        setGuideName(guideData.name);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoading(false);
      }
    }

    async function getPatientName() {
      try {
        if (router.query.patientId) {
          const response = await fetch(
            `../api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(
              router.query.patientId
            )}`
          );
          const data = await response.json();
          return data;
        }
      } catch (error) {
        console.error("Error fetching patient name:", error);
        throw error;
      }
    }

    async function getGuideName() {
      try {
        const response = await axios.get(
          "/api/lessonsSummaries/guideIdToName",
          {
            params: { id: id },
          }
        );
        return response.data;
      } catch (error) {
        console.error("Error fetching parent name:", error);
        throw error;
      }
    }

    fetchData();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  
  return (
    <>
      {isLoading && <LoadingSpinner />}
      
      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>

      <div>
        <PicAndHeadlines
          pictureName="specialProgramSuggestion"
          picturePath="../specialProgramSuggestion.png"
          primaryHeadline="הצעה לתכנית טיפול מיוחדת"
          secondaryHeadline={name}
        />

        <PatientRow
          pictureName="GenderPic"
          picturePath={`../${gender === "F" ? "girlPic" : "boyPic"}.png`}
          date={date}
          time={timeOfDay}
          name={guidetName}
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
            <Button variant="contained" type="submit" disabled={isSaving}>
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
