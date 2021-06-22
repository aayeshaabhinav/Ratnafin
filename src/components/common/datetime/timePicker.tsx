import { FC, useEffect, useRef } from "react";
import { useField, UseFieldHookProps } from "packages/form";
import { KeyboardTimePickerProps } from "@material-ui/pickers";
import { KeyboardTimePicker } from "components/styledComponent/datetime";
import Grid, { GridProps } from "@material-ui/core/Grid";

import { Omit, Merge } from "../types";

type KeyboardTimePickerPropsSubset = Omit<
  KeyboardTimePickerProps,
  "onChange" | "value"
>;

interface MyGridExtendedProps {
  GridProps?: GridProps;
  enableGrid: boolean;
}

export type MyTimeTimePickerAllProps = Merge<
  Merge<KeyboardTimePickerPropsSubset, MyGridExtendedProps>,
  UseFieldHookProps
>;

export const MyTimePicker: FC<MyTimeTimePickerAllProps> = ({
  name: fieldName,
  validate,
  validationRun,
  shouldExclude,
  isReadOnly,
  postValidationSetCrossFieldValues,
  runPostValidationHookAlways,
  dependentFields,
  fieldKey: fieldID,
  type,
  GridProps,
  enableGrid,
  //@ts-ignore
  isFieldFocused,
  InputProps,
  inputProps,
  runValidationOnDependentFieldsChange,
  ...others
}) => {
  const {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    isSubmitting,
    fieldKey,
    name,
    excluded,
    readOnly,
  } = useField({
    name: fieldName,
    fieldKey: fieldID,
    dependentFields,
    validate,
    validationRun,
    runPostValidationHookAlways,
    postValidationSetCrossFieldValues,
    isReadOnly,
    shouldExclude,
    runValidationOnDependentFieldsChange,
  });
  useEffect(() => {
    if (typeof value === "string") {
      let result = new Date(value);
      //@ts-ignore
      if (!isNaN(result)) {
        handleChange(result);
      }
    }
  }, [value, handleChange]);
  const focusRef = useRef();
  useEffect(() => {
    if (isFieldFocused) {
      //@ts-ignore
      setTimeout(() => {
        //@ts-ignore
        focusRef?.current?.focus?.();
      }, 1);
    }
  }, [isFieldFocused]);
  const isError = touched && (error ?? "") !== "";

  if (excluded) {
    return null;
  }
  const result = (
    <KeyboardTimePicker
      {...others}
      key={fieldKey}
      id={fieldKey}
      name={name}
      value={value === "" ? null : value} //make sure to pass null when input is empty string
      error={!isSubmitting && isError}
      helperText={!isSubmitting && isError ? error : null}
      //@ts-ignore
      onChange={handleChange}
      onBlur={handleBlur}
      disabled={isSubmitting}
      readOnly={readOnly}
      InputLabelProps={{
        shrink: true,
      }}
      InputProps={{
        readOnly: readOnly,
        tabIndex: readOnly ? -1 : undefined,
        ...InputProps,
      }}
      inputProps={{
        tabIndex: readOnly ? -1 : undefined,
        ...inputProps,
      }}
    />
  );
  if (Boolean(enableGrid)) {
    return (
      <Grid {...GridProps} key={fieldKey}>
        {result}
      </Grid>
    );
  } else {
    return result;
  }
};

export default MyTimePicker;
