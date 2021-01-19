import { ActionTypes } from "../types";

export const SplitActions = (actions: ActionTypes[] | null) => {
  if (Array.isArray(actions) && actions.length > 0) {
    const multipleActions = actions.filter((one) => one.multiple === true);
    const singleActions = actions.filter((one) => one.multiple === false);
    const doubleClickAction = actions.filter(
      (one) => one.rowDoubleClick === true
    );
    return {
      multipleActions: multipleActions,
      singleActions: singleActions,
      doubleClickAction: doubleClickAction[0] ?? false,
    };
  } else {
    return {
      multipleActions: [] as ActionTypes[],
      singleActions: [] as ActionTypes[],
      doubleClickAction: false as boolean,
    };
  }
};
