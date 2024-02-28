import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import SuggestionRow from "@/components/UI/specialProgramSuggestionRow";
import style from "../../styles/summariesPatientLessons.module.css";
import { Button } from "@mui/material";

export default function specialProgramSuggestionAll() {
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/suggestions");
        setIsLoading(false);
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data.length === 0) return;

    const fetchNames = async () => {
      try {
        const suggestions = await Promise.all(
          data.map(async (item) => {
            const patientName = await getPatientName(item.patient_id);
            const guideName = await getGuideName(item.guide_id);
            return { ...item, patientName, guideName };
          })
        );
        setSuggestions(suggestions);
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    };

    fetchNames();
  }, [data]);

  async function getPatientName(patientId) {
    try {
      const response = await fetch(
        `/api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(
          patientId
        )}`
      );
      const data = await response.json();
      return data.name;
    } catch (error) {
      console.error("Error fetching patient name:", error);
      return "";
    }
  }

  async function getGuideName(guideId) {
    try {
      const response = await axios.get("/api/lessonsSummaries/guideIdToName", {
        params: { id: guideId },
      });
      return response.data.name;
    } catch (error) {
      console.error("Error fetching guide name:", error);
      return "";
    }
  }

  const content = () => {
    if (isLoading) return <div>טוען נתונים...</div>;
    
    const filteredSuggestions = suggestions.filter(
      suggestion => suggestion.status !== "הסתיים"
    );

    if (filteredSuggestions.length === 0) return <div>לא נמצאו המלצות...</div>;

    return filteredSuggestions.map((suggestion) => (
      <tr key={suggestion.id}>
        <SuggestionRow
          suggestion={suggestion}
          setSuggestions={setSuggestions}
          suggestions={suggestions}
        />
      </tr>
    ));
  };

  const handleGoBack = () => {
    router.push(`/customerFile`);
  };

  return (
    <>
      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>
      <PicAndHeadlines
        pictureName="specialProgramSuggestion"
        picturePath="../specialProgramSuggestion.png"
        primaryHeadline="הצעות תכניות טיפול מיוחדות"
        secondaryHeadline="כל ההצעות"
      />
      <table>
        <tr>
          <th>תמונת פרופיל</th>
          <th>תאריך</th>
          <th>שם</th>
          <th>שם מדריך</th>
          <th>סטטוס</th>
          <th>פעולות</th>
        </tr>
      {content()}
      </table>
    </>
  );
}
