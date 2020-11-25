import { useState, Fragment } from "react";
import { Routes, Route, useParams } from "react-router-dom";
import { AppBar } from "./appBar";
import { MySideBar } from "./sideBar";
import { Drawer } from "./drawer";
import { Content } from "./content";
import { Theme, makeStyles } from "@material-ui/core/styles";

import {
  WrapperStyleProps,
  WrapperStyleNamesProps,
  wrapperStyles,
} from "./style";

import Dashboard from "./pages/dashboard";
import Lead from "./pages/lead";
import Profile from "./pages/profile";
import Iframe from "./pages/iframe";
import { DataGrid } from "components/dataGrid";
import { APITest } from "./pages/api";
import Login from "./pages/login";
import DynamicLead from "./pages/leads";

const useStyles = makeStyles<Theme, WrapperStyleProps>(wrapperStyles);

const DashbordPages = () => {
  const classes: WrapperStyleNamesProps = useStyles({} as WrapperStyleProps);
  const [drawerOpen, setDrawerState] = useState(true);
  const handleDrawerOpen = () => setDrawerState(true);
  const handleDrawerClose = () => setDrawerState(false);
  return (
    <Fragment>
      <div className={classes.root}>
        <AppBar open={drawerOpen} handleDrawerOpen={handleDrawerOpen} />
        <Drawer open={drawerOpen} handleDrawerClose={handleDrawerClose}>
          <MySideBar handleDrawerOpen={handleDrawerOpen} open={drawerOpen} />
        </Drawer>
        <Content>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Lead />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/iframe" element={<Iframe />} />
            <Route path="/dgrid" element={<DataGrid />} />
            <Route path="/api" element={<APITest />} />
            <Route path="/cam" element={<DynamicLead />} />
            <Route path="/pages/:id" element={<Dummy />} />
          </Routes>
        </Content>
      </div>
    </Fragment>
  );
};

const IndexPage = () => {
  return (
    <Fragment>
      <Routes>
        <Route path="/*" element={<DashbordPages />} />
        <Route path="/auth" element={<Login />} />
      </Routes>
    </Fragment>
  );
};

export default IndexPage;

function Dummy() {
  // We can use the `useParams` hook here to access
  // the dynamic pieces of the URL.
  let { id } = useParams();

  return (
    <div>
      <h3>ID: {id}</h3>
    </div>
  );
}