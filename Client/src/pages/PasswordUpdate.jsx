import { LoadingButton } from "@mui/lab";
import { Box, Stack, TextField } from "@mui/material";
import { useFormik } from "formik";
import * as Yup from "yup";
import Container from "../components/common/Container";
import uiConfigs from "../configs/ui.configs";
import { useState } from "react";
import userApi from "../api/modules/user.api";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/features/userSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import Logo from "../components/common/Logo";

const PasswordUpdate = () => {
  const [onRequest, setOnRequest] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const form = useFormik({
    initialValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),
      newPassword: Yup.string()
        .min(8, "New password must be at least 8 characters")
        .required("New password is required"),
      confirmNewPassword: Yup.string()
        .min(8, "Confirm new password must be at least 6 characters")
        .required("Confirm new password is required")
        .oneOf([Yup.ref("newPassword"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => onUpdate(values),
  });

  const onUpdate = async (values) => {
    if (onRequest) return;
    setOnRequest(true);

    const { response, err } = await userApi.passwordUpdate(values);
    console.log("Res: ", response, "Error: ", err);

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      form.resetForm();
      navigate("/");
      dispatch(setUser(null));
      dispatch(setAuthModalOpen(true));
      toast.success("Update password success !!! Please re-signin");
    }
  };

  return (
    <>
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Container header={"update password"}>
          <Box component="form" maxWidth={"400px"} onSubmit={form.handleSubmit}>
            <Stack spacing={2}>
              <TextField
                type="password"
                placeholder="Password"
                name="password"
                fullWidth
                value={form.values.password}
                onChange={form.handleChange}
                color="success"
                error={
                  form.touched.password && form.errors.password !== undefined
                }
                helperText={form.touched.password && form.errors.password}
              />
              <TextField
                type="password"
                placeholder="New Password"
                name="newPassword"
                fullWidth
                value={form.values.newPassword}
                onChange={form.handleChange}
                color="success"
                error={
                  form.touched.newPassword &&
                  form.errors.newPassword !== undefined
                }
                helperText={form.touched.newPassword && form.errors.newPassword}
              />
              <TextField
                type="password"
                placeholder="Confirm New Password"
                name="confirmNewPassword"
                fullWidth
                value={form.values.confirmNewPassword}
                onChange={form.handleChange}
                color="success"
                error={
                  form.touched.confirmNewPassword &&
                  form.errors.confirmNewPassword !== undefined
                }
                helperText={
                  form.touched.confirmNewPassword &&
                  form.errors.confirmNewPassword
                }
              />

              <LoadingButton
                type="submit"
                variant="contained"
                fullWidth
                sx={{ marginTop: 4 }}
                loading={onRequest}
              >
                Update Password
              </LoadingButton>
            </Stack>
          </Box>
        </Container>
      </Box>
    </>
  );
};

export default PasswordUpdate;
