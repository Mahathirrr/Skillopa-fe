import React from "react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import ReCAPTCHA from "react-google-recaptcha";

import Alert from "@mui/material/Alert";
import Divider from "@mui/material/Divider";

import Button from "src/components/Button";
import Input from "src/components/Input";
import Logo from "src/components/Logo";
import GoogleLoginButton from "src/components/GoogleLoginButton";

import withoutAuth from "src/components/HOC/withoutAuth";

import { login } from "redux/slice/auth";

function Login() {
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();

  const { loading, errorMessage } = useSelector((state) => state.auth);
  const [captchaToken, setCaptchaToken] = React.useState(null);

  const onSubmit = (data) => {
    if (!captchaToken) {
      alert("Please verify that you are not a robot");
      return;
    }
    dispatch(login({ ...data, captchaToken }));
  };

  const handleGuestLogin = () => {
    if (!captchaToken) {
      alert("Please verify that you are not a robot");
      return;
    }
    onSubmit({
      email: "test.user@gmail.com",
      password: "test.user@gmail.com",
      captchaToken,
    });
  };

  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
  };

  const renderForm = () => {
    return (
      <div className="grid place-items-center h-screen">
        <div className="w-9/12 md:w-1/2 lg:w-1/3 px-8 pt-12 pb-16 border-2 border-solid border-primary border-opacity-25 rounded-lg shadow-xl">
          <Logo variant="main" />
          <h2 className="text-2xl my-1.5 ml-1">Login</h2>
          {errorMessage && (
            <Alert severity="error" className="mb-2">
              {errorMessage}
            </Alert>
          )}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-2"
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: "Email is required.",
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  label="Email"
                  type="email"
                  placeholder="Email"
                  error={!!error}
                  helperText={error ? error.message : null}
                  required
                  {...field}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: true,
                minLength: {
                  value: 6,
                  message: "Your password must be at least 6 characters.",
                },
                maxLength: {
                  value: 20,
                  message: "Your password must be maximum 20 characters.",
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  label="Password"
                  type="password"
                  placeholder="Password"
                  required
                  error={!!error}
                  helperText={error ? error.message : null}
                  {...field}
                />
              )}
            />

            <div className="flex justify-center my-4">
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
                onChange={handleCaptchaChange}
                theme="dark"
              />
            </div>

            <Button
              label="Sign In"
              type="submit"
              className="mt-5"
              loading={loading}
              disabled={!captchaToken}
            />
          </form>

          <div className="my-4">
            <Divider>
              <span className="text-gray-500 px-4">or</span>
            </Divider>
          </div>

          <GoogleLoginButton />

          <div className="flex flex-col gap-0 text-center mt-5">
            <p className="text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup">
                <a className="text-primary">Sign up</a>
              </Link>
            </p>
            <p>or</p>
            <Button
              label="Use a guest account"
              type="submit"
              variant="transparent"
              className="normal-case"
              loading={loading}
              onClick={handleGuestLogin}
              disabled={!captchaToken}
            />
          </div>
        </div>
      </div>
    );
  };

  return renderForm();
}

export default withoutAuth(Login);
