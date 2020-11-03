import React from "react"
import { NextPage } from "next"
import Link from "next/link"
import Router from "next/router"
import { Magic } from "magic-sdk"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)

import Section from "../Layout/Section"

import { Entry } from "../../models/interfaces"

interface Props {}

const Entries: NextPage<Props> = ({}) => {
  const magicKey = process.env.MAGIC_PUBLIC_KEY
    ? process.env.MAGIC_PUBLIC_KEY
    : "pk_live_BA415260994A4F66"
  const magic = new Magic(magicKey)

  const user = magic.user.getMetadata()
  const [currentEntries, setCurrentEntries] = React.useState(null)
  async function fetchEntriesRequest() {
    let res = await fetch(`/api/user/${(await user).issuer}/entries`, {
      method: "GET"
    })
    const data = await res.json()
    const { entries } = data
    setCurrentEntries(entries)
  }

  React.useEffect(() => {
    fetchEntriesRequest()
  }, [])
  return (
    <Section extend="mb-10">
      <div>
        <h2 className="mt-6 text-3xl leading-9 font-extrabold">Entries</h2>
      </div>
      <div className="flex flex-col mt-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
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
                  {currentEntries
                    ? currentEntries.map((entry: Entry) => {
                        return (
                          <tr key={entry.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-no-wrap">
                              <div className="flex items-center">
                                <div className="ml-4">
                                  <div className="text-sm leading-5 font-medium">
                                    <Link
                                      href="/entry/[entryid]/edit"
                                      as={`/entry/${entry.id}/edit`}
                                    >
                                      <a className="text-gray-900">
                                        {entry.title}
                                      </a>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-no-wrap">
                              <div className="text-sm leading-5 text-gray-900">
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
                            <td className="px-6 py-4 whitespace-no-wrap">
                              <div className="text-sm leading-5 text-gray-900">
                                {dayjs
                                  .utc(entry.createdAt)
                                  .format("MM/DD/YYYY")}
                              </div>
                            </td>
                            <td className="text-sm px-6 py-4 whitespace-no-wrap">
                              {dayjs
                                .utc(entry.dateUpdated)
                                .format("MM/DD/YYYY")}
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

export default Entries
