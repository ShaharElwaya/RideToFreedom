// pages/PersonalMenu.js
import React from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/system';
import PicAndHeadlines from '@/components/UI/picAndheadline';
import Link from 'next/link';

const CenteredContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
});

const ContentContainer = styled('div')({
  marginTop: '20px',
});

const MenuItem = styled('div')({
  marginBottom: '20px',
  padding: '20px',
  backgroundColor: '#f0f0f0',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#e0e0e0',
  },
});

const Button = styled('button')({
  padding: '10px',
  fontSize: '16px',
  backgroundColor: '#3f51b5',
  color: '#fff',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
});

const PersonalMenu = () => {
  const router = useRouter();
  const { query } = router;
  const { name, gender } = query; // Extracting name and gender from the URL parameters

  return (
    <CenteredContainer>
      <PicAndHeadlines
        pictureName={gender === 'F' ? 'girlPic' : 'boyPic'} // Determine picture based on gender
        picturePath={`../${gender === 'F' ? 'girlPic' : 'boyPic'}.png`} // Adjust picture path accordingly
        secondaryHeadline={`${name}`} // Display the user's name
      />
      <ContentContainer>
        <Link href="/somePath1">
          <MenuItem>
            <Button>צפייה בתכניות טיפול</Button>
          </MenuItem>
        </Link>
        <Link href={`/lessonSummary/summariesPatientLessons?patientId=${query.id}`}>
          <MenuItem>
            <Button>צפייה בסיכומי שיעור</Button>
          </MenuItem>
        </Link>
        <Link href="/somePath3">
          <MenuItem>
            <Button>צפייה בפרטים אישיים</Button>
          </MenuItem>
        </Link>
      </ContentContainer>
    </CenteredContainer>
  );
};

export default PersonalMenu;
