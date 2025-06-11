import { LoadingButton } from "@mui/lab";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import userApi from "../../api/modules/user.api";
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import { setUser } from "../../redux/features/userSlice";

const SignupForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const signinForm = useFormik({
    initialValues: {
      username: "",
      password: "",
      displayName: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(6, "Username must be at least 6 characters")
        .required("Username is required"),
      displayName: Yup.string().required("Display name is required"),
      password: Yup.string()
        .min(8, "Password must be at least 6 characters")
        .required("Password is required"),
      confirmPassword: Yup.string()
        .min(8, "Confirm password must be at least 6 characters")
        .required("Confirm password is required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      const { response, error } = await userApi.signup(values);
      console.log("API response:", response);
      setTimeout(() => {
        setIsLoginRequest(false);
      }, 300);
      if (response) {
        signinForm.resetForm();
        dispatch(setUser(response));
        dispatch(setAuthModalOpen(false));
        toast.success("Login successful!");
      }

      if (error) {
        setErrorMessage(error);
      }
    },
  });

  return (
    <>
      <Box component={"form"} onSubmit={signinForm.handleSubmit}>
        <Stack spacing={3}>
          <TextField
            type="text"
            placeholder="Username"
            name="username"
            fullWidth
            value={signinForm.values.username}
            onChange={signinForm.handleChange}
            color="success"
            error={
              signinForm.touched.username &&
              signinForm.errors.username !== undefined
            }
            helperText={
              signinForm.touched.username && signinForm.errors.username
            }
          />
          <TextField
            type="text"
            placeholder="Display Name"
            name="displayName"
            fullWidth
            value={signinForm.values.displayName}
            onChange={signinForm.handleChange}
            color="success"
            error={
              signinForm.touched.displayName &&
              signinForm.errors.displayName !== undefined
            }
            helperText={
              signinForm.touched.displayName && signinForm.errors.displayName
            }
          />
          <TextField
            type="password"
            placeholder="Password"
            name="password"
            fullWidth
            value={signinForm.values.password}
            onChange={signinForm.handleChange}
            color="success"
            error={
              signinForm.touched.password &&
              signinForm.errors.password !== undefined
            }
            helperText={
              signinForm.touched.password && signinForm.errors.password
            }
          />
          <TextField
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            fullWidth
            value={signinForm.values.confirmPassword}
            onChange={signinForm.handleChange}
            color="success"
            error={
              signinForm.touched.confirmPassword &&
              signinForm.errors.confirmPassword !== undefined
            }
            helperText={
              signinForm.touched.confirmPassword &&
              signinForm.errors.confirmPassword
            }
          />
        </Stack>

        <LoadingButton
          type="submit"
          fullWidth
          size="large"
          variant="contained"
          sx={{
            marginTop: 4,
          }}
          loading={isLoginRequest}
        >
          Sign Up
        </LoadingButton>

        <Button
          fullWidth
          sx={{ marginTop: 1 }}
          onClick={() => switchAuthState()}
        >
          Sign In
        </Button>

        {errorMessage && (
          <Box sx={{ marginTop: 2 }}>
            <Alert severity="error" variant="outlined">
              {errorMessage?.data?.message ||
                errorMessage?.message ||
                "An error occurred. Please try again."}
            </Alert>
          </Box>
        )}
      </Box>
    </>
  );
};

export default SignupForm;
