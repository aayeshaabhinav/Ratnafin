import { Fragment, useState, useCallback } from "react";
import { TextField } from "components/styledComponent/textfield";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import { InputMaskCustom } from "components/derived/inputMask";

export const PasswordField = ({
  loginType,
  classes,
  loginState,
  verifyPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const handleChange = useCallback((e) => setPassword(e.target.value), [
    setPassword,
  ]);

  return (
    <Fragment>
      <div className={classes.formWrap}>
        {loginType === "customer" ? (
          <TextField
            autoFocus={true}
            key="customer"
            label="OTP"
            placeholder="Enter OTP Sent to your mobile No"
            InputLabelProps={{ shrink: true }}
            fullWidth
            type="number"
            name="otp"
            value={password}
            onChange={handleChange}
            onKeyDown={(e) => e.keyCode === 13 && verifyPassword(password)}
            error={loginState.isError}
            helperText={loginState.isError ? loginState.userMessage : ""}
            disabled={loginState.loading}
            InputProps={{
              inputComponent: InputMaskCustom,
              inputProps: {
                MaskProps: {
                  mask: "000000",
                },
              },
            }}
          />
        ) : (
          <TextField
            autoFocus={true}
            key="employee/Partner"
            label="Enter Password"
            placeholder="Enter Password"
            InputLabelProps={{
              shrink: true,
            }}
            fullWidth
            type={showPassword ? "text" : "password"}
            name="otp"
            value={password}
            onChange={handleChange}
            onKeyDown={(e) => e.keyCode === 13 && verifyPassword(password)}
            error={loginState.isError}
            helperText={loginState.isError ? loginState.userMessage : ""}
            disabled={loginState.loading}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword((old) => !old)}
                    onMouseDown={(e) => e.preventDefault()}
                    disabled={loginState.loading}
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button
            endIcon={loginState.loading ? <CircularProgress size={20} /> : null}
            disabled={loginState.loading}
            onClick={() => verifyPassword(password)}
          >
            Login
          </Button>
        </div>
      </div>
    </Fragment>
  );
};
