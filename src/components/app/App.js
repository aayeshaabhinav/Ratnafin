import { Fragment } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import SignIn from "./components/login/index.js";
import Dashboard from "./components/dashboard";

const App = () => {
  return (
    <Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login/*" element={<SignIn />} />
        </Routes>
      </Router>
    </Fragment>
  );
};

export default App;
