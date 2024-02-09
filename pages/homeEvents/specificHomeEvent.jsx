import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Typography,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/summariesPatientLessons.module.css";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import CustomizedDialogs from "@/components/dialog";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/loadingSpinner";
import { userStore } from "@/stores/userStore";

export default function SpecificHomeEvent() {
  const [summary, setSummary] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [parentName, setParentName] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const router = useRouter();
  const { time } = router.query;
  const { patientId } = router.query;
  const { type, id } = userStore.getState();

  const formattedDateTime = time
    ? new Date(time).toLocaleString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })
    : "";

  const date = time
    ? new Date(time).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
    : "";

  const timeOfDay = time
    ? new Date(time).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: false,
      })
    : "";

  const handleCloseDialog = () => {
    setDialogOpen(false);

    if (saveSuccess) {
      router.push(
        `/homeEvents/homeEvents?patientId=${encodeURIComponent(patientId)}`
      );
    }
  };

  const handleGoBack = () => {
    router.back();
  };

  const handleClickSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!summary.trim()) {
        setDialogError("הדיווח אינו יכול להיות ריק, אל תחסוך עלינו סיפורים..");
        setDialogOpen(true);
        return;
      }

      const date = formattedDateTime;

      const res = await axios.post("../api/homeEvents/specificHomeEvent", {
        date,
        summary,
        patientId,
        id,
      });
      setDialogError("");
      setSaveSuccess(true);
      setDialogOpen(true);
    } catch (err) {
      let errorMessage = "We have a problem, try again";

      if (err.response && err.response.data && err.response.data.error) {
        errorMessage = `Add lesson failed: ${err.response.data.error}`;
      }

      setSaveSuccess(false);
      setDialogOpen(true);
      setDialogError(errorMessage);
    }
  };

  useEffect(() => {
    if (type != 1) {
      router.back();
    }

    // Keep track of completion status for each fetch operation
    let isPatientNameLoaded = false;
    let isParentNameLoaded = false;

    async function getPatientName() {
      try {
        if (router.query.patientId) {
          const response = await fetch(
            `../api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(
              router.query.patientId
            )}`
          );
          const data = await response.json();
          console.log("Patient Name Data:", data);
          setName(data.name);
          setGender(data.gender);
          isPatientNameLoaded = true;
        }
      } catch (error) {
        console.error("Error fetching patient name:", error);
      }
    }

    async function getParentName() {
      try {
        const response = await axios.get("/api/homeEvents/ParentIdToName", {
          params: { id: id },
        });
        setParentName(response.data.name);
        isParentNameLoaded = true;
      } catch (error) {
        console.error("Error fetching parent name:", error);
      }
    }

    // Use Promise.all to wait for all asynchronous operations to complete
    Promise.all([getPatientName(), getParentName()])
      .then(() => {
        // Set isLoading to false when all data is fetched
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error during data fetching:", error);
        setIsLoading(false);
      });
  }, []);

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
        secondaryHeadline={name ? name : "No Name Data"}
      />
      <PatientRow
        pictureName="GenderPic"
        picturePath={`../${gender === "F" ? "girlPic" : "boyPic"}.png`}
        date={date}
        time={timeOfDay}
        name={parentName}
        isCenter
      />
      <form>
        <div className={style.container}>
          <TextAreaComponent
            placeholderText=" ספר על האירוע שקרה *"
            value={summary}
            required
            onChange={(e) => setSummary(e.target.value)}
          />
        </div>
        <div className={style.submitButtonStyle}>
          <Button type="submit" variant="contained" onClick={handleClickSubmit}>
            הגש דיווח
          </Button>
        </div>
      </form>
      <CustomizedDialogs
        title={dialogError ? "הוספת הדיווח נכשלה" : "הוספת הדיווח הושלמה"}
        text={dialogError ? dialogError : ""}
        open={dialogOpen}
        onClose={handleCloseDialog}
        actions={[
          <Button key="confirmButton" autoFocus onClick={handleCloseDialog}>
            הבנתי
          </Button>,
        ]}
      />
    </>
  );
}
