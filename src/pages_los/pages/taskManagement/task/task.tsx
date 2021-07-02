import { useState, useRef, Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import {
  ServerGrid,
  ServerGridContextProvider,
} from "pages_los/common/serverGrid";
import { ClearCacheProvider } from "cache";
import { serverGridContextGenerator } from "../context";
import { AssignTask, TaskViewEdit } from "./taskCRUD";
import { HistoryGrid } from "pages_los/pages/taskManagement/task/history";
import { InvalidAction } from "pages_los/common/invalidAction";

export const Task = ({ gridCode, actions }: any) => {
  const [currentAction, setCurrentAction] = useState<null | any>(null);
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const handleDialogClose = () => {
    setCurrentAction(null);
    if (isDataChangedRef.current === true) {
      isDataChangedRef.current = true;
      myGridRef?.current?.fetchData?.();
      isDataChangedRef.current = false;
    }
  };
  return (
    <Fragment>
      <ServerGridContextProvider {...serverGridContextGenerator(gridCode)}>
        <ServerGrid
          gridCode={gridCode}
          actions={actions}
          setAction={setCurrentAction}
          ref={myGridRef}
        />
      </ServerGridContextProvider>
      <Dialog
        open={currentAction !== null}
        onClose={handleDialogClose}
        maxWidth="md"
      >
        <ClearCacheProvider>
          {(currentAction?.name ?? "") === "AddTask" ? (
            <Fragment>
              <AssignTask
                moduleType="task"
                isDataChangedRef={isDataChangedRef}
                closeDialog={handleDialogClose}
              />
            </Fragment>
          ) : (currentAction?.name ?? "") === "ViewDetails" ? (
            <Fragment>
              <TaskViewEdit
                taskID={currentAction?.rows[0].id}
                inquiryFor={currentAction?.rows[0]?.data?.flag.toLocaleLowerCase()}
                refID={currentAction?.rows[0].data?.ref_id}
                moduleType="task"
                isDataChangedRef={isDataChangedRef}
                closeDialog={handleDialogClose}
                readOnly={false}
                disableCache={false}
              />
            </Fragment>
          ) : (currentAction?.name ?? "") === "TaskHistory" ? (
            <Fragment>
              <HistoryGrid
                taskID={currentAction?.rows[0].id}
                moduleType="task"
                closeDialog={handleDialogClose}
                currentAction={currentAction}
              />
            </Fragment>
          ) : (
            <InvalidAction closeDialog={handleDialogClose} />
          )}
        </ClearCacheProvider>
      </Dialog>
    </Fragment>
  );
};
