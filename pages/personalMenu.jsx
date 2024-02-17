import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useRouter } from 'next/router';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import { PicAndText } from '@/components/UI/PicAndName';
import style from '../styles/summariesPatientLessons.module.css';
import Link from 'next/link';
import LoadingSpinner from '@/components/loadingSpinner';
import { userStore , setUserData} from '@/stores/userStore';
import useCustomQuery from "@/utils/useCustomQuery";

const CustomButton = styled(Button)({
  "&:hover": {
    backgroundColor: "transparent",
  },
});

const CenteredContainer = styled("div")({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  position: "relative",
  minHeight: "100vh",
});

const MenuItem = styled("div")({
  padding: "20px",
  width: "200px",
  backgroundColor: "#fffafa",
  borderRadius: "10px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  margin: "0px",
  transition: "background-color 0.3s ease",
  "&:hover": {
    backgroundColor: "#edebeb",
  },
});

const Item = styled(Paper)(() => ({
  padding: '20px 0',
  textAlign: 'center',
  width: '200px',
}));

const PersonalMenu = () => {
  const router = useRouter();
  const { query } = router;
  const { patientId, name } = query;
  const [gender, setGender] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isOneChild, setIsOneChild] = useState(false);
  const [hasSpecialTreatmentPlans, setHasSpecialTreatmentPlans] =
    useState(false);
  const [hasGuideSuggestions, setHasGuideSuggestions] = useState(false);
  const { id, type } = userStore.getState();

  useCustomQuery(() => {
    async function checkPremission() {
      try {
        if (type === 1) {
          const response = await axios.get(`/api/login/childrens?id=${id}`);
          let isOk = false;
          
          for(let i = 0; i < response.data.length && !isOk; i++) {
            if(response.data[i].id == patientId){
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

    async function getPatientGender() {
      try {
        if (patientId) {
          const response = await fetch(
            `/api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(
              patientId
            )}`
          );
          const data = await response.json();

          // Check if user has special treatment plans
          const specialTreatmentPlans = await axios.get("/api/specialProgram");
          const hasTreatmentPlans = specialTreatmentPlans.data.some(
            (plan) => plan.patient_id == patientId
          );
          setHasSpecialTreatmentPlans(hasTreatmentPlans);

          // Check if user has guide suggestions for patient
          const guideSuggestion = await axios.get(
            `/api/suggestions/getByPatientId?patientId=${patientId}`
          );

          console.log("🚀 ~ guideSuggestion:", guideSuggestion);
          console.log("🚀 ~ guideSuggestion data:", guideSuggestion.data);
          const hasGuideSuggestions =
            guideSuggestion.data.patient_id == patientId;
          console.log("🚀 ~ hasGuideSuggestions:", hasGuideSuggestions);
          setHasGuideSuggestions(hasGuideSuggestions);

          setGender(data.gender);
          setIsLoading(false); // Set loading to false when data is fetched (success or error)
        }

        if (type == 1) {
          const isOneChildResponse = await fetch(`/api/login/parent?id=${id}`);
          const isOneChildData = await isOneChildResponse.json();
          setIsOneChild(isOneChildData.hasOneChild);
        }
      } catch (error) {
        console.error("Error fetching patient name:", error);
        setIsLoading(false); // Set loading to false on error
      }
    }

    checkPremission();
    getPatientGender();
  }, [patientId]);

  const handleGoBack = () => {
    router.push(`/customerFile`);
  };

  const handleLogOut = () => {
    setUserData({
      patientId: 0,
      type: 0,
      email: "",
      is_logged_in: false,
    });

    router.push(`/login`);
  };

  const handleSetMeeting = () => {
    router.push("/introductionMeeting");
  };

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

  const handleNavigateToSpecialProgramSuggestionView = async () => {
    try {
      const guideSuggestion = await axios.get(
        `/api/suggestions/getByPatientId?patientId=${patientId}`
      );
      const patientInfo = await axios.get("/api/patient/getPatient", {
        params: { patient_id: patientId },
      });
      const { data: guideName } = await axios.get(
        "/api/lessonsSummaries/guideIdToName",
        { params: { id: guideSuggestion.data.guide_id } }
      );
      
      router.push({
        pathname: "specialProgramSuggestion/specialProgramSuggestionView",
        query: {
          suggestionId: guideSuggestion.data.id,
          patientName: patientInfo.data[0].name,
          date: guideSuggestion.data.date,
          guideName: guideName.name,
        },
      });
    } catch (error) {
      console.error("Error fetching guide suggestions:", error);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <>
          <div className={style.leftStyle}>
            {isOneChild ? (
              <Button onClick={handleLogOut}> התנתק </Button>
            ) : (
              <Button onClick={handleGoBack}> חזור &gt;</Button>
            )}
          </div>
          <CenteredContainer>
            <Item>
              <PicAndText
                pictureName={gender === "F" ? "girlPic" : "boyPic"}
                name={`${name}`}
                containerWidth={175}
              />
            </Item>
            <div>
              <Link
                href={`/introMeetingView?patientId=${query.patientId}&userType=${type}`}
              >
                <MenuItem>
                  <CustomButton>צפייה בפרטים אישיים</CustomButton>
                </MenuItem>
              </Link>
              <Link
                href={`/lessonSummary/summariesPatientLessons?patientId=${query.patientId}`}
              >
                <MenuItem>
                  <CustomButton>צפייה בסיכומי שיעור</CustomButton>
                </MenuItem>
              </Link>
              <Link
                href={`/homeEvents/homeEvents?patientId=${query.patientId}`}
              >
                <MenuItem>
                  <CustomButton>צפייה בדיווחים מהבית</CustomButton>
                </MenuItem>
              </Link>
              <Link href={`/goals/goals?patientId=${query.patientId}`}>
                <MenuItem>
                  <CustomButton>צפייה במטרות</CustomButton>
                </MenuItem>
              </Link>
              {hasGuideSuggestions && (
                <MenuItem>
                  <CustomButton
                    onClick={handleNavigateToSpecialProgramSuggestionView}
                  >
                    צפייה בהצעות לתכניות טיפול מיוחדות
                  </CustomButton>
                </MenuItem>
              )}

              {hasSpecialTreatmentPlans && (
                <Link href={`/specialProgramView?patientId=${query.patientId}`}>
                  <MenuItem>
                    <CustomButton>צפייה בתכניות טיפול מיוחדות</CustomButton>
                  </MenuItem>
                </Link>
              )}
            </div>
            {type === 1 && (
              <Button onClick={handleSetMeeting}>
                קבע פגישת היכרות למטופל נוסף
              </Button>
            )}
          </CenteredContainer>
        </>
      )}
    </>
  );
};

export default PersonalMenu;
