import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"
import Router from "next/router"
import { MagicContext, LoggedInContext, LoadingContext } from "../Store"

import NewDocForm from "../Forms/NewDocForm"
import Section from "../Layout/Section"
import Login from "../Forms/Login"
import Store from "../Store"

interface Props {}

const NewEntry: NextPage<Props> = ({}) => {
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
  } else if (loggedIn) return <NewDocForm />
  else return <Login />
}

export default NewEntry
