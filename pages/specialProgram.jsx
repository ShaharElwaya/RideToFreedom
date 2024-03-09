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
import { userStore } from "@/stores/userStore";

export default function SpecialProgram() {
  const [options, setOptions] = useState([]);
  const [classes, setClasses] = useState([
    { type: "", number: "", frequency: "" },
  ]);
  const [startDate, setStartDate] = useState(null);
  const [impression, setImpression] = useState("");
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("");
  const [dialogContent, setDialogContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const { type } = userStore.getState();

  const handleChange = (index, field, value) => {
    const newClasses = [...classes];
    newClasses[index][field] = value;
    setClasses(newClasses);
  };

  const handleRemove = (index) => {
    const newClasses = [...classes];
    newClasses.splice(index, 1);
    setClasses(newClasses);
  };

  const handleClickSpecialProgram = async (e) => {
    e.preventDefault();

    if (startDate < new Date()) {
      setDialogTitle("שגיאה בתאריך התחלת התכנית");
      setDialogContent("יש לבחור תאריך עתידי");
      setDialogOpen(true);
      return;
    }

    try {
      const promises = [];

      classes.forEach((cls) => {
        const { type, number, frequency } = cls;
        promises.push(
          axios.post("/api/specialProgram/create-booked-lesson", {
            patientId: router.query.patientId,
            type,
            number,
            frequency,
          })
        );
      });

      const resolvedPromises = await Promise.all(promises);
      const classIds = resolvedPromises.map((promise) => promise.data.id);

      const body = {
        patientId: router.query.patientId,
        startDate,
        impression,
        bookedLessons: classIds,
      };

      await axios.post("/api/specialProgram/create", body);
      alert("Created classes");

      console.log("Suggestion ID:", router.query.suggestionId);
      await axios.post("/api/suggestions/update", {
        id: router.query.suggestionId,
        status: "הסתיים",
      });
      alert("Update suggestion status");

      setDialogTitle("התכנית נוצרה בהצלחה");
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

  useCustomQuery(() => {
    if (type != 3) {
      router.back();
    }

    async function fetchOptions() {
      try {
        const response = await fetch("/api/lessons");
        const data = await response.json();
        setOptions(data);
      } catch (error) {
        console.error("Error fetching options:", error);
      }
    }

    fetchOptions();
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
          secondaryHeadline={router.query?.patientName || "אין שם זמין"}
        />
        <form onSubmit={handleClickSpecialProgram}>
          <div className={style.space}>
            <div className={style.container}>
              <DatePicker
                label="תאריך התחלת התכנית"
                sx={{ width: isSmallScreen ? "100%" : "250px" }}
                value={startDate}
                onChange={(v) => setStartDate(new Date(v))}
              />
            </div>
            <div className={style.textArea}>
              <TextAreaComponent
                type="text"
                placeholderText="התרשמות *"
                required
                value={impression}
                onChange={(e) => setImpression(e.target.value)}
              />
            </div>
            {classes.map((cls, index) => (
              <div key={index} className={style.container}>
                <FormControl className={style.rightStyleGoal}>
                  <InputLabel id="class-type-select-label">
                    סוג שיעור *
                  </InputLabel>
                  <Select
                    labelId="class-type-select-label"
                    id="class-type-select"
                    label="סוג שיעור"
                    value={cls.type}
                    onChange={(e) =>
                      handleChange(index, "type", e.target.value)
                    }
                    required
                    sx={{ width: isSmallScreen ? "93%" : "95%" }}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.id} value={option.type}>
                        {option.type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  type="number"
                  label="מס' שיעורים"
                  required
                  value={cls.number}
                  onChange={(e) =>
                    handleChange(index, "number", e.target.value)
                  }
                  style={{ width: isSmallScreen ? "78px" : "130px" }}
                />
                <TextField
                  type="number"
                  label="תדירות בשבוע"
                  required
                  value={cls.frequency}
                  onChange={(e) =>
                    handleChange(index, "frequency", e.target.value)
                  }
                  style={{ width: isSmallScreen ? "78px" : "130px" }}
                />
                {(index != 0) && (
                <Button
                  onClick={() => handleRemove(index)}
                >
                  הסר
                </Button>
                )}
              </div>
            ))}
            <Button
              onClick={() =>
                setClasses([
                  ...classes,
                  { type: "", number: "", frequency: "" },
                ])
              }
            >
              עוד שיעור
            </Button>
          </div>
          <Button type="submit" variant="contained">
            צור תכנית טיפול
          </Button>
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
