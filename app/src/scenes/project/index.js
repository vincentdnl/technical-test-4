import React from "react";
import { Route, Switch } from "react-router-dom";

import Edit from "./edit";
import ProjectList from "./list";
import ProjectView from "./view";

export default () => {
  return (
    <Switch>
      <Route path="/project/edit/:id" component={Edit} />
      <Route path="/project/:id" component={ProjectView} />
      <Route path="/" component={ProjectList} />
    </Switch>
  );
};
