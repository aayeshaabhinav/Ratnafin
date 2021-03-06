import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import FormWrapper, { MetaDataType } from "components/dyanmicForm";
import { verificationInitateFormMetaData } from "./metaData";
import { useMutation } from "react-query";
import { initiateVerificationAPI } from "../api";
import { useSnackbar } from "notistack";

interface InititateDocumentUploadAPIType {
  formData: any;
  endSubmit?: any;
}

const InititateDocumentUploadAPI = (initiateDocsAPIFn) => async ({
  formData,
}: InititateDocumentUploadAPIType) => {
  return initiateDocsAPIFn(formData);
};

export const APIInterfaceForm = ({
  refID,
  moduleType,
  closeDialog,
  isDataChangedRef,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const inititateAPIMutation = useMutation(
    InititateDocumentUploadAPI(initiateVerificationAPI({ refID })),
    {
      onError: (error: any, { endSubmit }) => {
        let errorMsg = error?.error_msg ?? "Unknown Error occured";
        endSubmit(false, errorMsg, error?.error_detail ?? "");
      },
      onSuccess: (data, { endSubmit }) => {
        endSubmit(true, "");
        isDataChangedRef.current = true;
        enqueueSnackbar("API Successfully Initialized", {
          variant: "success",
        });
        closeDialog();
      },
    }
  );

  const formHandleSubmit = (formData, displayFormData, endSubmit) => {
    inititateAPIMutation.mutate({ formData, endSubmit: endSubmit });
  };
  if (verificationInitateFormMetaData.form) {
    verificationInitateFormMetaData.form.formState = { refID };
  }

  return (
    <FormWrapper
      metaData={verificationInitateFormMetaData as MetaDataType}
      initialValues={{}}
      onSubmitHandler={formHandleSubmit}
      displayMode={"new"}
      disableGroupErrorDetection={true}
      disableGroupExclude={true}
    >
      {({ isSubmitting, handleSubmit }) => {
        return (
          <>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              Inititate
            </Button>
            <Button onClick={closeDialog} disabled={isSubmitting}>
              Cancel
            </Button>
          </>
        );
      }}
    </FormWrapper>
  );
};
