import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import LayersIcon from "@mui/icons-material/Layers";
import PersonIcon from "@mui/icons-material/Person";
import HouseIcon from "@mui/icons-material/House";
import CrisisAlertIcon from "@mui/icons-material/CrisisAlert";
import MenuIcon from "@mui/icons-material/Menu";
import FolderSpecial from "@mui/icons-material/FolderSpecial";
import Insights from "@mui/icons-material/Insights";
import SummarizeIcon from "@mui/icons-material/Summarize";
import { useRouter } from "next/router";
import { userStore } from "@/stores/userStore";
import axios from "axios";

export default function Navigation({ patientId, screen }) {
  const router = useRouter();
  const [hasSpecialTreatmentPlans, setHasSpecialTreatmentPlans] = useState(false);
  const [hasGuideSuggestions, setHasGuideSuggestions] = useState(false);
  const [suggestionId, setSuggestionId] = useState(null);
  const { type } = userStore.getState();

  const actions = [
    {
      icon: <Insights />,
      name: "הצעה לתוכנית טיפול",
      link: "../specialProgramSuggestion/specialProgramSuggestionView",
      screen: "specialProgramSuggestionView",
    },
    {
      icon: <FolderSpecial />,
      name: "תוכנית טיפול",
      link: "../specialProgramWatch",
      screen: "specialProgramWatch",
    },
    {
      icon: <CrisisAlertIcon />,
      name: "מטרות",
      link: "../goals/goals",
      screen: "goals",
    },
    {
      icon: <HouseIcon />,
      name: "דיווחים מהבית",
      link: "../homeEvents/homeEvents",
      screen: "homeEvents",
    },
    {
      icon: <SummarizeIcon />,
      name: "סיכומי שיעורים",
      link: "../lessonSummary/summariesPatientLessons",
      screen: "summariesPatientLessons",
    },
    {
      icon: <PersonIcon />,
      name: "פרטי אישיים והכרות",
      link: "../introMeetingView",
      screen: "introMeetingView",
    },
    {
      icon: <MenuIcon />,
      name: "דף מטופל ראשי",
      link: "../personalMenu",
      screen: "personalMenu",
    },
  ];

  useEffect(() =>  {
    const fetchData = async () => {
      try {
        // Check if user has special treatment plans
        const specialTreatmentPlans = await axios.get("/api/specialProgram", {
          params: { patient_id: router.query.patientId },
        });

        if (specialTreatmentPlans.data.length !== 0) {
          setHasSpecialTreatmentPlans(true);
        }
        // Check if user has guide suggestions for patient
        const guideSuggestion = await axios.get(
          `/api/suggestions/getByPatientId?patientId=${patientId}`
        );
       
        if(guideSuggestion.data.length !== 0) {
          setHasGuideSuggestions(true);
          setSuggestionId(guideSuggestion.data.id);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [patientId, router.query.patientId]); // Include dependencies in the dependency array

  const handleActionClick = (link, screen) => {
    if(screen == "specialProgramSuggestionView") {
      const urlWithPatientId = `${link}?suggestionId=${suggestionId}`;
      router.push(urlWithPatientId);
    }
    else {
      const urlWithPatientId = `${link}?patientId=${patientId}`;
      router.push(urlWithPatientId);
    }
  };

  const checkScreen = (nevigationScreen) => {
    if(nevigationScreen !== "specialProgramSuggestionView" && nevigationScreen !== "specialProgramWatch" && nevigationScreen !== screen) {
        return true;
    }
    else if(nevigationScreen == "specialProgramSuggestionView" && !hasSpecialTreatmentPlans && hasGuideSuggestions && type != 1 && nevigationScreen !== screen) {
      return true;
    }
    else if(nevigationScreen == "specialProgramWatch" && hasSpecialTreatmentPlans && nevigationScreen !== screen) {
      return true;
    }
    return false;
  }
  
  return (
    <Box
      sx={{
        position: "fixed",
        bottom: "4%", 
        right: "2%", 
        zIndex: 1000,
      }}
    >
      <SpeedDial ariaLabel="SpeedDial basic example" icon={<LayersIcon />}>
        {actions.map(
          (action) =>
          (checkScreen(action.screen)) && (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={() => handleActionClick(action.link, action.screen)}
              />
            )
        )}
      </SpeedDial>
    </Box>
  );
}
