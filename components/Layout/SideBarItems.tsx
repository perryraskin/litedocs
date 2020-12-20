import * as React from "react"
import Router from "next/router"
import { useContext, useState, useEffect, useRef } from "react"
import { MagicContext, LoggedInContext, LoadingContext } from "../Store"

import { NextPage } from "next"
import Link from "next/link"

import {
  viewGridIcon,
  documentsIcon,
  userGroupIcon,
  hashtagIcon
} from "../SVG/Heroicons"

import { User, Member, Team, Tag } from "../../models/interfaces"

interface SideBarItemsProps {
  teamTagsList: Array<TeamTags>
}

interface TeamTags {
  team: string
  tags: Array<Tag>
}

const SideBarItems: NextPage<SideBarItemsProps> = ({ teamTagsList }) => {
  const [currentPath, setCurrentPath] = useState("")

  useEffect(() => {
    const pathName = window.location.pathname
    if (pathName) {
      setCurrentPath(pathName)
    }
  }, [])
  return (
    <>
      <ul>
        <li>
          <Link href="/">
            <a
              href="/"
              className={`mb-1 px-2 py-2 rounded-lg flex items-center font-medium 
            focus:outline-none focus:text-white focus:bg-gray-700 hover:text-white
            ${
              currentPath === "/"
                ? "text-white bg-gray-900"
                : "text-gray-300 hover:bg-gray-700"
            }`}
            >
              {viewGridIcon(24, 24, "mr-4 opacity-50")}
              Dashboard
            </a>
          </Link>
        </li>

        <li>
          <Link href="/me">
            <a
              href="/me"
              className={`mb-1 px-2 py-2 rounded-lg flex items-center font-medium 
            focus:outline-none focus:text-white focus:bg-gray-700 hover:text-white
            ${
              currentPath === "/me"
                ? "text-white bg-gray-900"
                : "text-gray-300 hover:bg-gray-700"
            }`}
            >
              {documentsIcon(24, 24, "mr-4 opacity-50")}
              Personal
            </a>
          </Link>
        </li>

        <li>
          <Link href="/teams">
            <a
              href="/teams"
              className={`mb-1 px-2 py-2 rounded-lg flex items-center font-medium 
              focus:outline-none focus:text-white focus:bg-gray-700 hover:text-white
            ${
              currentPath === "/teams"
                ? "text-white bg-gray-900"
                : "text-gray-300 hover:bg-gray-700"
            }`}
            >
              {userGroupIcon(24, 24, "mr-4 opacity-50")}
              Teams
            </a>
          </Link>
        </li>

        {/* <li>
        <Link href="/settings">
          <a
            href="/settings"
            className={`mb-1 px-2 py-2 rounded-lg flex items-center font-medium 
                  
                  text-white 
            focus:outline-none focus:text-white focus:bg-gray-700 hover:text-white
            ${
              currentPath === "/settings"
                ? "text-white bg-gray-900"
                : "text-gray-300 hover:bg-gray-700"
            }`}
          >
            {gearIcon(24, 24, "mr-4 opacity-50")}
            Settings
          </a>
        </Link>
      </li> */}
      </ul>
      {teamTagsList.map((teamTags: TeamTags) => (
        <div key={teamTags.team}>
          <a href={`/${teamTags.team}`}>
            <h3
              className={`mt-2 mb-0 px-2 py-2 rounded-lg flex items-center font-semibold text-white 
            focus:outline-none hover:bg-gray-700 focus:text-white 
            focus:bg-gray-700 hover:text-white
            uppercase tracking-wider text-xs`}
            >
              {teamTags.team}
            </h3>
          </a>
          <div>
            {teamTags.tags.map((tag: Tag) => (
              <a
                key={tag.id}
                href={`?tag=${tag.name}`}
                className={`px-2 py-1 rounded-lg flex items-center font-medium text-sm
        text-gray-300 hover:bg-gray-700 focus:outline-none focus:text-white 
        focus:bg-gray-700 hover:text-white`}
              >
                {hashtagIcon(20, 20, "mr-2 opacity-50")}
                {tag.name}
              </a>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}

export default SideBarItems
