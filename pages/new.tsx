import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"

import NewEntry from "../components/NewEntry/NewEntry"

interface Props {}

const NewEntryPage: NextPage<Props> = ({}) => {
  return <NewEntry />
}

export default NewEntryPage
