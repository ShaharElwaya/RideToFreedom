import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/summariesPatientLessons.module.css";
import LoadingSpinner from "@/components/loadingSpinner";
import { useRouter } from "next/router";
import { userStore } from "@/stores/userStore";
import useCustomQuery from "@/utils/useCustomQuery";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function SummariesPatientLessons() {
  const router = useRouter();
  const [lessons, setLessons] = useState([]);
  const [addTime, setAddTime] = useState("");
  const [name, setName] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const { patientId } = router.query;
  const { type } = userStore.getState();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [maxLettersGuideName, setMaxLettersGuideName] = useState(0);

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
      `/personalMenu?patientId=${encodeURIComponent(
        patientId
      )}&name=${encodeURIComponent(name)}`
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
      return ''; // Handle the case when date is undefined or null
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
      {type !== 1 && (
        <div className={style.addButtonStyle}>
          <Button onClick={handleAdd}>+ הוספת סיכום</Button>
        </div>
      )}
      {lessons.map(
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
                maxTextLengthName={isSmallScreen ? 7 : maxLettersGuideName}
                nameWidth={isSmallScreen ? 77 : (maxLettersGuideName * 9)}
                lesson={lesson.lesson_type}
                {...(isSmallScreen && {
                  maxTextLengthLesson: 7,
                })}
              />
            </div>
          )
      )}
    </>
  );
}
