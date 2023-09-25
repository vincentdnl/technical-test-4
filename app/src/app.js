import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom";

import Loader from "./components/loader";
import { setUser } from "./redux/auth/actions";

import Activity from "./scenes/activity";
import Auth from "./scenes/auth";
import Project from "./scenes/project";
import User from "./scenes/user";

import Account from "./scenes/account";

import Drawer from "./components/drawer";
import Header from "./components/header";

import api from "./services/api";

import "./index.css";
import Home from "./scenes/home";

const App = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.Auth.user);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await api.get("/user/signin_token");
        if (!res.ok || !res.user) return setLoading(false);
        if (res.token) api.setToken(res.token);
        dispatch(setUser(res.user));
      } catch (e) {
        console.log(e);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="flex h-screen flex-col">
      <Router>
        {user && <Header />}
        <div className="flex flex-grow overflow-hidden">
          {user && <Drawer />}
          <div className="flex-1 flex flex-col">
            <main className="flex-1 overflow-y-scroll">
              <Switch>
                <Route path="/auth" component={Auth} />
                <RestrictedRoute path="/user" component={User} />

                <RestrictedRoute path="/activity" component={Activity} />

                <RestrictedRoute path="/account" component={Account} />
                <RestrictedRoute path="/project" component={Project} />
                <RestrictedRoute path="/" component={Home} />
              </Switch>
            </main>
          </div>
        </div>
      </Router>
    </div>
  );
};

const RestrictedRoute = ({ component: Component, role, ...rest }) => {
  const user = useSelector((state) => state.Auth.user);
  if (!user) return <Redirect to={{ pathname: "/auth" }} />;
  return <Route {...rest} render={(props) => (user ? <Component {...props} /> : <Redirect to={{ pathname: "/auth" }} />)} />;
};

export default App;
