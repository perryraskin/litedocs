import React, { useState, useEffect, useContext } from "react"
import { NextPage, GetServerSideProps } from "next"

import NewEntry from "../../../components/NewEntry/NewEntry"

interface Props {}

const EditEntry: NextPage<Props> = ({}) => {
  return <NewEntry />
}

export default EditEntry
