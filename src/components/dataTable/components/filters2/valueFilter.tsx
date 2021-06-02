import { useState } from "react";
import { TextField } from "components/styledComponent/textfield";
import { SelectRenderOnly } from "components/common/select/render";
import Grid from "@material-ui/core/Grid";

const options = [
  { label: "starts with", value: "startsWith" },
  { label: "ends with", value: "endsWith" },
  { label: "equal", value: "equal" },
  { label: "contains", value: "contains" },
];

export const ValueFilter = ({
  column: { filterValue, id, columnName },
  dispatch,
}) => {
  const [text, setText] = useState(filterValue?.value ?? "");
  const [condition, setCondition] = useState(filterValue?.condition ?? "equal");
  const handleBlur = () => {
    if (Boolean(text)) {
      dispatch({
        type: "setValue",
        payload: {
          condition: condition,
          value: text,
          id,
          columnName,
        },
      });
    } else {
      dispatch({
        type: "removeValue",
        payload: {
          id,
        },
      });
    }
  };

  return (
    <Grid item xs={12} sm={6} md={6}>
      <TextField
        label={columnName}
        InputLabelProps={{ shrink: true }}
        onChange={(e) => setText(e.target.value)}
        onBlur={handleBlur}
        fullWidth
        value={text}
        InputProps={{
          endAdornment: (
            <SelectRenderOnly
              size="small"
              style={{ width: "50%" }}
              touched={true}
              error={""}
              multiple={false}
              handleChange={(e) => setCondition(e.target.value)}
              handleBlur={() => true}
              options={options}
              disableCaching={false}
              value={condition}
              selectVariant="andornment"
            />
          ),
        }}
      />
    </Grid>
  );
};