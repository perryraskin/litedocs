import React from "react"
import { NextPage } from "next"
import Link from "next/link"
import Router from "next/router"

import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

import Section from "../Layout/Section"

interface Props {}

const Landing: NextPage<Props> = ({}) => {
  return (
    <Section extend="text-center">
      <h1>
        <span className="font-light">Lite</span>Docs
      </h1>
      <p>A super simple documentation platform</p>
    </Section>
  )
}

export default Landing
