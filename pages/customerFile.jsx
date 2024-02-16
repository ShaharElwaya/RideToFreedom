import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import { Button, InputAdornment, TextField } from "@mui/material";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import { PicAndText } from "@/components/UI/PicAndName";
import LoadingSpinner from "@/components/loadingSpinner";
import { setUserData, userStore } from "@/stores/userStore";
import style from "../styles/summariesPatientLessons.module.css";
import useMediaQuery from "@mui/material/useMediaQuery";

const RowAndColumnSpacing = () => {
  const [names, setNames] = useState([]);
  const [filteredNames, setFilteredNames] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { type, id } = userStore.getState();
  const isSmallScreen = useMediaQuery("(max-width: 600px)");

  const Item = styled(Paper)(() => ({
    padding: "20px 0",
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
    width: isSmallScreen ? "100%" : "600px",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchNamesFromDatabase(type, id);
        setNames(data);
        setFilteredNames(data); // Initialize filteredNames with all names
      } catch (error) {
        console.error("Error fetching names:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [type, id]);

  const fetchNamesFromDatabase = async (type, id) => {
    const response = await fetch(`/api/customers?type=${type}&id=${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch names");
    }
    const data = await response.json();
    return data;
  };

  const getPictureName = (gender) => {
    return gender === "F" ? "girlPic" : "boyPic";
  };

  const handleClick = (patientId, name, gender) => {
    router.push({
      pathname: "/personalMenu",
      query: { patientId, name, gender },
    });
  };

  const handleLogOut = () => {
    setUserData({
      id: 0,
      type: 0,
      email: "",
      is_logged_in: false,
    });

    router.push(`/login`);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
    filterNames(event.target.value);
  };

  const filterNames = (searchValue) => {
    const filtered = names.filter((nameData) =>
      nameData.name.toLowerCase().includes(searchValue.toLowerCase())
    );
    setFilteredNames(filtered);

  const handleSetMeeting = () => {
    router.push('/introductionMeeting');
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
          primaryHeadline={type === 1 ? "תיקי ילדים" : "תיקי לקוחות"}
        />
        <ContentContainer>
            {type === 1 && <Button onClick={handleSetMeeting}>קבע פגישת הכרות</Button>}
          </CenteredContainer>
          {/* Search Input */}
          <TextField
            label="חיפוש"
            variant="outlined"
            value={searchInput}
            onChange={handleSearchInputChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">🔍</InputAdornment>
              ),
            }}
            style={{ width: '100%' }}
            margin="normal"
          />
          <Grid container spacing={2}>
            {filteredNames.map((nameData) => (
              <Grid item xs={6} key={nameData.id}>
                <Item
                  onClick={() =>
                    handleClick(nameData.id, nameData.name, nameData.gender)
                  }
                >
                  <PicAndText
                    pictureName={getPictureName(nameData.gender)}
                    name={nameData.name}
                    containerWidth={window.innerWidth / 3}
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
