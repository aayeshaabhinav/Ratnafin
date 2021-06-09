import { forwardRef } from "react";
import { cloneDeep } from "lodash-es";
import { GridMetaDataType, ActionTypes } from "./types";
import {
  attachCellComponentsToMetaData,
  attachFilterComponentToMetaData,
  attachAlignmentProps,
  extractHiddenColumns,
  sortColumnsBySequence,
  SplitActions,
} from "./utils";
import { GirdController } from "./gridController";
import { GridProvider } from "./context";

interface GridWrapperPropsType {
  gridCode: any;
  getGridData: any;
  metaData: GridMetaDataType;
  actions?: ActionTypes[];
  setAction: any;
  defaultFilter?: any;
  defaultSortOrder?: any;
}

export const GridWrapper = forwardRef<GridWrapperPropsType, any>(
  (
    {
      gridCode,
      getGridData,
      metaData,
      actions,
      setAction,
      defaultFilter = [],
      defaultSortOrder = [],
    },
    ref
  ) => {
    let finalData = transformMetaData({
      metaData,
      actions,
      setAction,
    });

    return (
      <GridProvider gridCode={gridCode} getGridData={getGridData}>
        <GirdController
          //@ts-ignore
          ref={ref}
          metaData={finalData as GridMetaDataType}
          defaultFilter={defaultFilter}
          defaultSortOrder={defaultSortOrder}
        />
      </GridProvider>
    );
  }
);

const transformMetaData = ({
  metaData: freshMetaData,
  actions,
  setAction,
}): GridMetaDataType => {
  let metaData = cloneDeep(freshMetaData) as GridMetaDataType;
  //let metaData = JSON.parse(JSON.stringify(freshMetaData)) as GridMetaDataType;

  let columns = metaData.columns as any;
  //make sure extract functions are called before attach and lastly sort
  const hiddenColumns = extractHiddenColumns(columns);
  columns = attachCellComponentsToMetaData(columns);
  columns = attachFilterComponentToMetaData(columns);
  columns = attachAlignmentProps(columns);
  columns = sortColumnsBySequence(columns);

  const splittedActions = SplitActions(actions ?? null);
  return {
    columns: columns,
    gridConfig: metaData.gridConfig,
    hiddenColumns: hiddenColumns,
    setAction: setAction,
    ...splittedActions,
  };
};
