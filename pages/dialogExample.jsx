import React from 'react';
import { Typography, TextField, Button } from '@mui/material';
import CustomizedDialogs from '@/components/dialog';
import { useRouter } from 'next/router'; // Import useRouter from next/router


export default function dialogExample() {
  const [dialogOpen, setDialogOpen] = React.useState(false); // Initialize state
  const router = useRouter(); // Get the router object from next/router

  const handleCloseDialog = () => {
    setDialogOpen(false);
    router.push('/login');
  };

  return (
    <>
      <Button variant="outlined" onClick={() => setDialogOpen(true)}>
        פתיחת פופאפ
      </Button>

      <CustomizedDialogs
        title="הוספת משתמש"
        text="המשתמש נוסף בהצלחה"
        open={dialogOpen}
        onClose={handleCloseDialog}
        actions={[
          <Button key="confirmButton" autoFocus onClick={handleCloseDialog}>
            יאיי
          </Button>,
        ]}
      />
    </>
  );
}
