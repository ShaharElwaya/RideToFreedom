import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Checkbox, Typography } from "@mui/material";
import PicAndHeadlines from "@/components/UI/picAndheadline";
import PatientRow from "@/components/UI/patientRow";
import style from "../../styles/summariesPatientLessons.module.css";
import TextAreaComponent from "@/components/UI/textAreaComponent";
import CustomizedDialogs from "@/components/dialog";
import LoadingSpinner from "@/components/loadingSpinner";
import { useRouter } from "next/router";
import { userStore } from "@/stores/userStore";
import useCustomQuery from "@/utils/useCustomQuery";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function SpecificSummaryWatch() {
  const [lessonDetails, setLessonDetails] = useState({});
  console.log("🚀 ~ SpecificSummaryWatch ~ lessonDetails:", lessonDetails)
  const router = useRouter();
  const { lessonId } = router.query;
  const [parentPermission, setParentPermission] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogError, setDialogError] = useState("");
  const [isDialogSuccessOpen, setIsDialogSuccessOpen] = useState(false);
  const [dialogSuccess, setDialogSuccess] = useState("");
  const [comment, setComment] = useState("");
  const { type, id } = userStore.getState();
  const [comments, setComments] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const isSmallScreen = useMediaQuery("(max-width: 600px)");
  const [maxLettersGuideName, setMaxLettersGuideName] = useState(0);
  const [commentBeingEdited, setCommentBeingEdited] = useState(null);
  const [editedComment, setEditedComment] = useState("");
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [isDialogEditOpen, setIsDialogEditOpen] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setComment(""); // Clear the comment when the dialog is closed
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
      await axios.post("/api/lessonsSummaries/addComment", {
        lessonId,
        comment,
        id,
        type,
      });

      // Fetch updated comments after saving the comment
      const commentsResponse = await axios.get(
        `/api/lessonsSummaries/getComments?lesson_id=${lessonId}`
      );
      setComments(commentsResponse.data);

      // Close the comment dialog
      handleCloseDialog();

      // Open the success dialog
      setDialogSuccess("התגובה נשמרה בהצלחה");
      setIsDialogSuccessOpen(true);
    } catch (error) {
      console.error("Error saving comment:", error);

      // Open the failure dialog only if there's an actual error
      if (error.response && error.response.data && error.response.data.error) {
        setDialogError(
          `אירעה שגיאה בעת שמירת התגובה: ${error.response.data.error}`
        );
        setIsDialogOpen(true);
        setIsDialogSuccessOpen(false); // Close the success dialog if there was an error
      } else {
        // If it's not an error from the server, it might be a network issue
        setDialogError("אירעה שגיאה בעת שמירת התגובה");
        setIsDialogOpen(true);
        setIsDialogSuccessOpen(false); // Close the success dialog if there was an error
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Fetch lesson details based on lessonId from the URL
  const fetchLessonDetails = async () => {
    console.log(window.location);
    try {
      const response = await axios.get(
        "/api/lessonsSummaries/specificSummaryWatch",
        {
          params: { lesson_id: lessonId },
        }
      );
      setLessonDetails(response.data);
      setParentPermission(response.data.parent_permission);

      if (type == 1 && !response.data.parent_permission) {
        // Redirect to the desired route for unauthorized users
        router.push(
          `/lessonSummary/summariesPatientLessons?patientId=${response.data.patient_id}`
        );
      }

      if (type === 1) {
        // Fetch comments for the specific lessonId
        const childrens = await axios.get(`/api/login/childrens?id=${id}`);
        let isOk = false;

        for (let i = 0; i < childrens.data.length && !isOk; i++) {
          if (childrens.data[i].id == response.data.patient_id) {
            isOk = true;
          }
        }

        if (isOk == false) {
          router.back(); // Use await to wait for the navigation to complete
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching lesson details:", error);
    }
  };

  const fetchComments = async () => {
    try {
      // Fetch comments for the specific lessonId
      const response = await axios.get(
        `/api/lessonsSummaries/getComments?lesson_id=${lessonId}`
      );
      setComments(response.data);
      setIsLoading(false);

      if (response.data.length > 0) {
        let maxLetters = 0;
        for (let i = 0; i < response.data.length; i++) {
          if (response.data[i].name.length > maxLetters) {
            maxLetters = response.data[i].name.length;
          }
        }
        setMaxLettersGuideName(maxLetters);
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

  const fetchAll = async () => {
    await fetchLessonDetails();
    await fetchComments();
  };

  useCustomQuery(fetchAll, [lessonId]);

  const formatDate = (date) => {
    if (!date) {
      return ""; // Handle the case when date is undefined or null
    }

    if (isSmallScreen) {
      // Display date in "dd/mm" format for small screens
      const [day, month] = date.split("-");
      return `${day}-${month}`;
    } else {
      // Keep the original date format for larger screens
      return date;
    }
  };

  const handleEditClick = (comment) => {
    // Only allow the owner of the comment to edit it
    if (comment.user_id === id) {
      setEditedComment(comment.comment);
      setCommentBeingEdited(comment);
      setIsDialogEditOpen(true);
    }
  };

  const handleCloseEditDialog = () => {
    setEditedComment("");
    setIsDialogEditOpen(false);
    setDialogError("");
    setCommentBeingEdited(null);
  };

  const handleUpdateComment = async () => {
    try {
      if (!editedComment.trim()) {
        setDialogError("התגובה אינה יכולה להיות ריקה");
        setIsDialogOpen(true);
        return;
      }

      setIsSaving(true);

      // Save the comment to the database
      await axios.post("/api/lessonsSummaries/updateComment", {
        id: commentBeingEdited.id,
        comment: editedComment
      });

      // Fetch updated comments after saving the comment
      const commentsResponse = await axios.get(
        `/api/lessonsSummaries/getComments?lesson_id=${lessonId}`
      );
      setComments(commentsResponse.data);

      // Close the comment dialog
      handleCloseEditDialog();

      // Open the success dialog
      setDialogSuccess("התגובה נשמרה בהצלחה");
      setIsDialogSuccessOpen(true);
    } catch (error) {
      console.error("Error saving comment:", error);

      // Open the failure dialog only if there's an actual error
      if (error.response && error.response.data && error.response.data.error) {
        setDialogError(
          `אירעה שגיאה בעת שמירת התגובה: ${error.response.data.error}`
        );
        setIsDialogEditOpen(true);
        setIsDialogSuccessOpen(false); // Close the success dialog if there was an error
      } else {
        // If it's not an error from the server, it might be a network issue
        setDialogError("אירעה שגיאה בעת שמירת התגובה");
        setIsDialogEditOpen(true);
        setIsDialogSuccessOpen(false); // Close the success dialog if there was an error
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteComment = async () => {
    try {
      setIsSaving(true);

      // Save the comment to the database
      await axios.post("/api/lessonsSummaries/deleteComment", {
        id: commentBeingEdited.id,
      });

      // Fetch updated comments after saving the comment
      const commentsResponse = await axios.get(
        `/api/lessonsSummaries/getComments?lesson_id=${lessonId}`
      );
      setComments(commentsResponse.data);

      // Close the comment dialog
      handleCloseEditDialog();

      // Open the success dialog
      setDialogSuccess("התגובה נמחקה בהצלחה");
      setIsDialogSuccessOpen(true);
    } catch (error) {
      console.error("Error saving comment:", error);

      // Open the failure dialog only if there's an actual error
      if (error.response && error.response.data && error.response.data.error) {
        setDialogError(
          `אירעה שגיאה בעת שמירת התגובה: ${error.response.data.error}`
        );
        setIsDialogEditOpen(true);
        setIsDialogSuccessOpen(false); // Close the success dialog if there was an error
      } else {
        // If it's not an error from the server, it might be a network issue
        setDialogError("אירעה שגיאה בעת מחיקת התגובה");
        setIsDialogEditOpen(true);
        setIsDialogSuccessOpen(false); // Close the success dialog if there was an error
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}

      <div className={style.leftStyle}>
        <Button onClick={handleGoBack}> חזור &gt;</Button>
      </div>

      <PicAndHeadlines
        pictureName="lessonSummary"
        picturePath="../lessonSummary.png"
        primaryHeadline="סיכומי שיעורים"
        secondaryHeadline={
          lessonDetails.patient_name ? lessonDetails.patient_name : ""
        }
      />
      <PatientRow
        pictureName="GenderPic"
        picturePath={`../${
          lessonDetails.gender === "F" ? "girlPic" : "boyPic"
        }.png`}
        date={formatDate(lessonDetails.formatted_date)}
        time={lessonDetails.formatted_time}
        name={lessonDetails.guide_name}
        lesson={lessonDetails.lesson_type_name}
        {...(isSmallScreen && {
          maxTextLengthName: 7,
          nameWidth: 77,
        })}
        {...(isSmallScreen && {
          maxTextLengthLesson: 7,
        })}
        isCenter
      />
      <div className={style.containerComments}>
        <TextAreaComponent
          placeholderText=" ספר איך היה השיעור *"
          value={lessonDetails.summary}
          required
          disabled
        />
        {type !== 1 && (
          <div>
            <Checkbox checked={parentPermission} disabled />
            האם לאפשר להורה לצפות בשיעור?
          </div>
        )}
        {comments.length > 0 && (
          <div>
            <h4>תגובות:</h4>
            {isLoading ? (
              <p>Loading comments...</p>
            ) : (
              comments.map((comment) => (
                <p onClick={() => handleEditClick(comment)}
                title={comment.user_id === id ? 'Click to edit' : ''} >
                  <PatientRow
                    pictureName="commentPic"
                    picturePath={
                      comment.user_type === 1 ? "/parent.png" : "/guide.webp"
                    }
                    name={comment.name}
                    lesson={comment.comment}
                    hasBottomBorder={true}
                    maxTextLengthName={isSmallScreen ? 7 : maxLettersGuideName}
                    nameWidth={isSmallScreen ? 70 : maxLettersGuideName * 9}
                    maxTextLengthLesson={
                      isSmallScreen
                        ? window.innerWidth / 9 - 28
                        : 46 - maxLettersGuideName
                    }
                    canEdit={comment.user_id === id}
                  /> 
                </p>
              ))
            )}
          </div>
        )}
      </div>
      <div className={style.submitButtonStyle}>
        <Button variant="contained" onClick={handleOpenDialog}>
          הוספת תגובה
        </Button>
      </div>

      {/* Comment Dialog */}
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

      {/* Comment Dialog */}
      <CustomizedDialogs
        title="עריכת תגובה"
        text={
          <React.Fragment>
            <TextAreaComponent
              value={editedComment}
              onChange={(e) => setEditedComment(e.target.value)}
              required
            />
            {dialogError && (
              <Typography color="error" variant="body2">
                {dialogError}
              </Typography>
            )}
          </React.Fragment>
        }
        open={isDialogEditOpen}
        onClose={handleCloseEditDialog}
        actions={[
          <Button
            key="cancelButton"
            onClick={() => handleDeleteComment()}
          >
            מחיקה
          </Button>,
          <Button
            key="saveButton"
            autoFocus
            onClick={() => handleUpdateComment()}
            variant="contained"
            disabled={isSaving}
          >
            שמירה
          </Button>,
        ]}
      />
    </>
  );
}
