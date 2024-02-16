import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import Paper from '@mui/material/Paper';
import { PicAndText } from '@/components/UI/PicAndName';
import style from '../styles/summariesPatientLessons.module.css';
import Link from 'next/link';
import LoadingSpinner from '@/components/loadingSpinner';
import { userStore , setUserData} from '@/stores/userStore';

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
  const { id, type } = userStore.getState();

  useEffect(() => {
    async function getPatientGender() {
      try {
        if (patientId) {
          const response = await fetch(`/api/lessonsSummaries/patientIdToName?patient_id=${encodeURIComponent(patientId)}`);
          const data = await response.json();
          setGender(data.gender);
          setIsLoading(false); // Set loading to false when data is fetched (success or error)
        }

        if (type == 1 ) {
          const isOneChildResponse = await fetch(`/api/login/parent?id=${id}`);
          const isOneChildData = await isOneChildResponse.json();
          setIsOneChild(isOneChildData.hasOneChild);
        }
      } catch (error) {
        console.error('Error fetching patient name:', error);
        setIsLoading(false); // Set loading to false on error
      }
    }

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
                pictureName={gender === 'F' ? 'girlPic' : 'boyPic'}
                name={`${name}`}
                containerWidth={175}
              />
            </Item>
            <div>
              <Link href="/somePath3">
                <MenuItem>
                  <CustomButton>צפייה בפרטים אישיים</CustomButton>
                </MenuItem>
              </Link>
              <Link href={`/lessonSummary/summariesPatientLessons?patientId=${query.patientId}`}>
                <MenuItem>
                  <CustomButton>צפייה בסיכומי שיעור</CustomButton>
                </MenuItem>
              </Link>
              <Link href={`/homeEvents/homeEvents?patientId=${query.patientId}`}>
                <MenuItem>
                  <CustomButton>צפייה בדיווחים מהבית</CustomButton>
                </MenuItem>
              </Link>
              <Link href={`/goals/goals?patientId=${query.patientId}`}>
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