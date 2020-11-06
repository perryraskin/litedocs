import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"
import Router from "next/router"
import withLayout from "../../hocs/withLayout"
import { MagicContext, LoggedInContext, LoadingContext } from "../Store"

import NewDocForm from "../Forms/NewDocForm"
import Section from "../Layout/Section"
import Login from "../Forms/Login"

import { Team } from "../../models/interfaces"

interface Props {
  handle?: string
}

const NewEntry: NextPage<Props> = ({ handle }) => {
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
  } else if (loggedIn) return <NewDocForm handle={handle} />
  else return <Login />
}

export default withLayout(NewEntry)
