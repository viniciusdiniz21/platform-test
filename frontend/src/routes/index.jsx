import React from 'react'
import Register from '../Pages/Login/Register';
import { createBrowserRouter, redirect } from 'react-router-dom';
import Login from '../Pages/Login/Login';
import Map from '../Pages/Map/Map';
import Cookies from 'js-cookie';

function loaderAuthenticacao() {
    let auth = Cookies.get("access_token");
    if (auth) {
      return true;
    } else {
      return redirect("/login");
    }
  }

  export const router = createBrowserRouter([
    {
      path: "/*",
      element: <Map />,
      loader: loaderAuthenticacao,
    },
    {
      path: "login",
      element: <Login />,
      loader: () => {
        let tkn = Cookies.get("access_token");
        let auth = tkn ? true : false;
        if (auth) {
          return redirect("../");
        }
        return auth;
      },
    },
    {
      path: "cadastrar",
      element: <Register />,
    },
  ]);