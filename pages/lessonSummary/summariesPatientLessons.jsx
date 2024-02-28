import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Container,
  Card,
  CardContent,
  Chip,
  Typography,
} from "@mui/material";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/summariesPatientLessons.module.css";
import LoadingSpinner from "@/components/loadingSpinner";
import { useRouter } from "next/router";
import { userStore } from "@/stores/userStore";
import useCustomQuery from "@/utils/useCustomQuery";
import useMediaQuery from "@mui/material/useMediaQuery";
import { isThenable } from "next/dist/client/components/router-reducer/router-reducer-types";
import Nevigation from "@/components/nevigation";

export default function SummariesPatientLessons() {
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [addTime, setAddTime] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { patientId } = router.query;
  const { type, id } = userStore.getState();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [maxLettersGuideName, setMaxLettersGuideName] = useState(0);

  // Filter state
  const [filters, setFilters] = useState({
    selectedGuides: [],
    selectedLessonTypes: [],
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
  });
  const [guides, setGuides] = useState([]);
  const [lessonTypes, setLessonTypes] = useState([]);

  const handleAdd = () => {
    const currentDate = new Date().toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      timeZone: "Asia/Jerusalem",
    });

    const currentTime = new Date().toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: "Asia/Jerusalem",
    });

    const formattedDateTime = `${currentDate} ${currentTime}`;
    setAddTime(formattedDateTime);

    router.push(
      `/lessonSummary/specificSummary?time=${encodeURIComponent(
        formattedDateTime
      )}&patientId=${encodeURIComponent(patientId)}`
    );
  };

  const handleGoBack = () => {
    router.push(
      `/personalMenu?patientId=${encodeURIComponent(patientId)}`
    );
  };

  useCustomQuery(() => {
    async function fetchData() {
      try {
        const [lessonsData, patientNameData] = await Promise.all([
          axios.get("/api/lessonsSummaries/summariesPatientLessons", {
            params: { patient_id: patientId },
          }),
          getPatientName(),
        ]);

        setLessons(lessonsData.data);
        setName(patientNameData.name);

        // Extract unique guide names and lesson types from the lessons array
        const uniqueGuides = [
          ...new Set(lessonsData.data.map((lesson) => lesson.guide_name)),
        ];
        const uniqueLessonTypes = [
          ...new Set(lessonsData.data.map((lesson) => lesson.lesson_type)),
        ];

        // Set the extracted values to the state
        setGuides(uniqueGuides);
        setLessonTypes(uniqueLessonTypes);
        if (lessonsData.data.length > 0) {
          let maxLetters = 0;
          for (let i = 0; i < lessonsData.data.length; i++) {
            if (lessonsData.data[i].guide_name.length > maxLetters) {
              maxLetters = lessonsData.data[i].guide_name.length;
            }
          }
          setMaxLettersGuideName(maxLetters);
        }
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
      }
    }

    async function checkPermission() {
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

          if (!isOk) {
            router.back(); // Use await to wait for the navigation to complete
          }
        }
      } catch (error) {
        console.error("Error checking permission:", error);
      }
    }

    checkPermission();
    fetchData();
  }, []); // Empty dependency array to run the effect only once on mount

  const handleRowClick = (lessonId) => {
    router.push(
      `/lessonSummary/specificSummaryWatch?lessonId=${encodeURIComponent(
        lessonId
      )}`
    );
  };

  const formatDate = (date) => {
    if (!date) {
      return ""; // Handle the case when date is undefined or null
    }

    if (isSmallScreen) {
      // Display date in "dd/mm" format for small screens
      const [day, month] = date.split("-");
      return `${day}-${month}`;
    } else {
      // Keep the original date format for larger screens
      return date;
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: value,
    }));
  };

  const formatDateFilter = (date) => {
    // Display date in "YYYY-MM-DD" format for consistency
    const [day, month, year] = date.split("-");
    return `${year}-${month}-${day}`;
  };

  const isDateMatch = (lessonDate, lessonTime) => {
    if (
      !filters.startDate &&
      !filters.endDate &&
      !filters.startTime &&
      !filters.endTime
    ) {
      return true; // No date filter applied, consider it a match
    }

    const formatLessonDate = formatDateFilter(lessonDate);
    if (filters.startDate && filters.endDate) {
      if (!filters.startTime && !filters.endTime) {
        return (
          formatLessonDate >= filters.startDate &&
          formatLessonDate <= filters.endDate
        );
      } else if (filters.startTime && filters.endTime) {
        if (
          formatLessonDate == filters.startDate &&
          formatLessonDate == filters.endDate
        ) {
          if (
            lessonTime >= filters.startTime &&
            lessonTime <= filters.endTime
          ) {
            return true;
          }
        } else if (
          (formatLessonDate == filters.startDate &&
            lessonTime >= filters.startTime) ||
          (formatLessonDate == filters.endDate && lessonTime <= filters.endTime)
        ) {
          return true;
        }
        return (
          formatLessonDate > filters.startDate &&
          formatLessonDate < filters.endDate
        );
      } else if (filters.startTime) {
        if (formatLessonDate == filters.startDate) {
          if (lessonTime >= filters.startTime) {
            return true;
          }
        } else {
          return (
            formatLessonDate > filters.startDate &&
            formatLessonDate <= filters.endDate
          );
        }
      } else if (filters.endTime) {
        if (formatLessonDate == filters.endDate) {
          if (lessonTime <= filters.endTime) {
            return true;
          }
        } else {
          return (
            formatLessonDate > filters.startDate &&
            formatLessonDate <= filters.endDate
          );
        }
      }
    } else if (filters.startDate) {
      if (formatLessonDate == filters.startDate && filters.startTime) {
        return (
          formatLessonDate >= filters.startDate &&
          lessonTime >= filters.startTime
        );
      } else {
        return formatLessonDate >= filters.startDate;
      }
    } else if (filters.endDate) {
      if (formatLessonDate == filters.endDate && filters.endTime) {
        return (
          formatLessonDate <= filters.endDate && lessonTime <= filters.endTime
        );
      } else {
        return formatLessonDate <= filters.endDate;
      }
    }

    return false; // Should not reach here
  };

  const filteredLessons = lessons.filter((lesson) => {
    const isGuideMatch =
      filters.selectedGuides.length === 0 ||
      filters.selectedGuides.includes(lesson.guide_name);

    const isLessonTypeMatch =
      filters.selectedLessonTypes.length === 0 ||
      filters.selectedLessonTypes.includes(lesson.lesson_type);

    const isDateMatchFilter = isDateMatch(
      lesson.formatted_date,
      lesson.formatted_time
    );

    return isGuideMatch && isLessonTypeMatch && isDateMatchFilter;
  });

  const selectStyle = {
    textAlign: "right",
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}

      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>
      <PicAndHeadlines
        pictureName="lessonSummary"
        picturePath="../lessonSummary.png"
        primaryHeadline="סיכומי שיעורים"
        secondaryHeadline={name ? name : "No Name Data"}
      />

      {/* Filter Button */}
      <div className={style.rightStyle}>
        <div className="container">
          <b>סננים: </b>
          {Object.values(filters).some((value) => value) && (
            <Button
              color="secondary"
              onClick={() =>
                setFilters({
                  selectedGuides: [],
                  selectedLessonTypes: [],
                  startDate: null,
                  endDate: null,
                  startTime: null,
                  endTime: null,
                })
              }
            >
              איפוס סננים
            </Button>
          )}
          <Typography style={{ fontSize: "12px", marginRight: "6px" }}>
            ניתן לבחור כמה מדריכים / סוגי שיעורים, ניתן לסנן שעה רק לאחר בחירת
            תאריך
          </Typography>
        </div>
        {/* Filter Controls */}
        <FormControl className={style.filterInput}>
          <InputLabel> מדריך</InputLabel>
          <Select
            sx={{ width: isSmallScreen ? "150px" : "200px" }}
            style={selectStyle}
            label="מדריך"
            multiple
            value={filters.selectedGuides}
            onChange={(e) =>
              handleFilterChange("selectedGuides", e.target.value)
            }
            variant="outlined"
          >
            {/* Replace with the actual list of guide names */}
            {guides.map((guide) => (
              <MenuItem key={guide} value={guide}>
                {guide}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl className={style.filterInput}>
          <InputLabel>סוג שיעור</InputLabel>
          <Select
            sx={{ width: isSmallScreen ? "150px" : "200px" }}
            style={selectStyle}
            label="סוג שיעור"
            multiple
            value={filters.selectedLessonTypes}
            onChange={(e) =>
              handleFilterChange("selectedLessonTypes", e.target.value)
            }
            variant="outlined"
          >
            {/* Replace with the actual list of lesson types */}
            {lessonTypes.map((lessonType) => (
              <MenuItem key={lessonType} value={lessonType}>
                {lessonType}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <TextField
          sx={{ width: isSmallScreen ? "162px" : "210px" }}
          label="מתאריך"
          type="date"
          value={filters.startDate || ""}
          onChange={(e) => handleFilterChange("startDate", e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          sx={{ width: isSmallScreen ? "162px" : "210px" }}
          label="עד תאריך"
          type="date"
          value={filters.endDate || ""}
          onChange={(e) => handleFilterChange("endDate", e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
        <TextField
          sx={{ width: isSmallScreen ? "162px" : "120px" }}
          label="משעה"
          type="time"
          value={filters.startTime || ""}
          onChange={(e) => handleFilterChange("startTime", e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={!filters.startDate}
        />
        <TextField
          sx={{ width: isSmallScreen ? "162px" : "120px" }}
          label="עד שעה"
          type="time"
          value={filters.endTime || ""}
          onChange={(e) => handleFilterChange("endTime", e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          disabled={!filters.endDate}
        />
      </div>

      {type !== 1 && (
        <div className={style.addButtonStyle}>
          <Button onClick={handleAdd}>+ הוספת סיכום</Button>
        </div>
      )}

      {/* Display filtered lessons */}
      {!isLoading && (
        <>
          {filteredLessons.length > 0 ? (
            filteredLessons.map(
              (lesson) =>
                (type === 3 ||
                  type === 2 ||
                  (type === 1 && lesson.parent_permission)) && (
                  <div
                    key={lesson.lesson_id}
                    className={style.rowWrapper}
                    onClick={() => handleRowClick(lesson.lesson_id)}
                  >
                    <PatientRow
                      pictureName={lesson.type}
                      picturePath={`../${
                        lesson.patient_gender === "F" ? "girlPic" : "boyPic"
                      }.png`}
                      date={formatDate(lesson.formatted_date)}
                      time={lesson.formatted_time}
                      name={lesson.guide_name}
                      maxTextLengthName={
                        isSmallScreen ? 7 : maxLettersGuideName
                      }
                      nameWidth={isSmallScreen ? 77 : maxLettersGuideName * 9}
                      lesson={lesson.lesson_type}
                      {...(isSmallScreen && {
                        maxTextLengthLesson: 7,
                      })}
                    />
                  </div>
                )
            )
          ) : (
            <div style={{ textAlign: "center", marginTop: "20px" }}>
              אין סיכומי שיעורים
            </div>
          )}
          <Nevigation patientId={patientId} screen="summariesPatientLessons" />
        </>
      )}
    </>
  );
}
