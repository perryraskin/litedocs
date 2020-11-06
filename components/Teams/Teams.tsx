import React from "react"
import { NextPage } from "next"
import Link from "next/link"
import Router from "next/router"
import { MagicContext, LoggedInContext, LoadingContext } from "../Store"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

import Section from "../Layout/Section"

import { Member } from "../../models/interfaces"

interface Props {}

const Teams: NextPage<Props> = ({}) => {
  const [magic, setMagic] = React.useContext(MagicContext)

  const user = magic.user.getMetadata()
  const [memberships, setMemberships] = React.useState(null)
  async function fetchEntriesRequest() {
    let res = await fetch(`/api/user/${(await user).issuer}/teams`, {
      method: "GET"
    })
    const data = await res.json()
    console.log(data)
    const { memberships } = data
    setMemberships(memberships)
  }

  React.useEffect(() => {
    fetchEntriesRequest()
  }, [])
  return (
    <Section extend="mb-10">
      <div>
        <h2 className="mt-6 text-3xl leading-9 font-extrabold">Teams</h2>
      </div>
      <div className="flex flex-col mt-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Handle
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                      Date Joined
                    </th>
                    {/* <th className="px-6 py-3 bg-gray-50"></th> */}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {memberships
                    ? memberships.map((membership: Member) => {
                        return (
                          <tr key={membership.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-no-wrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img
                                    className="h-10 w-10 rounded-full"
                                    src={membership.Team.imageUrl}
                                    alt=""
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm leading-5 font-medium">
                                    <Link
                                      href="/[handle]"
                                      as={`/${membership.Team.handle}`}
                                    >
                                      <a className="text-gray-900">
                                        {membership.Team.name}
                                      </a>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                              <div className="text-sm leading-5 text-gray-900">
                                {membership.Team.handle}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                              <div className="text-sm leading-5 text-gray-900">
                                {dayjs
                                  .utc(membership.createdAt)
                                  .format("MM/DD/YYYY")}
                              </div>
                            </td>
                            {/* <td
                              className="px-6 py-4 whitespace-no-wrap text-right 
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

export default Teams
