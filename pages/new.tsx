import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"

import NewEntry from "../components/NewEntry/NewEntry"
import Store from "../components/Store"

interface Props {}

const NewEntryPage: NextPage<Props> = ({}) => {
  return (
    <Store>
      <NewEntry />
    </Store>
  )
}

export default NewEntryPage
