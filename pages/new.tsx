import React, { useState, useEffect, useContext } from "react"
import { NextPage } from "next"
import NewDocForm from "../components/Forms/NewDocForm"

interface Props {}

const NewDoc: NextPage<Props> = ({}) => {
  return <NewDocForm />
}

export default NewDoc
