import React from "react"
import { NextPage } from "next"
import Link from "next/link"
import Router from "next/router"
import { MagicContext, LoggedInContext, LoadingContext } from "../Store"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

import Section from "../Layout/Section"

import { Team, Entry } from "../../models/interfaces"

interface Props {
  team?: Team
  handle?: string
  tag?: string
}

const TeamDocs: NextPage<Props> = ({ team, handle, tag }) => {
  const [magic, setMagic] = React.useContext(MagicContext)

  const user = magic.user.getMetadata()
  const [currentTeam, setCurrentTeam] = React.useState(null)
  async function fetchTeamRequest() {
    let res = await fetch(`/api/team/${handle}?tag=${tag}`, {
      method: "GET"
    })
    const data = await res.json()
    console.log(data)
    const { authorized, team } = data
    if (authorized) {
      setCurrentTeam(team)
    } else Router.push("/")
  }

  React.useEffect(() => {
    fetchTeamRequest()
  }, [])
  return (
    <Section extend="mb-10">
      <div className="uppercase text-xxs font-semibold mb-4">
        <Link href="/teams">
          <a className=" hover:text-gray-500">Teams</a>
        </Link>{" "}
        /{" "}
        {handle ? (
          <Link href="/[handle]" as={`/${handle}`}>
            <a className=" hover:text-gray-500">{handle}</a>
          </Link>
        ) : null}
      </div>
      <div>
        <img width="100" src={currentTeam ? currentTeam.imageUrl : ""}></img>
      </div>
      <div>
        <h2 className="mt-6 text-3xl leading-9 font-extrabold">Docs</h2>
      </div>
      <Link
        href={{
          pathname: "/[handle]/new",
          query: { teamId: currentTeam ? currentTeam.Id : "" }
        }}
        as={`/${currentTeam ? currentTeam.handle : ""}/new`}
      >
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
            New
          </button>
        </a>
      </Link>
      <div className="flex flex-col mt-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b bg-white border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Tags
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Date Added
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Date Updated
                    </th>
                    {/* <th className="px-6 py-3 bg-gray-50"></th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentTeam
                    ? currentTeam.Entries.map((entry: Entry) => {
                        return (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm leading-5 font-medium">
                                    <Link
                                      href="/entry/[entryid]"
                                      as={`/entry/${entry.id}`}
                                    >
                                      <a className="text-gray-900">
                                        {entry.title}
                                      </a>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm w-48 whitespace-nowrap flex flex-row overflow-x-auto leading-5 text-gray-900">
                                {entry.tagsText.split(",").map(tag => {
                                  return (
                                    <span
                                      key={tag}
                                      className="px-2 inline-flex text-xs leading-5 
                                font-semibold rounded-full bg-blue-600 text-white mr-2"
                                    >
                                      {tag}
                                    </span>
                                  )
                                })}
                              </div>
                              {/* <div className="text-sm leading-5 text-gray-500">
                          Optimization
                        </div> */}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm leading-5 text-gray-900">
                                {dayjs
                                  .utc(entry.createdAt)
                                  .format("MM/DD/YYYY")}
                              </div>
                            </td>
                            <td className="text-sm px-6 py-4 whitespace-nowrap">
                              {dayjs
                                .utc(entry.dateUpdated)
                                .format("MM/DD/YYYY")}
                            </td>
                            {/* <td
                              className="px-6 py-4 whitespace-nowrap text-right 
                            text-sm leading-5 font-medium"
                            >
                              <Link
                                href="/trip/[tripid]/edit"
                                as={`/trip/${trip.id}/edit`}
                              >
                                <a className="text-blue-600 hover:text-blue-900 mr-4">
                                  Edit
                                </a>
                              </Link>
                              <a
                                href="#"
                                className="text-red-600 hover:text-red-900"
                                onClick={() => confirmDelete(trip.id)}
                              >
                                Delete
                              </a>
                            </td> */}
                          </tr>
                        )
                      })
                    : null}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default TeamDocs
