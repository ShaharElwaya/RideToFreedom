import * as React from 'react';
import Box from '@mui/material/Box';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Layers from '@mui/icons-material/Layers';
import Person2 from '@mui/icons-material/Person2';
import OtherHouses from '@mui/icons-material/OtherHouses';
import CrisisAlert from '@mui/icons-material/CrisisAlert';
import Menu from '@mui/icons-material/Menu';
import Summarize from '@mui/icons-material/Summarize';
import { useRouter } from 'next/router';

const actions = [
  {
    icon: <CrisisAlert />,
    name: "מטרות",
    link: "../goals/goals",
    screen: "goals",
  },
  {
    icon: <OtherHouses />,
    name: "דיווחים מהבית",
    link: "../homeEvents/homeEvents",
    screen: "homeEvents",
  },
  {
    icon: <Summarize />,
    name: "סיכומי שיעורים",
    link: "../lessonSummary/summariesPatientLessons",
    screen: "summariesPatientLessons",
  },
  {
    icon: <Person2 />,
    name: "פרטי אישיים והכרות",
    link: "../introMeetingView",
    screen: "introMeetingView",
  },
  {
    icon: <Menu />,
    name: "דף מטופל ראשי",
    link: "../personalMenu",
    screen: "personalMenu",
  },
];

export default function Nevigation({ patientId, screen }) {
  const router = useRouter();
  const handleActionClick = (link) => {
    const urlWithPatientId = `${link}?patientId=${patientId}`;
    router.push(urlWithPatientId);
  };
  const topPosition = window.innerHeight - 340;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: `${topPosition}px`, // Adjust the top position as needed
        right: '16px', // Adjust the right position as needed
        zIndex: 1000, // Adjust the z-index to make sure it's above other elements
      }}
    >
      <SpeedDial ariaLabel="SpeedDial basic example" icon={<Layers />}>
        {actions.map((action) => (
          // Check if the current screen matches the action's screen
          screen !== action.screen && (
            <SpeedDialAction
              key={action.name}
              icon={action.icon}
              tooltipTitle={action.name}
              onClick={() => handleActionClick(action.link)}
            />
          )
        ))}
      </SpeedDial>
    </Box>
  );
}