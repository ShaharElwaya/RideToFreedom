import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import SuggestionRow from "@/components/UI/specialProgramSuggestionRow";
import style from "../../styles/summariesPatientLessons.module.css";
import { Button, CircularProgress } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import LoadingSpinner from "@/components/loadingSpinner";
import useCustomQuery from "@/utils/useCustomQuery";
import { userStore } from '@/stores/userStore';

export default function specialProgramSuggestionAll() {
  const [data, setData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);
  const router = useRouter();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const { type, id } = userStore.getState(); 

  useCustomQuery(() => { 
    if (type == 1) {
      router.back();
    }

    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/suggestions");
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  const content = () => {
    return suggestions.map((suggestion) => (
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
      {isLoading && <LoadingSpinner />}
      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>
      <PicAndHeadlines
        pictureName="specialProgramSuggestion"
        picturePath="../specialProgramSuggestion.png"
        primaryHeadline="הצעות תכניות טיפול מיוחדות"
        secondaryHeadline="כל ההצעות"
      />
      {suggestions.length > 0 ? (
        <table>
          <tr className={style.trStyle}>
            {!isSmallScreen && <th>פרופיל</th>}
            <th>תאריך </th>
            <th>שם</th>
            <th>מדריך</th>
            <th>סטטוס</th>
            <th>נדרש</th>
          </tr>
          {content()}
        </table>
      ) : (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          אין הצעות לתוכניות טיפול
        </div>
      )}
    </>
  );
}
