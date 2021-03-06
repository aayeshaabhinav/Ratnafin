import { Suspense, Fragment } from "react";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";

export const MyTabs = ({
  activeStep,
  filteredFieldGroups,
  steps,
  setActiveStep,
  formRenderConfig,
  defaultGroupName,
  fieldGroups,
  handlePrev,
  handleNext,
  handleSubmit,
  fieldGroupsActiveStatus,
  isLastActiveStep,
  stepsRenderer,
}) => {
  return (
    <Fragment>
      <Tabs
        value={Number(activeStep)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {filteredFieldGroups.map((field) => {
          return (
            <Tab
              value={Number(field.index)}
              key={field.name}
              label={field.name}
              onClick={() => setActiveStep(Number(field.index))}
              style={field.hasError ? { color: "red" } : {}}
            />
          );
        })}
      </Tabs>
      {typeof stepsRenderer === "function" ? (
        stepsRenderer({ steps })
      ) : (
        <Suspense fallback={<div>Loading...</div>}>{steps}</Suspense>
      )}
    </Fragment>
  );
};
