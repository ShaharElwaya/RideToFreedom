import TextFieldComponent from "@/components/UI/TextFiled";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useEffect, useState } from "react";
import style from "../styles/summariesPatientLessons.module.css";
import { useRouter } from "next/router";
import axios from "axios";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import CustomizedDialogs from "@/components/dialog";
import LoadingSpinner from "@/components/loadingSpinner";
import useMediaQuery from "@mui/material/useMediaQuery";
import useCustomQuery from "@/utils/useCustomQuery";
import dayjs from "dayjs";
import Nevigation from "@/components/nevigation";

export default function SpecialProgram() {
  const [lessons, setLessons] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [impression, setImpression] =  useState(""); 
  const [start_date, setStart_date] =  useState("");
  const [name, setName] =  useState("");

  useCustomQuery(() => {
    async function fetchProgram() {
      try {
        const response = await axios.get("/api/specialProgram",
        {
            params: { patient_id: router.query.patientId },
        } );

        setStart_date(response.data.start_date);
        setImpression(response.data.impression);
        setName(response.data.patient_name);

        const responsLessons = await axios.get("/api/lessons/recommendedLessons",
            {
                params: { patient_id: router.query.patientId },
            }
          );
        setLessons(responsLessons.data);
        
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }

    fetchProgram();
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

      <div className={style.general}>
        <PicAndHeadlines
          pictureName="specialProgram"
          picturePath="../specialProgram.png"
          primaryHeadline="הגדרת תכנית טיפול מיוחדת"
          secondaryHeadline={name}
        />
        <form>
          <div className={style.space}>
            <div className={style.container}>
              <DatePicker
                label="תאריך התחלת התכנית"
                sx={{ width: isSmallScreen ? "100%" : "250px" }}
                value={dayjs(start_date)}
                disabled
              />
            </div>
            <div className={style.textArea}>
              <TextAreaComponent
                type="text"
                placeholderText="התרשמות *"
                readOnly = {true}
                value={impression}
              />
            </div>
            {lessons.map((lesson, index) => (
              <div key={index} className={style.container}>
                <FormControl className={style.rightStyleGoal}>
                  <InputLabel id="class-type-select-label">
                    סוג שיעור *
                  </InputLabel>
                  <Select
                    labelId="class-type-select-label"
                    id="class-type-select"
                    label="סוג שיעור"
                    value={lesson.lesson_name}
                    disabled
                    sx={{ width: isSmallScreen ? "93%" : "95%" }}
                  >
                    <MenuItem value={lesson.lesson_name}>
                {lesson.lesson_name}
              </MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  type="number"
                  label="מס' שיעורים"
                  disabled
                  value={lesson.lesson_count}
                  style={{ width: isSmallScreen ? "78px" : "130px" }}
                />
                <TextField
                  type="number"
                  label="תדירות בשבוע"
                  disabled
                  value={lesson.frequency}
                  style={{ width: isSmallScreen ? "78px" : "130px" }}
                />
              </div>
            ))}
          </div>
        </form>
      </div>
      <Nevigation patientId={router.query.patientId} screen="specialProgramWatch" />
    </>
  );
}
