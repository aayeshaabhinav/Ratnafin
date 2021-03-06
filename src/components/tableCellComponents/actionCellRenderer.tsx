import { filterAction } from "components/dataTable/utils";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";

export const ActionCellRenderer = ({
  column: { actions },
  row,
  setGridAction,
  singleActions,
}) => {
  const setAction = (actionName) => {
    setGridAction({
      name: actionName,
      rows: [
        {
          data: row?.original,
          id: row?.id,
        },
      ],
    });
  };
  if (!Array.isArray(actions)) {
    actions = [actions];
  }
  singleActions = singleActions.filter((one) => {
    return actions.indexOf(one?.actionName) >= 0;
  });
  if (singleActions.length > 0) {
    singleActions = filterAction(singleActions, [row], false);
  }
  return (
    <ButtonGroup size="small" aria-label="actions">
      {singleActions.map((one) => (
        <Button onClick={() => setAction(one.actionName)}>
          {one.actionLabel}
        </Button>
      ))}
    </ButtonGroup>
  );
};
