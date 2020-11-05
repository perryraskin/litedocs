import React from "react"
import { NextPage } from "next"
import Link from "next/link"
import Router from "next/router"
import withLayout from "../../hocs/withLayout"
import utilities from "../../utilities"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import { MagicContext, LoggedInContext, LoadingContext } from "../Store"

import Landing from "../Home/Landing"
import Login from "../Forms/Login"
import Section from "../Layout/Section"
import Teams from "./Teams"

interface Props {}

const TeamsLayout: NextPage<Props> = ({}) => {
  const [loggedIn, setLoggedIn] = React.useContext(LoggedInContext)
  const [isLoading, setIsLoading] = React.useContext(LoadingContext)

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
  } else if (loggedIn) {
    return <Teams />
  } else
    return (
      <React.Fragment>
        <Landing />
        <Login />
      </React.Fragment>
    )
}

export default withLayout(TeamsLayout)
