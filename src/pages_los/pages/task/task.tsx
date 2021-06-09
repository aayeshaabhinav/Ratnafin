import { useState, useRef, Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import {
  ServerGrid,
  ServerGridContextProvider,
} from "pages_los/common/serverGrid";
import { ClearCacheProvider } from "cache";
import { Transition } from "pages_los/common";
import { serverGridContextGenerator } from "./context";
import { AssignTask } from "./assignTask";

export const Task = ({ gridCode, actions }: any) => {
  const [currentAction, setCurrentAction] = useState<null | any>(null);
  const isDataChangedRef = useRef(false);
  const myGridRef = useRef<any>(null);
  const handleDialogClose = () => {
    setCurrentAction(null);
    if (isDataChangedRef.current) {
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
        fullScreen={
          ["ViewDetails", "EditTask", "AddTask"].indexOf(currentAction?.name) >=
          0
            ? true
            : false
        }
        open={currentAction !== null}
        //@ts-ignore
        TransitionComponent={Transition}
        onClose={handleDialogClose}
        key={currentAction?.rows[0].id}
        maxWidth="md"
        PaperProps={{ style: { width: "100%", height: "100%" } }}
      >
        <ClearCacheProvider key={currentAction?.rows[0].id}>
          {(currentAction?.name ?? "") === "AddTask" ? (
            <Fragment key={currentAction?.rows[0].id}>
              <AssignTask
                moduleType="task"
                refID={currentAction?.rows[0].id}
                isDataChangedRef={isDataChangedRef}
                closeDialog={() => {}}
              />
            </Fragment>
          ) : null}
        </ClearCacheProvider>
      </Dialog>
    </Fragment>
  );
};
