import React, { useState, useEffect, useContext } from "react"
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next"

import NewEntry from "../../components/NewEntry/NewEntry"

interface Props {
  handle?: string
  errors?: any
}

const NewTeamEntryPage: NextPage<Props> = ({ handle, errors }) => {
  return <NewEntry handle={handle} />
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { req, params } = ctx
  console.log("params:", params)
  const { handle } = params

  if (handle) {
    return {
      props: {
        handle
      }
    }
  } else {
    return {
      props: {
        errors: "Team not found"
      }
    }
  }
}

export default NewTeamEntryPage
