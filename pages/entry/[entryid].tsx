import React, { useState, useEffect, useContext } from "react"
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next"
//import absoluteUrl from "next-absolute-url"

import EntryLayout from "../../components/Entry/EntryLayout"

import { Entry } from "../../models/interfaces"

interface Props {
  entry?: Entry
  entryid: string
  errors?: any
}

const TeamPage: NextPage<Props> = ({
  entry,
  entryid,
  errors
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <EntryLayout entryId={entryid} />
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { req, params } = ctx
  console.log("params:", params)
  const { entryid } = params
  // const { origin } = absoluteUrl(req)
  // const apiUrl = `${origin}/api/trip/${entryid}`
  // const apiUrl = `http://localhost:3000/api/trip/${entryid}`
  const apiUrl = `${process.env.BASE_URL}/api/entry/${entryid}`

  // const cookies = parseCookies(ctx)
  // const { sessionId } = cookies
  //console.log('cookies:', cookies);
  //console.log('sessionId:', sessionId);

  // const res = await fetch(apiUrl)
  // const resData = await res.json()
  // const { team } = resData
  // console.log("res:", team)

  if (entryid) {
    return {
      props: {
        entryid
      }
    }
  } else {
    return {
      props: {
        errors: "Not logged in!"
      }
    }
  }
}

export default TeamPage
