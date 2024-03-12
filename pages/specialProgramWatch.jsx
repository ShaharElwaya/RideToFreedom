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
import { userStore } from "@/stores/userStore";

export default function SpecialProgram() {
  const [lessons, setLessons] = useState([]);
  console.log("🚀 ~ SpecialProgram ~ lessons:", lessons);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [impression, setImpression] = useState("");
  const [start_date, setStart_date] = useState("");
  const [name, setName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [programId, setProgramId] = useState();
  const { id, type } = userStore.getState();

  useCustomQuery(() => {
    async function fetchProgram() {
      try {
        const response = await axios.get("/api/specialProgram", {
          params: { patient_id: router.query.patientId },
        });

        setStart_date(response.data.start_date);
        setImpression(response.data.impression);
        setName(response.data.patient_name);
        setProgramId(response.data.id);

        const responsLessons = await axios.get(
          "/api/lessons/recommendedLessons",
          {
            params: { patient_id: router.query.patientId },
          }
        );
        setLessons(responsLessons.data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }

    async function checkPremission() {
      try {
        if (type === 1) {
          // Fetch comments for the specific lessonId
          const response = await axios.get(`/api/login/childrens?id=${id}`);
          let isOk = false;

          for (let i = 0; i < response.data.length && !isOk; i++) {
            if (response.data[i].id == router.query.patientId) {
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
    fetchProgram();
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  const handleUpdateForm = async () => {
    const body = {
      patientId: router.query.patientId,
      startDate: start_date,
      impression,
      bookedLessons: lessons.map((lesson) => lesson.id),
      programId,
    };

    try {
      const allPromises = [];
      lessons.forEach((lesson) => {
        const body = {
          lessonId: lesson.id,
          type: lesson.lesson_name,
          count: Number(lesson.lesson_count),
          frequency: Number(lesson.frequency),
        };
        const promise = axios.put(
          "/api/specialProgram/update-booked-lesson",
          body
        );
        allPromises.push(promise);
      });
     const allRes =  await Promise.all(allPromises);
     console.log("🚀 ~ handleUpdateForm ~ allRes:", allRes)

      // const res = await axios.put("/api/specialProgram/update", body);
    } catch (err) {
      console.log(err);
    }
    setEditMode(false);
  };

  const handleChangeLesson = (i, newValue, field) => {
    const lessonsCopy = [...lessons];
    lessonsCopy[i][field] = newValue

    setLessons(lessonsCopy)
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
          primaryHeadline="תכנית טיפול מיוחדת"
          secondaryHeadline={name}
        />
        <form>
          <div className={style.space}>
            <div className={style.container}>
              <DatePicker
                label="תאריך התחלת התכנית"
                sx={{ width: isSmallScreen ? "100%" : "250px" }}
                value={dayjs(start_date)}
                disabled={!editMode}
              />
            </div>
            <div className={style.textArea}>
              <TextAreaComponent
                type="text"
                placeholderText="התרשמות *"
                readOnly={!editMode}
                onChange={(e) => setImpression(e.target.value)}
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
                    onChange={(e) =>
                      handleChangeLesson(index, e.target.value, "lesson_name")
                    }
                    disabled={!editMode}
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
                  disabled={!editMode}
                  value={lesson.lesson_count}
                  onChange={(e) =>
                    handleChangeLesson(index, e.target.value, "lesson_count")
                  }
                  style={{ width: isSmallScreen ? "78px" : "130px" }}
                />
                <TextField
                  type="number"
                  label="תדירות בשבוע"
                  disabled={!editMode}
                  value={lesson.frequency}
                  onChange={(e) =>
                    handleChangeLesson(index, e.target.value, "frequency")
                  }
                  style={{ width: isSmallScreen ? "78px" : "130px" }}
                />
              </div>
            ))}
          </div>
        </form>
      </div>
      <Button
        variant="contained"
        onClick={() => (editMode ? handleUpdateForm() : setEditMode(true))}
        style={{ margin: "5px" }}
      >
        {editMode ? "עדכון התוכנית" : "עריכת תכנית טיפול"}
      </Button>
      <Nevigation
        patientId={router.query.patientId}
        screen="specialProgramWatch"
      />
    </>
  );
}
