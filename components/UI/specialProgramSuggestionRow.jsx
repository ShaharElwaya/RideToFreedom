import React, { useState } from "react";
import style from "../../styles/patientRowCss.module.css";
import { Typography, Button, Tooltip, IconButton } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import FolderSpecial from "@mui/icons-material/FolderSpecial";
import Event from "@mui/icons-material/Event";
import { DateTimePicker } from "@mui/x-date-pickers";

export default function SuggestionRow({
  isCenter = false,
  suggestion,
  suggestions,
  setSuggestions,
}) {
  const router = useRouter();
  const query = useRouter();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [timeForMeeting, setTimeForMeeting] = useState();

  const onClick = () => {
    router.push({
      pathname: "/specialProgramSuggestion/specialProgramSuggestionView",
      query: {
        suggestionId: suggestion.id,
        patientName: suggestion.patient_name,
        guideName: suggestion.guide_name,
        patientId: suggestion.patient_id,
        date: suggestion.date,
      },
    });
  };

  const handleCreateTreatmentPlan = async (e) => {
    e.stopPropagation();
    router.push({
      pathname: "/specialProgram",
      query: {
        patientName: suggestion.patient_name,
        patientId: suggestion.patient_id,
        suggestionId: suggestion.id,
      },
    });
  };

  const handleSetMeeting = async (e) => {
    e.stopPropagation();
    const { data: guideUser } = await axios.get("/api/users/getUserById", {
      params: { id: suggestion.guide_id },
    });
    const { data: patientUser } = await axios.get("/api/patient/getPatient", {
      params: { patient_id: suggestion.patient_id },
    });
    const { data: parentUser } = await axios.get("/api/users/getUserById", {
      params: { id: patientUser[0].parent_id },
    });
    const { data: managerGuideUser } = await axios.get(
      "/api/users/getUserByType",
      { params: { type: 3 } }
    );

    try {
      const body = {
        name: "פגישת יצירת תכנית טיפול",
        date: timeForMeeting,
        location: "Israel",
        description: suggestion.suggestion,
        users: [parentUser.email, guideUser.email, managerGuideUser.email],
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
      hour12: false,
      timeZone: "Asia/Jerusalem",
    };

    const formattedDateTime = new Date(date).toLocaleString("en-IL", options);

    // Conditionally format the date based on the screen size
    if (isSmallScreen) {
      const [day, month] = formattedDateTime.split("/");
      return `${day}/${month} `;
    } else {
      return formattedDateTime.replace(",", "");
    }
  };

  return (
    <>
      {!isSmallScreen && (
        <td style={{ width: "20px" }}>
          <img
            src={`../${suggestion.gender === "F" ? "boyPic" : "girlPic"}.png`}
            alt={suggestion.gender}
            className={style.pic}
          />
        </td>
      )}
      <td style={{ width: isSmallScreen ? "60px" : "110px" }}>
        <Typography className={style.txtSpecial}>
          {suggestion.date && formattedDate(suggestion.date)}
        </Typography>
      </td>
      <td style={{ width: isSmallScreen ? "60px" : "200px" }}>
        <Tooltip title={suggestion.patient_name}>
          <Typography
            className={style.txtSpecial}
            noWrap
            style={{ width: isSmallScreen ? "80px" : "230px" }}
          >
            {suggestion.patient_name}
          </Typography>
        </Tooltip>
      </td>
      <td style={{ width: isSmallScreen ? "60px" : "150px" }}>
        <Tooltip title={suggestion.guide_name}>
          <Typography
            className={style.txtSpecial}
            noWrap
            style={{ width: isSmallScreen ? "80px" : "150px" }}
          >
            {suggestion.guide_name}
          </Typography>
        </Tooltip>
      </td>
      <td style={{ width: isSmallScreen ? "90px" : "200px" }}>
        <Tooltip title={suggestion.status && suggestion.status}>
          <Typography
            className={style.txtSpecial}
            noWrap
            style={{ width: isSmallScreen ? "80px" : "200px" }}
          >
            {suggestion.status && suggestion.status}
          </Typography>
        </Tooltip>
      </td>
      <td
        style={{ width: isSmallScreen ? "0px" : "150px", textAlign: "right" }}
      >
        {suggestion.status === "ממתין לקביעת פגישה" ? (
          isSmallScreen ? (
            <Tooltip title="קביעת פגישה">
              <IconButton onClick={handleSetMeeting}>
                <Event />
              </IconButton>
            </Tooltip>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                margin:0
              }}
            >
              <DateTimePicker
                required
                label={"קבע תאריך לפגישה"}
                value={timeForMeeting}
                onChange={setTimeForMeeting}
                sx={{width:250}}
              />
              <Button
                variant="contained"
                onClick={handleSetMeeting}
                sx={{width:125}}
              >
                קביעת פגישה
              </Button>
              
            </div>
          )
        ) : (
          suggestion.status === "ממתין ליצירת תכנית" &&
          (isSmallScreen ? (
            <Tooltip title="צור תכנית טיפול">
              <IconButton onClick={handleCreateTreatmentPlan}>
                <FolderSpecial />
              </IconButton>
            </Tooltip>
          ) : (
            <Button
              variant="contained"
              onClick={handleCreateTreatmentPlan}
              style={{ width: "130px" }}
            >
              צור תכנית טיפול
            </Button>
          ))
        )}
      </td>
    </>
  );
}
