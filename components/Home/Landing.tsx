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
      <Link href={`/new`}>
        <a>
          <button
            type="button"
            className="mt-6 mb-6 inline-flex items-center px-4 py-2
              text-sm leading-5 font-bold rounded-md text-white mr-4
              bg-blue-600 hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue 
              focus:border-blue-700 active:bg-blue-700 transition duration-150 ease-in-out"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            New Entry
          </button>
        </a>
      </Link>
    </Section>
  )
}

export default Landing
