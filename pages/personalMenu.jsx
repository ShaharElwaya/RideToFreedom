import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import { PicAndText } from '@/components/UI/PicAndName';
import style from '../styles/summariesPatientLessons.module.css';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

const CustomButton = styled(Button)({
  '&:hover': {
    backgroundColor: 'transparent',
  },
});

const CenteredContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'relative',
  minHeight: '100vh',
});

const MenuItem = styled('div')({
  padding: '20px',
  width: '200px',
  backgroundColor: '#fffafa',
  borderRadius: '10px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  margin: '0px',
  transition: 'background-color 0.3s ease',
  '&:hover': {
    backgroundColor: '#edebeb',
  },
});

const Item = styled(Paper)(() => ({
  padding: '20px',
  textAlign: 'center',
  width: '200px',
}));

const PersonalMenu = () => {
  const router = useRouter();
  const { query } = router;
  const { id, name } = query;
  const [gender, setGender] = useState();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getPatientGender() {
      try {
        if (id) {
          const response = await fetch(`/api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(id)}`);
          const data = await response.json();
          setGender(data.gender);
          setIsLoading(false); // Set loading to false when data is fetched (success or error)
        }
      } catch (error) {
        console.error('Error fetching patient name:', error);
        setIsLoading(false); // Set loading to false on error
      }
    }

    getPatientGender();
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && (
        <>
          <div className={style.leftStyle}>
            <Button onClick={handleGoBack}> חזור &gt;</Button>
          </div>
          <CenteredContainer>
            <Item>
              <PicAndText
                pictureName={gender === 'F' ? 'girlPic' : 'boyPic'}
                name={`${name}`}
              />
            </Item>
            <div>
              <Link href="/somePath3">
                <MenuItem>
                  <CustomButton>צפייה בפרטים אישיים</CustomButton>
                </MenuItem>
              </Link>
              <Link href={`/lessonSummary/summariesPatientLessons?patientId=${query.id}`}>
                <MenuItem>
                  <CustomButton>צפייה בסיכומי שיעור</CustomButton>
                </MenuItem>
              </Link>
              <Link href={`/homeEvents/homeEvents?patientId=${query.id}`}>
                <MenuItem>
                  <CustomButton>צפייה בדיווחים מהבית</CustomButton>
                </MenuItem>
              </Link>
              <Link href={`/goals/goals?patientId=${query.id}`}>
                <MenuItem>
                  <CustomButton>צפייה במטרות</CustomButton>
                </MenuItem>
              </Link>
              <Link href="/somePath1">
                <MenuItem>
                  <CustomButton>צפייה בתכניות טיפול</CustomButton>
                </MenuItem>
              </Link>
            </div>
          </CenteredContainer>
        </>
      )}
    </>
  );
};

export default PersonalMenu;