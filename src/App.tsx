import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Live from "./Live";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/:id" component={Live} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
