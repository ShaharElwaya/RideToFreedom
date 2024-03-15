// specialProgramWatch.jsx

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
import style from "../../styles/generalStyle.module.css";
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
  const [options, setOptions] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [addedLessons, setAddedLessons] = useState([]);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [impression, setImpression] = useState("");
  const [start_date, setStart_date] = useState("");
  const [name, setName] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [programId, setProgramId] = useState();
  const { id, type } = userStore.getState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

        const { data: patientSpecialProgram } = await axios.get(
          "/api/specialProgram/getByPatientId",
          { params: { patientId: router.query.patientId } }
        );

        const allPromises = [];
        patientSpecialProgram[0].recommended_lessons?.forEach((lessonId) => {
          allPromises.push(
            axios.get("/api/lessons/getById", { params: { id: lessonId } })
          );
        });

        const resolvedPromises = await Promise.all(allPromises);
        const allLessons = resolvedPromises.map((lesson) => lesson.data);

        setLessons(allLessons);

        const optionsResponse = await axios.get("/api/lessons");
        setOptions(optionsResponse.data);
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
            router.back();
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
    if (
      !start_date ||
      !impression ||
      lessons.some(
        (lesson) =>
          !lesson.lesson_name || !lesson.lesson_count || !lesson.frequency
      )
    ) {
      setDialogTitle("שגיאה");
      setDialogContent("יש למלא את כל השדות");
      setDialogOpen(true);
      return;
    }

    try {
      setIsSaving(true);

      const addedLessonsPromises = [];
      addedLessons.forEach((cls) => {
        const { lesson_name, lesson_count, frequency } = cls;
        addedLessonsPromises.push(
          axios.post("/api/specialProgram/createBookedLesson", {
            patientId: router.query.patientId,
            type: lesson_name,
            number: lesson_count,
            frequency,
          })
        );
      });

      const resolvedPromises = await Promise.all(addedLessonsPromises);
      const addedLessonsIds = resolvedPromises.map(
        (promise) => promise.data.id
      );
      const body = {
        patientId: router.query.patientId,
        startDate: start_date,
        impression,
        bookedLessons: [
          ...lessons.map((lesson) => lesson.id),
          ...addedLessonsIds,
        ],
        programId,
      };

      const allPromises = [];
      lessons.forEach((lesson) => {
        const body = {
          lessonId: lesson.id,
          type: lesson.lesson_name,
          count: Number(lesson.lesson_count),
          frequency: Number(lesson.frequency),
        };
        const promise = axios.put(
          "/api/specialProgram/updateBookedLesson",
          body
        );
        allPromises.push(promise);
      });
      await Promise.all(allPromises);

      const res = await axios.put("/api/specialProgram/update", body);
      console.log("🚀 ~ handleUpdateForm ~ res:", res);
      setDialogTitle("התכנית עודכנה בהצלחה");
      setDialogContent("");
    } catch (err) {
      console.error("Error saving suggestion:", err.message);
      setDialogTitle("שגיאה בעדכון התכנית");
      setDialogContent("הייתה שגיאה בעת עדכון התכנית. נסה שוב מאוחר יותר.");
    } finally {
      setDialogOpen(true);
      setIsLoading(false);
      setIsSaving(false);
    }
    setEditMode(false);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogTitle("");
    setDialogContent("");

    if (!dialogContent) {
      <Nevigation
        patientId={router.query.patientId}
        screen="specialProgramWatch"
      />;
    }
  };

  const handleChangeLesson = (i, newValue, field) => {
    if (newValue < 1) return;
    const lessonsCopy = [...lessons];
    lessonsCopy[i][field] = newValue;

    setLessons(lessonsCopy);
  };

  const handleChangeAddedLesson = (i, newValue, field) => {
    if (newValue < 1) return;

    const addedLessonsCopy = [...addedLessons];
    addedLessonsCopy[i][field] = newValue;

    setAddedLessons(addedLessonsCopy);
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
                disabled={true}
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
                    {options?.map((option) => (
                      <MenuItem key={option.id} value={option.type}>
                        {option.type}
                      </MenuItem>
                    ))}
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
                {editMode && index != 0 && (
                  <Button
                    onClick={() =>
                      setLessons((prev) => prev.filter((_, i) => i !== index))
                    }
                  >
                    הסר
                  </Button>
                )}
              </div>
            ))}
            {addedLessons.map((lesson, index) => (
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
                      handleChangeAddedLesson(
                        index,
                        e.target.value,
                        "lesson_name"
                      )
                    }
                    disabled={!editMode}
                    sx={{ width: isSmallScreen ? "93%" : "95%" }}
                  >
                    {options?.map((option) => (
                      <MenuItem key={option.id} value={option.type}>
                        {option.type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  type="number"
                  label="מס' שיעורים"
                  disabled={!editMode}
                  value={lesson.lesson_count}
                  onChange={(e) =>
                    handleChangeAddedLesson(
                      index,
                      e.target.value,
                      "lesson_count"
                    )
                  }
                  style={{ width: isSmallScreen ? "78px" : "130px" }}
                />
                <TextField
                  type="number"
                  label="תדירות בשבוע"
                  disabled={!editMode}
                  value={lesson.frequency}
                  onChange={(e) =>
                    handleChangeAddedLesson(index, e.target.value, "frequency")
                  }
                  style={{ width: isSmallScreen ? "78px" : "130px" }}
                />
                {editMode && (
                  <Button
                    onClick={() => {
                      setAddedLessons((prev) =>
                        prev.filter((_, i) => i !== index)
                      );
                    }}
                  >
                    הסר
                  </Button>
                )}
              </div>
            ))}
            {editMode && (
              <Button
                onClick={() =>
                  setAddedLessons([
                    ...addedLessons,
                    {
                      lesson_name: options[0].type,
                      lesson_count: 1,
                      frequency: 1,
                    },
                  ])
                }
              >
                עוד שיעור
              </Button>
            )}
          </div>
        </form>
      </div>
      {type === 3 && (
        <Button
          variant="contained"
          disabled={isSaving}
          onClick={() => (editMode ? handleUpdateForm() : setEditMode(true))}
          style={{ margin: "5px" }}
        >
          {editMode ? "עדכון התוכנית" : "עריכת תכנית טיפול"}
        </Button>
      )}

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
    </>
  );
}
