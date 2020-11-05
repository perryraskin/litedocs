import React, { useState, useEffect, useContext } from "react"
import { NextPage, GetServerSideProps, InferGetServerSidePropsType } from "next"
//import absoluteUrl from "next-absolute-url"

import TeamLayout from "../components/Team/TeamLayout"

import { Team } from "../models/interfaces"

interface Props {
  team?: Team
  handle: string
  errors?: any
}

const TeamPage: NextPage<Props> = ({
  team,
  handle,
  errors
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <TeamLayout handle={handle} />
}

export const getServerSideProps: GetServerSideProps = async ctx => {
  const { req, params } = ctx
  console.log("params:", params)
  const { handle } = params
  // const { origin } = absoluteUrl(req)
  // const apiUrl = `${origin}/api/trip/${handle}`
  // const apiUrl = `http://localhost:3000/api/trip/${handle}`
  const apiUrl = `${process.env.BASE_URL}/api/team/${handle}`

  // const cookies = parseCookies(ctx)
  // const { sessionId } = cookies
  //console.log('cookies:', cookies);
  //console.log('sessionId:', sessionId);

  // const res = await fetch(apiUrl)
  // const resData = await res.json()
  // const { team } = resData
  // console.log("res:", team)

  if (handle) {
    return {
      props: {
        handle
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
