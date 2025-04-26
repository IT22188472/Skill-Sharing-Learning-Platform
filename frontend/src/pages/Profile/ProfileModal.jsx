import * as React from "react";
import { useEffect } from "react"; // Add this import
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux"; // Add useSelector
import { useFormik } from "formik";
import { updateProfileAction } from "../../Redux/Auth/auth.action";
import { Avatar, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
  outline: "none",
  overFlow: "scroll-y",
  borderRadius: 3,
};

export default function ProfileModal({ open, handleClose }) {
  const dispatch = useDispatch();
  const { user } = useSelector(store => store.auth); // Get current user from Redux store

  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: ""
    },
    onSubmit: (values) => {
      dispatch(updateProfileAction({
        ...values,
        userId: user?.id
      }));
      handleClose();
    },
  });

  // Reset form with user data when modal opens or user changes
  useEffect(() => {
    if (open && user) {
      formik.setValues({
        firstName: user.firstName || "",
        lastName: user.lastName || ""
      });
    }
  }, [open, user]); // Add user to dependency array

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <form onSubmit={formik.handleSubmit}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <IconButton onClick={handleClose}>
                  <CloseIcon />
                </IconButton>
                <p>Edit Profile</p>
              </div>
              <Button type="submit">Save</Button>
            </div>
            <div>
              <div className="h-[15rem]">
                <img
                  src="https://cdn.pixabay.com/photo/2025/04/15/17/14/lighthouse-9535881_1280.jpg"
                  alt="Profile background"
                />
              </div>
              <div className="pl-5">
                <Avatar
                  className="transform -translate-y-24"
                  sx={{ width: "10rem", height: "10rem" }}
                  src={user?.profilePicture || "https://cdn.pixabay.com/photo/2018/08/28/12/41/avatar-3637425_1280.png"}
                />
              </div>
            </div>
            <div className="space-y-3">
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
              />

              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
              />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
}