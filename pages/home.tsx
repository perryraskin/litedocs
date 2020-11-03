import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"
import {
  MagicContext,
  LoggedInContext,
  LoadingContext
} from "../components/Store"

import Section from "../components/Layout/Section"
import Home from "../components/Home/Home"
import Login from "../components/Forms/Login"
import Store from "../components/Store"

interface Props {}

const HomePage: NextPage<Props> = ({}) => {
  const [loggedIn, setLoggedIn] = useContext(LoggedInContext)
  const [isLoading, setIsLoading] = useContext(LoadingContext)

  if (isLoading) {
    return (
      <Section>
        <img
          className="ml-auto mr-auto block text-center"
          width="150"
          src="https://i1.wp.com/hubbravissimo.com/wp-content/uploads/2019/07/fff16-862c4e_80c174747b704e778f110260a995cc97mv2.gif?ssl=1"
        ></img>
      </Section>
    )
  } else if (loggedIn) return <Home />
  else return <Login />
}

export default HomePage
