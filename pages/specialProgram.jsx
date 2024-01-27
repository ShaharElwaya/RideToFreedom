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
import style from "../styles/loginRegisterPage.module.css";

export default function SpecialProgram() {
  const [options, setOptions] = useState([]);
  const [classes, setClasses] = useState([
    { type: "", number: "", frequency: "" },
  ]);
  const [childId, setChildId] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [impression, setImpression] = useState("");

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
    console.log("Child ID:", childId);
    console.log("Classes:", classes);
    console.log("Start Date", startDate);
    console.log("Impression", impression);
  };

  useEffect(() => {
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

  return (
    <>
      <div className={style.general}>
        <PicAndHeadlines
          pictureName="specialProgram"
          picturePath="../specialProgram.png"
          isMain
          primaryHeadline="הגדרת תכנית טיפול מיוחדת"
          secondaryHeadline="להשלים שם מטופל"
        />
        <form onSubmit={handleClickSpecialProgram}>
          <div className={style.space}>
            <div>
              <TextField
                type="number"
                label="ת.ז ילד"
                required
                value={childId}
                onChange={(e) => setChildId(e.target.value)}
                style={{ width: 250 }}
              />
            </div>
            <div>
              <DatePicker
                label="תאריך התחלת התכנית"
                sx={{ width: 250 }}
                value={startDate}
                onChange={(v) => setStartDate(new Date(v))}
              />
            </div>
            <div>
              <TextFieldComponent
                type="text"
                outlinedText="התרשמות"
                required
                value={impression}
                onChange={(e) => setImpression(e.target.value)}
              />
            </div>
            {classes.map((cls, index) => (
              <div key={index} style={{ paddingRight: 62 }}>
                <FormControl style={{ textAlign: "right" }}>
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
                    style={{ width: 250 }}
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
                  label="מספר שיעורים"
                  required
                  value={cls.number}
                  onChange={(e) =>
                    handleChange(index, "number", e.target.value)
                  }
                  style={{ width: 250 }}
                />
                <TextField
                  type="number"
                  label="תדירות שיעורים בשבוע"
                  required
                  value={cls.frequency}
                  onChange={(e) =>
                    handleChange(index, "frequency", e.target.value)
                  }
                  style={{ width: 250 }}
                />
                <Button
                  sx={{ visibility: index === 0 && "hidden" }}
                  onClick={() => handleRemove(index)}
                >
                  הסר
                </Button>
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
      </div>
    </>
  );
}
