import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"
import Login from "../components/Forms/Login"
import Store from "../components/Store"

interface Props {}

const LoginPage: NextPage<Props> = ({}) => {
  return (
    <Store>
      <Login />
    </Store>
  )
}

export default LoginPage
