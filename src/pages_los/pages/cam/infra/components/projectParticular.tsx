import { Default, Amount, Percentage } from "pages_los/pages/cam/components";
export const ProjectParticularDetails = ({ projectParticular }) => {
  const meansOfFiance = projectParticular.filter(
    (one) => one.particularType === "Total Means of Finance"
  );
  const costOfProject = projectParticular.filter(
    (one) => one.particularType === "Total Cost of Project"
  );
  return (
    <>
      <tr>
        <Default
          colspan={9}
          className="form-sub-heading"
          align="center"
          value="Cost of the Project"
          element="th"
        />
      </tr>
      <tr>
        <Default colspan={1} element="th" value="Sr.No" />
        <Default colspan={1} element="th" value="Particulars" />
        <Default colspan={1} element="th" value="Total Cost" align="right" />
        <Default colspan={2} element="th" value="Cost Incurred" align="right" />
        <Default
          colspan={2}
          element="th"
          value="Cost per Sq. Feet"
          align="right"
        />
        <Default colspan={2} element="th" value="% of Total Cost" />
      </tr>
      {Array.isArray(costOfProject) &&
        costOfProject.map((projectDetail, index) => (
          <tr key={index}>
            <Default colspan={1} value={index + 1} />
            <Default colspan={1} value={projectDetail?.particulars} />
            <Amount colspan={1} value={projectDetail?.totalCost} />
            <Amount colspan={2} value={projectDetail?.costIncurred} />
            <Amount colspan={2} value={projectDetail?.costPerSquareFeet} />
            <Percentage
              colspan={2}
              value={projectDetail?.totalCostPercentage}
            />
          </tr>
        ))}
      <MeansOfFinnaceProjectDetails projectParticular={meansOfFiance} />
    </>
  );
};

export const MeansOfFinnaceProjectDetails = ({ projectParticular }) => {
  return (
    <>
      <tr>
        <Default
          colspan={9}
          className="form-sub-heading"
          align="center"
          value="Means of Finance"
          element="th"
        />
      </tr>
      <tr>
        <Default colspan={1} element="th" value="Sr.No" />
        <Default colspan={2} element="th" value="Particulars" />
        <Default colspan={2} element="th" value="Total Amount" align="right" />
        <Default colspan={2} element="th" value="Funds Infused" align="right" />
        <Default colspan={2} element="th" value="% of Total Cost" />
      </tr>
      {Array.isArray(projectParticular) &&
        projectParticular.map((projectDetail, index) => (
          <tr key={index}>
            <Default colspan={1} value={index + 1} />
            <Default
              colspan={2}
              value={projectDetail?.meansOfFinanceParticulars}
            />
            <Amount colspan={2} value={projectDetail?.totalAmount} />
            <Amount colspan={2} vaue={projectDetail?.fundInfused} />
            <Percentage colspan={2} value={projectDetail.totalCostPercentage} />
          </tr>
        ))}
    </>
  );
};
