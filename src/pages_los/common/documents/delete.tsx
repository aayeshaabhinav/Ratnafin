import { Fragment, useContext } from "react";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Alert from "@material-ui/lab/Alert";
import { useMutation } from "react-query";
import { DOCCRUDContext } from "./context";

interface DeleteFormDataType {
  docUUID?: string;
}

const DeleteDocumentDataFnWrapper = (deleteDocuments) => async ({
  docUUID,
}: DeleteFormDataType) => {
  return deleteDocuments(docUUID);
};

export const DeleteAction = ({ isProductEditedRef, closeDialog, docUUID }) => {
  const { deleteDocuments } = useContext(DOCCRUDContext);

  const mutation = useMutation(
    DeleteDocumentDataFnWrapper(deleteDocuments.fn(deleteDocuments.args)),
    {
      onError: (error: any) => {},
      onSuccess: (data) => {
        isProductEditedRef.current = true;
        closeDialog();
      },
    }
  );

  return (
    <Fragment>
      {mutation.isError ? (
        <Alert severity="error">
          {mutation?.error?.error_msg ?? "Unknown Error occured"}
        </Alert>
      ) : null}
      <DialogTitle id="alert-dialog-title">
        Are you sure you want to delete the selected Records
      </DialogTitle>
      <DialogActions>
        <Button
          onClick={closeDialog}
          color="primary"
          disabled={mutation.isLoading}
        >
          Disagree
        </Button>
        <Button
          color="primary"
          onClick={() => mutation.mutate({ docUUID })}
          disabled={mutation.isLoading}
        >
          Agree
        </Button>
      </DialogActions>
    </Fragment>
  );
};
