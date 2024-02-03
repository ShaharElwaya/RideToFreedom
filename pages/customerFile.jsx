import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router'; // Import useRouter hook for navigation
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import PicAndHeadlines from '@/components/UI/picAndheadline';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  cursor: 'pointer', // Add cursor pointer for indicating clickability
}));

const CenteredContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh', // Set height to 100% of the viewport height
});

const ContentContainer = styled(Box)({
  marginTop: '20px', // Adjust the spacing between the picture and the boxes
});

const RowAndColumnSpacing = () => {
  const [names, setNames] = useState([]);
  const router = useRouter(); // Initialize useRouter hook

  useEffect(() => {
    // Fetch names from the backend API
    fetchNamesFromDatabase()
      .then((data) => setNames(data))
      .catch((error) => console.error('Error fetching names:', error));
  }, []);

  // Function to fetch names from the backend API
  const fetchNamesFromDatabase = async () => {
    // Make an API call to fetch names
    const response = await fetch('/api/customers'); // Replace '/api/names' with your actual API endpoint
    if (!response.ok) {
      throw new Error('Failed to fetch names');
    }
    const data = await response.json();
    return data;
  };

  // Function to determine the picture name based on gender
  const getPictureName = (gender) => {
  return gender === 'F' ? 'girlPic' : 'boyPic';
  };


  // Function to handle click on a box
  const handleClick = (id, name, gender) => {
    // Redirect to personalMenu page and pass the ID, name, and gender as query parameters
    router.push({
      pathname: '/personalMenu',
      query: { id, name, gender },
    });
  };

  return (
    <CenteredContainer>
      <PicAndHeadlines
        pictureName="customerFile"
        picturePath="../customerFile.png"
        isMain
        primaryHeadline="תיקי לקוחות"
      />
      <ContentContainer>
        <Grid container spacing={2} justifyContent="center">
          {names.map((nameData) => (
            <Grid item xs={6} key={nameData.id}>
              <Item onClick={() => handleClick(nameData.id, nameData.name, nameData.gender)}>
                <PicAndText pictureName={getPictureName(nameData.gender)} name={nameData.name} />
              </Item>
            </Grid>
          ))}
        </Grid>
      </ContentContainer>
    </CenteredContainer>
  );
};

// Component for displaying picture and text in a box
const PicAndText = ({ pictureName, name }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <img src={`../${pictureName}.png`} alt={pictureName} style={{ width: '80px', height: '80px' }} />
    <div>{name}</div>
  </div>
);

export default RowAndColumnSpacing;
