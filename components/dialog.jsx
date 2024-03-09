import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function CustomizedDialogs({
  title,
  text,
  closeText,
  open,
  onClose,
  actions,
}) {
  const isSmallScreen = useMediaQuery("(max-width:600px)");

  return (
    <Dialog
      onClose={onClose}
      open={open}
      fullWidth={isSmallScreen}
      style={{
        ...(isSmallScreen
          ? {
              width: "100%",
              maxWidth: "100%",
            }
          : {}),
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography gutterBottom>{text}</Typography>
      </DialogContent>
      <DialogActions>
        {Array.isArray(actions) &&
          actions.map((action, index) => (
            // Adding a unique key for each action
            <React.Fragment key={index}>
              {action}
              {index !== actions.length - 1 && <span>&nbsp;</span>}
            </React.Fragment>
          ))}
      </DialogActions>
    </Dialog>
  );
}
