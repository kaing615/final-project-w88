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

const SigninForm = ({ switchAuthState }) => {
  const dispatch = useDispatch();

  const [isLoginRequest, setIsLoginRequest] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const signinForm = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(8, "Username must be at least 8 characters")
        .required("Username is required"),
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
    }),
    onSubmit: async (values) => {
      setErrorMessage(undefined);
      setIsLoginRequest(true);
      const { response, error } = await userApi.signin(values);
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
          Sign In
        </LoadingButton>

        <Button
          fullWidth
          sx={{ marginTop: 1 }}
          onClick={() => switchAuthState()}
        >
          Sign Up
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

export default SigninForm;
