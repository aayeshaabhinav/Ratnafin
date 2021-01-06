import { useEffect, useState, FC } from "react";
import { GridMetaDataType, ActionTypes } from "./types";
import {
  attachCellComponentsToMetaData,
  attachFilterComponentToMetaData,
  attachAlignmentProps,
  extractHiddenColumns,
  sortColumnsBySequence,
  transformHeaderFilters,
} from "./utils";
import { APISDK } from "registry/fns/sdk";
import { GirdController } from "./gridController";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

export const GridWrapper: FC<{
  gridCode: string;
  actions?: ActionTypes[];
  setAction: any;
}> = ({ gridCode, actions, setAction }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [metaData, setMetaData] = useState<GridMetaDataType | null>();

  useEffect(() => {
    APISDK.fetchGridMetaData(gridCode)
      .then((result) => {
        if (result.status === "success") {
          let finalData = transformMetaData({
            metaData: result.data,
            actions,
            setAction,
          });
          setMetaData(finalData);
          setError(false);
          setLoading(false);
        } else {
          setMetaData(result.data);
          setError(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        setLoading(false);
        setError(true);
        setMetaData(err);
      });
  }, []);

  return loading ? (
    <span>{"loading..."}</span>
  ) : error ? (
    <span>{"error loading grid"}</span>
  ) : (
    <DndProvider backend={HTML5Backend}>
      <GirdController
        metaData={metaData as GridMetaDataType}
        gridCode={gridCode}
      />
    </DndProvider>
  );
};

const transformMetaData = ({
  metaData: freshMetaData,
  actions,
  setAction,
}): GridMetaDataType => {
  let metaData = JSON.parse(JSON.stringify(freshMetaData)) as GridMetaDataType;

  let columns = metaData.columns as any;
  //make sure extract functions are called before attach and lastly sort
  const hiddenColumns = extractHiddenColumns(columns);
  columns = attachCellComponentsToMetaData(columns);
  columns = attachFilterComponentToMetaData(columns);
  columns = attachAlignmentProps(columns);
  columns = sortColumnsBySequence(columns);
  let headerFilters = transformHeaderFilters(metaData?.headerFilters);
  console.log(headerFilters);
  return {
    columns: columns,
    gridConfig: metaData.gridConfig,
    hiddenColumns: hiddenColumns,
    headerFilters: headerFilters,
    actions: actions,
    setAction: setAction,
  };
};
