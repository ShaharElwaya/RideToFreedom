import React, { useState, useEffect } from "react";
import { Paper, Typography, Button } from "@mui/material";
import { useRouter } from "next/router";
import axios from "axios";
import CustomizedDialogs from "@/components/dialog";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import PatientRow from "@/components/UI/patientRow";

export default function ViewForm() {
  const [formData, setFormData] = useState([]);
  const [parentName, setParentName] = useState("");
  const { query } = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [isDialogSuccessOpen, setIsDialogSuccessOpen] = useState(false);
  const [dialogSuccess, setDialogSuccess] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showComments, setShowComments] = useState(false); // State to control visibility of comments section

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: formData } = await axios.get("/api/patient/getPatient", {
          params: { patient_id: query.patientId },
        });
        const { data: parentData } = await axios.get(
          `/api/parent/getParentById`,
          { params: { id: formData[0].parent_id } }
        );

        setParentName(parentData[0].name);
        setFormData(formData);
      } catch (error) {
        console.error("Error fetching form data:", error);
      }
    };

    if (query.patientId) {
      fetchData();
    }
  }, [query.patientId]);

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setComment("");
  };

  const handleSaveComment = async () => {
    try {
      if (!comment.trim()) {
        setDialogError("התגובה אינה יכולה להיות ריקה");
        setIsDialogOpen(true);
        return;
      }

      setIsSaving(true);

      // Save the comment to the database
      await axios.post("/api/introMeeting/addComment", {
        comment,
        patient_id: query.patientId, // Send data in request body
      });

      // Fetch updated comments after saving the comment
      await fetchComments();

      // Close the comment dialog
      handleCloseDialog();

      // Open the success dialog
      setDialogSuccess("התגובה נשמרה בהצלחה");
      setIsDialogSuccessOpen(true);
    } catch (error) {
      console.error("Error saving comment:", error);

      // Handle error
      setDialogError("אירעה שגיאה בעת שמירת התגובה");
      setIsDialogOpen(true);
      setIsDialogSuccessOpen(false); // Close the success dialog if there was an error
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        // Fetch comments for the specific patient
        const response = await axios.get(
          `/api/introMeeting/getComments?patient_id=${query.patientId}`
        );
        setComments(response.data); // Set comments
        setShowComments(true); // Show comments section if there are comments
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (query.patientId) {
      fetchComments(); // Fetch comments when component mounts
    }
  }, [query.patientId]);

  return (
    <div style={{ height: "90vh" }}>
      <h1>פרטי פגישת היכרות</h1>
      <div
        style={{
          height: "90%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div>
          {formData.map((data, index) => (
            <Paper
              key={index}
              style={{ padding: "20px", marginBottom: "20px" }}
            >
              <Typography>
                <strong> שם ההורה:</strong> {}
              </Typography>
              <Typography>
                <strong>שם הילד:</strong> {data.name}
              </Typography>
              <Typography>
                <strong>כתובת:</strong> {data.address}
              </Typography>
              <Typography>
                <strong>יום הולדת:</strong> {data.birthday}
              </Typography>
              <Typography>
                <strong>מין:</strong> {data.gender === "M" ? "זכר" : "נקבה"}
              </Typography>
              <Typography>
                <strong>סיבת בקשה:</strong> {data.reason_for_request}
              </Typography>
            </Paper>
          ))}
        </div>
      </div>
      {showComments && ( // Render comments section only if there are comments
        <div>
          <h4>תגובות:</h4>
          {isLoading ? (
            <p>Loading comments...</p>
          ) : (
            comments.map((comment, index) => (
              <PatientRow
                key={index}
                pictureName="guidePic"
                picturePath="/guide.webp"
                lesson={comment}
                hasBottomBorder={true}
              />
            ))
          )}
        </div>
      )}
      {query.userType !== "1" && (
        <div className="submitButtonStyle">
          <Button variant="contained" onClick={handleOpenDialog}>
            הוספת תגובה
          </Button>
        </div>
      )}

      {/* Comment Dialog */}
      {query.userType !== "1" && ( // Render the comment dialog only if userType is not 1
        <CustomizedDialogs
          title="הוספת תגובה"
          text={
            <React.Fragment>
              <TextAreaComponent
                placeholderText="הוספת תגובה"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              {dialogError && (
                <Typography color="error" variant="body2">
                  {dialogError}
                </Typography>
              )}
            </React.Fragment>
          }
          open={isDialogOpen}
          onClose={handleCloseDialog}
          actions={[
            <Button key="cancelButton" onClick={handleCloseDialog}>
              ביטול
            </Button>,
            <Button
              key="saveButton"
              autoFocus
              onClick={handleSaveComment}
              variant="contained"
              disabled={isSaving}
            >
              שמירה
            </Button>,
          ]}
        />
      )}

      {/* Success Dialog */}
      <CustomizedDialogs
        title="הוספת התגובה הושלמה"
        text={dialogSuccess}
        open={isDialogSuccessOpen}
        onClose={() => setIsDialogSuccessOpen(false)}
        actions={[
          <Button
            key="confirmButton"
            autoFocus
            onClick={() => setIsDialogSuccessOpen(false)}
          >
            הבנתי
          </Button>,
        ]}
      />
    </div>
  );
}
