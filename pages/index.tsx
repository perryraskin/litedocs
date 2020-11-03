import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"

import Store from "../components/Store"
import HomePage from "./home"

interface Props {}

const Index: NextPage<Props> = ({}) => {
  return (
    <Store>
      <HomePage />
    </Store>
  )
}

export default Index
