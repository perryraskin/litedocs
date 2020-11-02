import React, { useState, useEffect, useContext } from "react"
import { NextPage, GetServerSideProps } from "next"

import NewDocForm from "../../../components/Forms/NewDocForm"

interface Props {}

const EditEntry: NextPage<Props> = ({}) => {
  return <NewDocForm />
}

export default EditEntry
