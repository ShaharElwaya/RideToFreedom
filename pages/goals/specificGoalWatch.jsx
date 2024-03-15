// specificGoalWatch.jsx

import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import axios from "axios";
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import GoalRow from "@/components/UI/goalRow";
import style from "../../styles/generalStyle.module.css";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import CustomizedDialogs from "@/components/dialog";
import { useRouter } from "next/router";
import { userStore } from "@/stores/userStore";
import LoadingSpinner from "@/components/loadingSpinner";
import useCustomQuery from "@/utils/useCustomQuery";
import useMediaQuery from "@mui/material/useMediaQuery";
import Nevigation from "@/components/nevigation";

export default function SpecificGoalWatch() {
  const [goalsDetails, setGoalsDetails] = useState({
    patient_id: "",
    patient_name: "",
    summary: "",
    field_id: "",
    field_name: "",
    status_id: "",
    status_name: "",
    destination_date: "",
    setting_date: "",
  });
  const router = useRouter();
  const { goalId, index } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const { type, id } = userStore.getState();
  const [isSaving, setIsSaving] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [patientId, setPatientId] = useState("");

  const handleGoBack = () => {
    router.back();
  };

  useCustomQuery(() => {
    // Fetch lesson details based on lessonId from the URL
    const fetchGoalsDetails = async () => {
      try {
        const response = await axios.get("/api/goals/specificGoalWatch", {
          params: { goal_id: goalId },
        });
        setGoalsDetails(response.data);
        setPatientId(response.data.patient_id);
        setIsLoading(false);

        if (type === 1) {
          // Fetch comments for the specific lessonId
          const childrens = await axios.get(`/api/login/childrens?id=${id}`);
          let isOk = false;

          for (let i = 0; i < childrens.data.length && !isOk; i++) {
            if (childrens.data[i].id == response.data.patient_id) {
              isOk = true;
            }
          }

          if (isOk == false) {
            router.back(); 
          }
        }
      } catch (error) {
        console.error("Error fetching lesson details:", error);
        setIsLoading(false);
      }
    };

    fetchGoalsDetails();
  }, [goalId]);

  const handleClick = (goalId, index) => {
    router.push(
      `/goals/specificGoalEdit?goalId=${encodeURIComponent(
        goalId
      )}&index=${encodeURIComponent(index)}`
    );
  };

  const handleClickDelete = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("../api/goals/specificGoalDelete", {
        goalId,
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

  const handleCloseDialog = () => {
    setDialogOpen(false);

    if (saveSuccess) {
      router.push(`/goals/goals?patientId=${encodeURIComponent(patientId)}`);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />} {/* Use LoadingSpinner component */}
      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>
      <PicAndHeadlines
        pictureName="goal"
        picturePath="../goal.png"
        primaryHeadline="קביעת מטרה"
        secondaryHeadline={
          goalsDetails.patient_name ? goalsDetails.patient_name : "No Name Data"
        }
      />
      <GoalRow goal={`מטרה ${index}`} />
      <form>
        {/* Display other goal details in read-only mode */}
        <div className={style.container}>
          <TextAreaComponent
            placeholderText=" מה המטרה שתרצה להגדיר? *"
            value={goalsDetails.summary}
            readOnly={true}
          />
        </div>
        <div className={style.container}>
          <DatePicker
            label="תאריך קביעת מטרה"
            sx={{ width: isSmallScreen ? "50%" : "255px" }}
            value={dayjs(goalsDetails.setting_date)}
            disabled
          />
          <DatePicker
            label="תאריך יעד רצוי"
            sx={{ width: isSmallScreen ? "50%" : "255px" }}
            value={dayjs(goalsDetails.destination_date)}
            disabled
          />
        </div>

        <div className={style.container}>
          <FormControl className={style.rightStyleGoal}>
            <InputLabel id="fieldTypeLabel">תחום המטרה</InputLabel>
            <Select
              labelId="fieldTypeLabel"
              id="fieldTypeId"
              label="תחום המטרה"
              value={goalsDetails.field_id}
              disabled
              sx={{ width: isSmallScreen ? "93%" : "95%" }}
            >
              <MenuItem value={goalsDetails.field_id}>
                {goalsDetails.field_name}
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl className={style.rightStyleGoal}>
            <InputLabel id="statusTypeLabel">סטטוס המטרה</InputLabel>
            <Select
              labelId="statusTypeLabel"
              id="statusTypeId"
              label="סטטוס המטרה"
              value={goalsDetails.status_id}
              disabled
              sx={{ width: isSmallScreen ? "93%" : "95%" }}
            >
              <MenuItem value={goalsDetails.status_id}>
                {goalsDetails.status_name}
              </MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className={style.centerStyle}>
          <Button
            variant="contained"
            onClick={() => handleClick(goalId, index)}
            style={{ margin: "5px" }}
          >
            עריכת מטרה
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            variant="contained"
            onClick={handleClickDelete}
            style={{ margin: "5px" }}
          >
            מחיקת מטרה
          </Button>
        </div>
      </form>
      <CustomizedDialogs
        title={dialogError ? "מחיקת המטרה נכשלה" : "מחיקת המטרה הושלמה"}
        text={dialogError ? dialogError : ""}
        open={dialogOpen}
        onClose={handleCloseDialog}
        actions={[
          <Button key="confirmButton" autoFocus onClick={handleCloseDialog}>
            הבנתי
          </Button>,
        ]}
      />
      <Nevigation patientId={patientId} screen="specificGoalsWatch" />
    </>
  );
}
