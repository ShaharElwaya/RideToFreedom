// specificHomeEvent.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/generalStyle.module.css";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import CustomizedDialogs from "@/components/dialog";
import { useRouter } from "next/router";
import LoadingSpinner from "@/components/loadingSpinner";
import { userStore } from "@/stores/userStore";
import useCustomQuery from "@/utils/useCustomQuery";

export default function SpecificHomeEvent() {
  const [summary, setSummary] = useState("");
  const [dialogError, setDialogError] = useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [name, setName] = useState();
  const [gender, setGender] = useState();
  const [parentName, setParentName] = useState("");
  const [isLoading, setIsLoading] = useState(true); 
  const router = useRouter();
  const { time, patientId } = router.query;
  const { type, id } = userStore.getState();
  const [isSaving, setIsSaving] = useState(false);

  const parseDateString = (dateString) => {
    const [datePart, timePart] = dateString.split(" ");
    const [month, day, year] = datePart.split("/");
    const [hour, minute] = timePart.split(":");

    let parsedDate = new Date(year, month - 1, day, hour, minute);

    // Set hours to 00 instead of 24
    if (hour === "24") {
      parsedDate.setHours(0);
      parsedDate.setDate(parsedDate.getDate() - 1);
    }

    return parsedDate;
  };

  const parsedDate = time ? parseDateString(time) : null;

  const formattedDateTime = parsedDate
    ? `${parsedDate.getFullYear()}-${(parsedDate.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${parsedDate
        .getDate()
        .toString()
        .padStart(2, "0")} ` +
      `${parsedDate.getHours().toString().padStart(2, "0")}:${parsedDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}:00`
    : "";

  const date = parsedDate
    ? `${parsedDate.getDate().toString().padStart(2, "0")}/${(
        parsedDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}/${parsedDate.getFullYear()}`
    : "";

  const hours = parsedDate
    ? parsedDate.getHours().toString().padStart(2, "0")
    : "";
  const minutes = parsedDate
    ? parsedDate.getMinutes().toString().padStart(2, "0")
    : "";
  const timeOfDay = parsedDate ? `${hours}:${minutes}` : "";

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

      setIsSaving(true);

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
    } finally {
      setIsSaving(false);
    }
  };

  useCustomQuery(() => {
    if (type != 1) {
      router.back();
    }

    async function checkPremission() {
      try {
        if (type === 1) {
          // Fetch comments for the specific lessonId
          const response = await axios.get(`/api/login/childrens?id=${id}`);
          let isOk = false;

          for (let i = 0; i < response.data.length && !isOk; i++) {
            if (response.data[i].id == patientId) {
              isOk = true;
            }
          }

          if (isOk == false) {
            router.back(); // Use await to wait for the navigation to complete
          }
        }
      } catch (error) {
        console.error("Error checking permission:", error);
      }
    }

    checkPremission();

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
          <Button
            type="submit"
            disabled={isSaving}
            variant="contained"
            onClick={handleClickSubmit}
          >
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
