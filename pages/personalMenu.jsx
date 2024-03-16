// personalMenu.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { styled } from "@mui/system";
import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import { PicAndText } from "@/components/UI/PicAndName";
import style from "../styles/generalStyle.module.css";
import Link from "next/link";
import LoadingSpinner from "@/components/loadingSpinner";
import { userStore, setUserData } from "@/stores/userStore";
import useCustomQuery from "@/utils/useCustomQuery";
import Nevigation from "@/components/nevigation";

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
  padding: "20px 0",
  textAlign: "center",
  width: "200px",
}));

const PersonalMenu = () => {
  const router = useRouter();
  const { query } = router;
  const { patientId } = query;
  const [gender, setGender] = useState();
  const [name, setName] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isOneChild, setIsOneChild] = useState(false);
  const [addTime, setAddTime] = useState("");
  const [hasSpecialTreatmentPlans, setHasSpecialTreatmentPlans] =
    useState(false);
  const [hasGuideSuggestions, setHasGuideSuggestions] = useState(false);
  const [guideSuggestions, setGuideSuggestions] = useState(false);
  const { id, type } = userStore.getState();

  useCustomQuery(() => {
    async function checkPremission() {
      try {
        if (type === 1) {
          const response = await axios.get(`/api/login/childrens?id=${id}`);
          let isOk = false;

          for (let i = 0; i < response.data.length && !isOk; i++) {
            if (response.data[i].id == patientId) {
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
          setGender(data.gender);
          setName(data.name);

          // Check if user has special treatment plans
          const specialTreatmentPlans = await axios.get("/api/specialProgram", {
            params: { patient_id: patientId },
          });

          if (specialTreatmentPlans.data.length != 0) {
            setHasSpecialTreatmentPlans(true);
          }

          // Check if user has guide suggestions for patient
          const guideSuggestion = await axios.get(
            `/api/suggestions/getByPatientId?patientId=${patientId}`
          );

          if (guideSuggestion.data.length != 0) {
            setHasGuideSuggestions(true);
            setGuideSuggestions(guideSuggestion.data);
          }

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

  const handleNavigateToSpecialProgramSuggestionView = async () => {
    try {
      router.push({
        pathname: "specialProgramSuggestion/specialProgramSuggestionView",
        query: {
          suggestionId: guideSuggestions.id,
        },
      });
    } catch (error) {
      console.error("Error fetching guide suggestions:", error);
    }
  };

  const handleNavigateToSpecialProgramSuggestion = async () => {
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
      timeZone: "UTC",
      timeZone: "Asia/Jerusalem", 
    });

    const formattedDateTime = `${currentDate} ${currentTime}`;
    setAddTime(formattedDateTime);

    router.push(
      `/specialProgramSuggestion/specialProgramSuggestion?time=${encodeURIComponent(
        formattedDateTime
      )}&patientId=${encodeURIComponent(patientId)}`
    );
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
              <Link href={`/introMeetingView?patientId=${query.patientId}`}>
                <MenuItem>
                  <CustomButton>פרטים כללים והיכרות</CustomButton>
                </MenuItem>
              </Link>
              <Link
                href={`/lessonSummary/generalStyle?patientId=${query.patientId}`}
              >
                <MenuItem>
                  <CustomButton>סיכומי שיעורים</CustomButton>
                </MenuItem>
              </Link>
              <Link
                href={`/homeEvents/homeEvents?patientId=${query.patientId}`}
              >
                <MenuItem>
                  <CustomButton>דיווחים מהבית</CustomButton>
                </MenuItem>
              </Link>
              <Link href={`/goals/goals?patientId=${query.patientId}`}>
                <MenuItem>
                  <CustomButton>מטרות</CustomButton>
                </MenuItem>
              </Link>
              {type !== 1 && !hasSpecialTreatmentPlans && (
                <>
                  {hasGuideSuggestions ? (
                    <MenuItem>
                      <CustomButton
                        onClick={handleNavigateToSpecialProgramSuggestionView}
                      >
                        צפיה בהצעה לתכנית טיפול מיוחדת
                      </CustomButton>
                    </MenuItem>
                  ) : (
                    <MenuItem>
                      <CustomButton
                        onClick={handleNavigateToSpecialProgramSuggestion}
                      >
                        יצירת הצעה לתכנית טיפול מיוחדת
                      </CustomButton>
                    </MenuItem>
                  )}
                </>
              )}

              {hasSpecialTreatmentPlans ? (
                <Link
                  href={`/specialProgramWatch?patientId=${query.patientId}`}
                >
                  <MenuItem>
                    <CustomButton>צפייה בתכנית טיפול מיוחדת</CustomButton>
                  </MenuItem>
                </Link>
              ) : (
                type == 3 && (
                  <Link
                    href={`/specialProgram?patientId=${query.patientId}&&patientName=${name}&&suggestionId=${guideSuggestions.id}`}
                  >
                    <MenuItem>
                      <CustomButton>יצירת תכנית טיפול מיוחדת</CustomButton>
                    </MenuItem>
                  </Link>
                )
              )}
            </div>
            {type === 1 && isOneChild && (
              <MenuItem>
                <CustomButton onClick={handleSetMeeting}>
                  {" "}
                  פגישת היכרות לילד נוסף
                </CustomButton>
              </MenuItem>
            )}
          </CenteredContainer>
          <Nevigation patientId={patientId} screen="personalMenu" />
        </>
      )}
    </>
  );
};

export default PersonalMenu;
