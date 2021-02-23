import { Fragment } from "react";
import { DocumentGridCRUD as DocGrid } from "./documentGridCRUD";
import { DOCCRUDContextProvider } from "./context";
import { LOSSDK } from "registry/fns/los";
import { gridMetaData, columnsMetaData, gridEditMetaData } from "./meta";

const DocAPICrud = (moduleType, docCategory, refID) => ({
  uploadDocuments: {
    fn: LOSSDK.uploadDocuments,
    args: { moduleType, docCategory, refID },
  },
  getDocumentsGridData: {
    fn: LOSSDK.listingDocuments,
    args: { moduleType, docCategory, refID },
  },
  deleteDocuments: {
    fn: LOSSDK.deleteDocuments,
    args: { moduleType, docCategory, refID },
  },
  updateDocument: {
    fn: LOSSDK.updateDocuments,
    args: { moduleType, docCategory, refID },
  },
  verifyDocuments: {
    fn: LOSSDK.deleteDocuments,
    args: { moduleType, docCategory, refID },
  },
});

export const DocumentGridCRUD = () => {
  return (
    <Fragment>
      <DOCCRUDContextProvider {...DocAPICrud("lead", "bank", "89")}>
        <DocGrid
          gridMetaData={gridMetaData}
          gridEditMetaData={gridEditMetaData}
          uploadColumnsMetaData={columnsMetaData}
          gridProps={{ refID: "89" }}
        />
      </DOCCRUDContextProvider>
    </Fragment>
  );
};
