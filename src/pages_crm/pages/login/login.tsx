import React, { useState, useReducer, Fragment } from "react";
import Box from "@material-ui/core/Box";
import InputAdornment from "@material-ui/core/InputAdornment";
import { TextField } from "components/styledComponent/textfield";
import Button from "@material-ui/core/Button";
import { APISDK } from "registry/fns/sdk";
import CircularProgress from "@material-ui/core/CircularProgress";
import { useNavigate } from "react-router-dom";
import loginImg from "assets/images/login.svg";
import { InputMaskCustom } from "components/derived/inputMask";
import { useStyles } from "./style";
export interface FormDialogProps {
  submitProps: any;
}

export const Login = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [userPhoneNumberVerified, setUserPhoneNumberVerified] = useState("");

  const initialState = {
    currentScreen: "initiateLoginProcessWithPasswordAndOtp",
    apiOTPId: "",
    loading: false,
    apiResult: "",
    apiResultStatus: "",
    phoneNumber: "",
    otp: "",
    password: "",
    newPassword: "",
    confirmNewPassword: "",
  };

  const reducer = (state, action) => {
    switch (action.type) {
      case "fields":
        return {
          ...state,
          [action.fieldName]: action.payload,
        };
      case "startInitiateLoginProcessWithPasswordAndOtp":
        return {
          ...state,
          loading: true,
        };
      case "initiateLoginProcessWithOtp":
        return {
          ...state,
          currentScreen: "verifyOtp",
          loading: false,
          apiResult: action.apiResult,
          apiResultStatus: action.apiResultStatus,
          apiOTPId: action.apiOTPId,
        };
      case "initiateLoginWithPassword":
        return {
          ...state,
          currentScreen: "loginWithPassword",
          loading: false,
          apiResult: action.apiResult,
          apiResultStatus: action.apiResultStatus,
        };
      case "InitiateCreateNewPassword":
        return {
          ...state,
          currentScreen: "createNewPassword",
          loading: false,
          apiResult: action.apiResult,
          apiResultStatus: action.apiResultStatus,
        };
      case "endInitiateLoginProcessWithPasswordAndOtp":
        return {
          ...state,
          loading: false,
          apiResultStatus: action.apiResultStatus,
        };
      default:
        return state;
    }
  };

  const expiryTime = 60;

  const requestOtp = async () => {
    if (state.phoneNumber !== "" && state.phoneNumber.length === 10) {
      dispatch({
        type: "startInitiateLoginProcessWithPasswordAndOtp",
      });
      try {
        const result = await APISDK.requestOTP(state.phoneNumber);
        if (result.status === "success") {
          dispatch({
            type: "initiateLoginProcessWithOtp",
            currentScreen: "verifyOtp",
            apiOTPId: result?.data?.id,
            apiResult: result?.status,
          });
          // setexpiryOtpTime(result?.data?.sdatetime);
          displayIntervale();
        } else {
          dispatch({
            type: "endInitiateLoginProcessWithPasswordAndOtp",
            apiResultStatus: result?.data?.error_msg,
          });
        }
      } catch (e) {
        dispatch({
          type: "endInitiateLoginProcessWithPasswordAndOtp",
          apiResultStatus: e,
        });
      }
    }
  };

  const displayIntervale = () => {
    const timerId = setInterval(() => {
      setTime((time) => {
        if (time === expiryTime) {
          clearInterval(timerId);
          return time;
        } else {
          return time + 1;
        }
      });
    }, 1000);
  };

  const formatTime = (time) =>
    `${String(Math.floor(time / 60)).padStart(2, "0")}:${String(
      time % 60
    ).padStart(2, "0")}`;

  const Timer = ({ time }) => {
    const timeRemain = expiryTime - (time % expiryTime);
    return (
      <>
        <div className={classes.OTPTimer}>
          {time === expiryTime ? (
            <div onClick={requestOtp} className={classes.resendLink}>
              Resend OTP
            </div>
          ) : (
            formatTime(timeRemain)
          )}
        </div>
      </>
    );
  };

  const verifyOtp = async () => {
    try {
      dispatch({
        type: "startInitiateLoginProcessWithPasswordAndOtp",
      });
      let sdatetime = "20200915110135";
      const result = await APISDK.verifyOTP(
        state.apiOTPId,
        state.otp,
        sdatetime
      );
      if (result.status === "success") {
        if (userPhoneNumberVerified === "Yes") {
          dispatch({
            type: "InitiateCreateNewPassword",
            currentScreen: "createNewPassword",
            apiResult: result.status,
            apiResultStatus: result?.data?.message,
          });
        } else {
          navigate("/dashboard");
        }
      } else {
        dispatch({
          type: "endInitiateLoginProcessWithPasswordAndOtp",
          apiResultStatus: result?.data?.error_msg,
        });
      }
    } catch (e) {
      dispatch({
        type: "endInitiateLoginProcessWithPasswordAndOtp",
        apiResultStatus: e,
      });
    }
  };

  const updateNewPassword = async () => {
    dispatch({
      type: "startInitiateLoginProcessWithPasswordAndOtp",
    });
    if (
      state.newPassword !== "" &&
      state.confirmNewPassword !== "" &&
      state.newPassword === state.confirmNewPassword
    ) {
      try {
        const result = await APISDK.updateUserPassword(
          state.confirmNewPassword,
          state.phoneNumber
        );
        if (result.status === "success") {
          navigate("/dashboard");
        } else {
          dispatch({
            type: "endInitiateLoginProcessWithPasswordAndOtp",
            apiResultStatus: result?.data?.error_msg,
          });
        }
      } catch (e) {
        dispatch({
          type: "endInitiateLoginProcessWithPasswordAndOtp",
          apiResultStatus: e,
        });
      }
    }
  };

  const checkUserNumberAndPasswordExist = async () => {
    if (state.apiResultStatus === "" && state.phoneNumber.length === 10) {
      try {
        dispatch({
          type: "startInitiateLoginProcessWithPasswordAndOtp",
        });
        const result = await APISDK.checkPhoneNumberExists(state.phoneNumber);
        if (result.status === "success") {
          if (
            result?.data?.user_mobile === "Y" &&
            result?.data?.user_password === "N"
          ) {
            setUserPhoneNumberVerified("Yes");
            requestOtp();
          } else if (
            result?.data?.user_mobile === "Y" &&
            result?.data?.user_password === "Y"
          ) {
            dispatch({
              type: "initiateLoginWithPassword",
              currentScreen: "loginWithPassword",
              apiResult: result.status,
              apiResultStatus: result?.data?.message,
            });
          }
        } else {
          if (result?.data?.error_cd === "-999") {
            dispatch({
              type: "endInitiateLoginProcessWithPasswordAndOtp",
              apiResultStatus: result?.data?.error_msg,
            });
          }
        }
      } catch (e) {
        dispatch({
          type: "endInitiateLoginProcessWithPasswordAndOtp",
          apiResultStatus: e,
        });
      }
    }
  };

  const verifyPwd = async () => {
    if (state.password.length !== 0 || state.password !== "") {
      dispatch({
        type: "startInitiateLoginProcessWithPasswordAndOtp",
      });
      try {
        const result = await APISDK.handleverifyPwd(
          state.password,
          state.phoneNumber
        );
        if (result.status === "success") {
          navigate("/dashboard");
        } else {
          dispatch({
            type: "endInitiateLoginProcessWithPasswordAndOtp",
            apiResultStatus: result?.data?.error_msg,
          });
        }
      } catch (e) {
        dispatch({
          type: "endInitiateLoginProcessWithPasswordAndOtp",
          apiResultStatus: e,
        });
      }
    }
  };

  // password= "superacute@1234";
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <Box display="flex" width={1} className={classes.wrapper}>
        <Box
          display="flex"
          flexDirection="column"
          width={1 / 2}
          className={classes.loginLeft}
        >
          <img alt="" src={loginImg} className={classes.loginImg} />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          width={1 / 2}
          className={classes.loginRight}
        >
          <h2>Cutomer Login</h2>
          <div className="text">
            Login with your registered mobile number to access your Ratnaafin
            account.
          </div>

          {state.currentScreen === "initiateLoginProcessWithPasswordAndOtp" ? (
            <div className={classes.formWrap}>
              <TextField
                label="Mobile Number"
                placeholder="Enter mobile number"
                fullWidth
                className="mobileNumber"
                type="text"
                name="phoneNumber"
                value={state.phoneNumber}
                onChange={(e) =>
                  dispatch({
                    type: "fields",
                    fieldName: "phoneNumber",
                    payload: e.target.value,
                  })
                }
                InputProps={{
                  inputComponent: InputMaskCustom,
                  inputProps: {
                    MaskProps: {
                      mask: "0000000000",
                    },
                  },
                  startAdornment: (
                    <InputAdornment position="start">+91</InputAdornment>
                  ),
                }}
                error={Boolean(state.apiResultStatus)}
                helperText={state.apiResultStatus}
              />

              <Button
                onClick={requestOtp}
                endIcon={state.loading ? <CircularProgress size={20} /> : null}
                className={classes.loginBtn}
              >
                Login With OTP
              </Button>
              <Box display="flex" justifyContent="center" width={1}>
                <div className="text text-center">Or</div>
              </Box>
              <Button
                onClick={checkUserNumberAndPasswordExist}
                className={classes.loginBtn}
              >
                Login With Password
              </Button>
            </div>
          ) : state.currentScreen === "verifyOtp" ? (
            <div className={classes.formWrap}>
              <TextField
                label="OTP"
                placeholder="OTP for verification"
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                type="email"
                name="otp"
                onChange={(e) =>
                  dispatch({
                    type: "fields",
                    fieldName: "otp",
                    payload: e.target.value,
                  })
                }
                value={state.otp}
                inputProps={{ maxLength: 6 }}
                error={Boolean(state.apiResultStatus)}
                helperText={state.apiResultStatus}
                InputProps={{
                  inputComponent: InputMaskCustom,
                  inputProps: {
                    MaskProps: {
                      mask: "0 0 0 0 0 0",
                    },
                  },
                }}
              />
              <Timer time={time} />
              <Button
                disabled={state.otp.length !== 6 ? true : false}
                onClick={verifyOtp}
                className={classes.loginBtn}
              >
                VERIFY & LOGIN
              </Button>
            </div>
          ) : state.currentScreen === "createNewPassword" ? (
            <div className={classes.formWrap}>
              <TextField
                label="Create Password"
                placeholder="Create password"
                autoComplete="off"
                type="password"
                name="newPassword"
                onChange={(e) =>
                  dispatch({
                    type: "fields",
                    fieldName: "newPassword",
                    payload: e.target.value,
                  })
                }
                value={state.newPassword}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                error={Boolean(state.apiResultStatus)}
                helperText={state.apiResultStatus}
              />

              <TextField
                label="Confirm Password"
                placeholder="Confirm password"
                autoComplete="off"
                type="password"
                name="confirmNewPassword"
                onChange={(e) =>
                  dispatch({
                    type: "fields",
                    fieldName: "confirmNewPassword",
                    payload: e.target.value,
                  })
                }
                value={state.confirmNewPassword}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                error={Boolean(state.apiResultStatus)}
                helperText={state.apiResultStatus}
              />

              <Button
                onClick={updateNewPassword}
                disabled={
                  state.newPassword !== "" || state.confirmNewPassword !== ""
                    ? false
                    : true
                }
                endIcon={state.loading ? <CircularProgress size={20} /> : null}
                className={classes.loginBtn}
              >
                VERIFY & LOGIN
              </Button>
            </div>
          ) : state.currentScreen === "loginWithPassword" ? (
            <div className={classes.formWrap}>
              <TextField
                label="Password"
                placeholder="Password for verification"
                autoComplete="off"
                type="password"
                name="password"
                onChange={(e) =>
                  dispatch({
                    type: "fields",
                    fieldName: "password",
                    payload: e.target.value,
                  })
                }
                value={state.password}
                InputLabelProps={{
                  shrink: true,
                }}
                fullWidth
                error={Boolean(state.apiResultStatus)}
                helperText={state.apiResultStatus}
              />

              <Button
                onClick={verifyPwd}
                disabled={state.password !== "" ? false : true}
                endIcon={state.loading ? <CircularProgress size={20} /> : null}
                className={classes.loginBtn}
              >
                VERIFY & LOGIN
              </Button>
            </div>
          ) : null}
        </Box>
      </Box>
    </>
  );
};
