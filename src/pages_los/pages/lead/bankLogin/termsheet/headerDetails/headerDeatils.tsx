import Button from "@material-ui/core/Button";
import { useStyles } from "./style";
import { format } from "date-fns";

export const HeaderDetails = ({ rowData, closeDialog, bankName }) => {
  const classes = useStyles();
  let dateValue;
  try {
    dateValue = format(new Date(rowData?.generation_dt), "dd/MM/yyyy");
  } catch (e) {
    dateValue = "Invalid Date";
  }
  return (
    <div className={classes.wrapper}>
      <div className={classes.innerWrapper}>
        <div className={classes.spacing}>
          <div className={classes.labelText}>Lead No.</div>
          <div className={classes.valueText}>{rowData?.lead_no}</div>
        </div>
        <div className={classes.spacing}>
          <div className={classes.labelText}>Bank Name </div>
          <div className={classes.valueText}>{bankName}</div>
        </div>
        <div className={classes.spacing}>
          <div className={classes.labelText}>Category</div>
          <div className={classes.valueText}>{rowData?.category_id}</div>
        </div>
        <div className={classes.spacing}>
          <div className={classes.labelText}>Product</div>
          <div className={classes.valueText}>{rowData?.product_cd}</div>
        </div>
        <div className={classes.spacing}>
          <div className={classes.labelText}>Generated On</div>
          <div className={classes.valueText}>{dateValue}</div>
        </div>
        <div style={{ flexGrow: 1 }} />
        <Button onClick={closeDialog}>Close</Button>
      </div>
    </div>
  );
};
