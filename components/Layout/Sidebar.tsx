import * as React from "react"
import Router from "next/router"
import { MagicContext, LoggedInContext, LoadingContext } from "../Store"

import { NextPage } from "next"
import Link from "next/link"

import SideBarItems from "./SideBarItems"
import { documentTextIcon } from "../SVG/Heroicons"

import { User, Member, Team, Tag } from "../../models/interfaces"

interface SideBarProps {
  userAgent?: string
  openSidebar: boolean
  setOpenSidebar: any
}

const SideBar: NextPage<SideBarProps> = ({ openSidebar, setOpenSidebar }) => {
  const [magic, setMagic] = React.useContext(MagicContext)
  const [currentUser, setCurrentUser] = React.useState(null)
  const [teamTags, setTeamTags] = React.useState([])
  let teamTagsArray = []

  async function getUser() {
    let res = await fetch(`/api/user`)
    let data = await res.json()
    const user = data.user

    let resUser = await fetch(`/api/user/magic/${user.issuer}`)
    let dataUser = await resUser.json()
    const dataUserObject: User = dataUser.user
    setCurrentUser(dataUser.user)

    dataUserObject.Memberships.forEach((membership: Member) => {
      const handle = membership.Team.handle
      let teamAndTags = {
        team: handle,
        tags: []
      }

      fetch(`/api/team/${handle}/tags`)
        .then(res => res.json())
        .then(res => {
          teamAndTags.tags = res.tags
          teamTagsArray.push(teamAndTags)
          setTeamTags(teamTagsArray)
          console.log("teamTags:", teamTagsArray)
        })
    })
  }

  React.useEffect(() => {
    getUser()
  }, [])
  return (
    <React.Fragment>
      <div className="md:hidden">
        <div
          onClick={e => setOpenSidebar(false)}
          className={`fixed inset-0 z-30 bg-gray-600 
          transition-opacity ease-linear duration-300
          ${
            openSidebar
              ? "opacity-75 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        ></div>

        {/* <!-- Small Screen Menu -->  */}
        <div
          className={`fixed inset-y-0 left-0 flex flex-col z-40 max-w-xs w-full 
        bg-white transform ease-in-out duration-300 
        ${openSidebar ? "-translate-x-0" : "-translate-x-full"}`}
        >
          {/* <!-- Brand Logo / Name --> */}
          <div className="flex items-center px-6 py-3 h-16">
            <div className="text-2xl font-bold tracking-tight text-white">
              LiteDocs
            </div>
          </div>
          {/* <!-- @end Brand Logo / Name --> */}
          <div className="px-4 py-2 flex-1 h-0 overflow-y-auto">
            <SideBarItems teamTagsList={teamTags} />
          </div>
        </div>
        {/* <!-- @end Small Screen Menu --> */}
      </div>

      {/* <!-- Menu Above Medium Screen --> */}
      <div className="bg-gray-800 w-64 min-h-screen overflow-y-auto hidden md:block shadow relative z-30">
        {/* <!-- Brand Logo / Name --> */}
        <div className="flex items-center px-6 py-3 h-16">
          <div className="text-2xl font-bold tracking-tight text-white">
            {/* {documentTextIcon(28, 28, "opacity-50")} */}
            LiteDocs
          </div>
        </div>
        {/* <!-- @end Brand Logo / Name --> */}

        <div className="px-4 py-2">
          <SideBarItems teamTagsList={teamTags} />

          {/* <div className="bg-orange-200 mb-10 p-6 rounded-lg mt-16">
        <h2 className="text-gray-800 text-lg leading-tight">Try <strong className="font-bold">Dashing Admin.</strong></h2>
        <p className="text-gray-800 text-lg mb-4 leading-tight">Premium for free!</p>

        <button className="shadow text-center w-full block bg-blue-500 hover:bg-blue-600 focus:outline-none focus:shadow-outline text-white font-semibold py-2 px-4 rounded-lg">
          30 Days Free Trial    
        </button>
      </div> */}
        </div>
      </div>
      {/* <!-- @end Menu Above Medium Screen --> */}
    </React.Fragment>
  )
}

export default SideBar
