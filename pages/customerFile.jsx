import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Import useRouter hook for navigation
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Button } from "@mui/material";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import { Diversity1TwoTone } from "@mui/icons-material";
import { PicAndText } from "@/components/UI/PicAndName";
import LoadingSpinner from "@/components/loadingSpinner";
import { setUserData, userStore } from "@/stores/userStore";
import style from "../styles/summariesPatientLessons.module.css";

const Item = styled(Paper)(() => ({
  padding: "20px",
  textAlign: "center",
  cursor: "pointer",
}));

const CenteredContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
});

const ContentContainer = styled(Box)({
  marginTop: "20px",
  width: "90%",
});

const RowAndColumnSpacing = () => {
  const [names, setNames] = useState([]);
  const router = useRouter(); // Initialize useRouter hook
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch names from the backend API
        const data = await fetchNamesFromDatabase();
        setNames(data);
      } catch (error) {
        console.error("Error fetching names:", error);
      } finally {
        setIsLoading(false); // Set loading to false after the data is fetched or on error
      }
    };

    // Call the fetchData function
    fetchData();
  }, []);

  // Function to fetch names from the backend API
  const fetchNamesFromDatabase = async () => {
    // Make an API call to fetch names
    const response = await fetch("/api/customers"); // Replace '/api/names' with your actual API endpoint
    if (!response.ok) {
      throw new Error("Failed to fetch names");
    }
    const data = await response.json();
    return data;
  };

  // Function to determine the picture name based on gender
  const getPictureName = (gender) => {
    return gender === "F" ? "girlPic" : "boyPic";
  };

  // Function to handle click on a box
  const handleClick = (id, name, gender) => {
    // Redirect to personalMenu page and pass the ID, name, and gender as query parameters
    router.push({
      pathname: "/personalMenu",
      query: { id, name, gender },
    });
  };

  const handleLogOut = () => {
    setUserData({
      name: "",
      id: 0,
      type: 0,
      email: "",
      is_logged_in: false,
    });

    router.push(`/login`);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <div className={style.leftStyle}>
        <Button onClick={handleLogOut}> התנתק </Button>
      </div>

      <CenteredContainer>
        <PicAndHeadlines
          pictureName="customerFile"
          picturePath="../customerFile.png"
          primaryHeadline="תיקי לקוחות"
        />
        <ContentContainer>
          <Grid container spacing={2}>
            {names.map((nameData) => (
              <Grid item xs={6} key={nameData.id}>
                <Item
                  onClick={() =>
                    handleClick(nameData.id, nameData.name, nameData.gender)
                  }
                >
                  <PicAndText
                    pictureName={getPictureName(nameData.gender)}
                    name={nameData.name}
                  />
                </Item>
              </Grid>
            ))}
          </Grid>
        </ContentContainer>
      </CenteredContainer>
    </>
  );
};

export default RowAndColumnSpacing;
