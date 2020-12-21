import React from "react"
import { NextPage } from "next"
import Link from "next/link"
import Router from "next/router"
import { MagicContext, LoggedInContext, LoadingContext } from "../Store"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import styled from "styled-components"
import DataTable, { defaultThemes } from "react-data-table-component"

import Section from "../Layout/Section"

import { User, Log, Team } from "../../models/interfaces"

interface Props {}

const Dashboard: NextPage<Props> = ({}) => {
  const now = dayjs()
  const [myActivity, setMyActivity] = React.useState(new Array<Log>())
  const [teamActivity, setTeamActivity] = React.useState([])

  async function getLogs() {
    let res = await fetch(`/api/user`)
    let data = await res.json()
    const user = data.user

    let resLogs = await fetch(`/api/user/${user.issuer}/dashboard`)
    let dataLogs = await resLogs.json()
    console.log("logs:", dataLogs)
    if (dataLogs.authorized) {
      setMyActivity(dataLogs.logs)
      setTeamActivity(dataLogs.teamLogs)
    }
  }

  React.useEffect(() => {
    getLogs()
  }, [])

  const activityStyles = {
    header: {
      style: {
        minHeight: "56px",
        fontSize: "14px",
        letterSpacing: ".05em",
        textTransform: "uppercase",
        color: "rgba(113,128,150,1)",
        top: 0,
        position: "sticky",
        paddingLeft: "1.5rem",
        paddingRight: "1.5rem",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        fontWeight: 900
      }
    },
    headRow: {
      style: {
        borderTopStyle: "solid",
        borderTopWidth: "1px",
        borderBottomWidth: "2px",
        borderTopColor: defaultThemes.default.divider.default
      }
    },
    headCells: {
      style: {
        letterSpacing: ".05em",
        textTransform: "uppercase",
        color: "rgba(113,128,150,1)",
        top: 0,
        position: "sticky",
        // paddingLeft: "1.5rem",
        // paddingRight: "1.5rem",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
        fontSize: "0.75rem",
        fontWeight: 700,
        borderBottomWidth: "1px",
        borderColor: "rgba(237,242,247,1)",
        backgroundColor: "rgba(247,250,252,1)"
      }
    },
    cells: {
      style: {
        // "&:not(:last-of-type)": {
        //   borderTopWidth: "0px",
        //   borderBottomWidth: "1px",
        //   borderStyle: "dashed",
        //   borderColor: "rgba(237,242,247,1)"
        // }
      }
    }
  }

  const activityData = myActivity
  const activityColumns = [
    {
      name: "Date/Time",
      sortable: true,
      cell: (row: Log) => (
        <div>{dayjs(row.createdAt).format("MM/DD/YYYY h:mm A")}</div>
      )
    },
    {
      name: "Documentation",
      sortable: true,
      cell: (row: Log) => (
        <Link href="/entry/[entryid]" as={`/entry/${row.Entry.id}`}>
          <a className="text-blue-600">{row.Entry.title}</a>
        </Link>
      )
    },
    {
      name: "Action",
      sortable: false,
      cell: (row: Log) => <div>{row.note}</div>
    },
    {
      name: "Team",
      sortable: false,
      cell: (row: Log) => <div>{row.Entry.Team ? row.Entry.Team.name : ""}</div>
    }
  ]

  const teamActivityColumns = [
    {
      name: "Date/Time",
      sortable: true,
      cell: (row: Log) => (
        <div>{dayjs(row.createdAt).format("MM/DD/YYYY h:mm A")}</div>
      )
    },
    {
      name: "Documentation",
      sortable: true,
      cell: (row: Log) => (
        <Link href="/entry/[entryid]" as={`/entry/${row.Entry.id}`}>
          <a className="text-blue-600">{row.Entry.title}</a>
        </Link>
      )
    },
    {
      name: "Action",
      sortable: false,
      cell: (row: Log) => <div>{row.note}</div>
    },
    {
      name: "Author",
      sortable: false,
      cell: (row: Log) => <div>{row.User.name}</div>
    }
  ]
  return (
    <Section extend="mb-10">
      <div className="mt-6 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white">
        <div className="">
          <DataTable
            title="My Activity"
            columns={activityColumns}
            data={activityData}
            customStyles={activityStyles}
            pagination
            dense
          />
        </div>
      </div>
      {teamActivity.map(teamLogObject => {
        const team: Team = teamLogObject.team
        const logs: Array<Log> = teamLogObject.logs
        return (
          <div
            key={team.id}
            className="mt-6 shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white"
          >
            <div className="">
              <DataTable
                title={`${team.name} Activity`}
                columns={teamActivityColumns}
                data={logs}
                customStyles={activityStyles}
                pagination
                dense
              />
            </div>
          </div>
        )
      })}
    </Section>
  )
}

export default Dashboard
