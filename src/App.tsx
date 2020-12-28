import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
// import Live from "./Live";
import LiveNG from './LiveNG'


const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        {/* <Route exact path="/:id" component={Live} /> */}
        <Route exact path="/:id" component={LiveNG} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
