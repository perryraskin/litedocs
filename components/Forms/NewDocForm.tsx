import React from "react"
import { NextPage } from "next"
import { Router, useRouter } from "next/router"
import withLayout from "../../hocs/withLayout"
import utilities from "../../utilities"
import Editor from "rich-markdown-editor"
import debounce from "lodash/debounce"

import Button from "../Elements/Button"
import Section from "../Layout/Section"
import e from "express"

interface Props {}

const NewDocForm: NextPage<Props> = ({}) => {
  const router = useRouter()
  const [title, setTitle] = React.useState("")
  const [tags, setTags] = React.useState("")
  const [details, setDetails] = React.useState("")
  const [code, setCode] = React.useState("")
  const [isSubmittingForm, setIsSubmittinForm] = React.useState(false)
  const [currentEntry, setCurrentEntry] = React.useState(null)

  React.useEffect(() => {
    fetchEntryRequest()
  }, [])

  const handleChangeDetails = debounce(value => {
    const text = value()
    // console.log(text)
    localStorage.setItem("details", text)
    setDetails(text)
  }, 250)

  const handleChangeCode = debounce(value => {
    const text = value()
    // console.log(text)
    localStorage.setItem("code", text)
    setCode(text)
  }, 250)

  async function fetchEntryRequest() {
    if (!window.location.pathname.includes("new")) {
      const entryId = window.location.pathname.replace(/[^\d.]/g, "")
      const res = await fetch(`/api/entry/${entryId}`)
      const data = await res.json()
      const { entry } = data
      setTitle(entry.title)
      setTags(entry.tagsText)
      setDetails(entry.body)
      setCode(entry.code)
      setCurrentEntry(entry)
      return entry
    }
  }

  async function sendEntryData(e, entryData) {
    e.preventDefault()
    setIsSubmittinForm(true)

    let apiUrl = "/api/entries/create"
    let fetchMethod = "POST"
    if (currentEntry && currentEntry.id) {
      apiUrl = `/api/entry/${currentEntry.id}/update`
      fetchMethod = "PUT"
    }
    const res = await fetch(apiUrl, {
      method: fetchMethod,
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entryData)
    })
    if (res) {
      console.log(res)
      res.json().then(res => {
        console.log(res)
        const { entryResponse } = res
        if (entryResponse) router.push(`/entry/${entryResponse.id}/edit`)
        setIsSubmittinForm(false)
      })
    }
  }

  return (
    <Section>
      <div className="mb-10">
        <div>
          <h2 className="mt-6 text-3xl leading-9 font-extrabold">
            {currentEntry && currentEntry.id ? "Edit" : "New"} Entry
          </h2>
        </div>
        <form action="#" method="POST">
          <div className="shadow sm:rounded-md sm:overflow-hidden">
            <div className="px-4 py-5 bg-white sm:p-6">
              <div className="grid grid-cols-3 gap-6">
                <div className="md:ml-4 col-span-3 sm:col-span-2">
                  <label
                    htmlFor="company_website"
                    className="block text-sm font-medium leading-5 text-gray-700"
                  >
                    Title
                  </label>
                  <div className="mt-1 flex rounded-md shadow-sm">
                    <input
                      className="form-input flex-1 block w-full rounded-md
                          transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      placeholder="User Authentication Flow"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              <div className="md:ml-4 mt-6">
                <label className="block text-sm leading-5 font-medium text-gray-700">
                  Tags
                </label>
                <div className="mt-1 rounded-md shadow-sm">
                  <input
                    className="form-input flex-1 block w-full rounded-md
                          transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                    placeholder="javascript,react,authentication,login,security"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Separate each tag by a comma.
                </p>
              </div>
              <div className="md:ml-4 mt-6">
                <label className="block text-sm leading-5 font-medium text-gray-700">
                  Details
                </label>
                <div className="rounded-md shadow-sm">
                  {/* <textarea
                        rows={3}
                        className="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        value={details}
                        onChange={() => {}}
                      /> */}
                  <Editor
                    id="details"
                    value={
                      currentEntry && currentEntry.body ? currentEntry.body : ""
                    }
                    onChange={handleChangeDetails}
                    placeholder={"This code is meant to..."}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Brief (or not so brief) description of the code you are
                  documenting. Code blocks can be included as well.
                </p>
              </div>
              <div className="md:ml-4 mt-6">
                <label className="block text-sm leading-5 font-medium text-gray-700">
                  Code
                </label>
                <div className="rounded-md shadow-sm">
                  {/* <textarea
                        rows={3}
                        className="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        value={code}
                        onChange={() => {}}
                      /> */}
                  <Editor
                    id="code"
                    value={
                      currentEntry && currentEntry.code ? currentEntry.code : ""
                    }
                    onChange={handleChangeCode}
                    placeholder={"`var someCode = 'Hello, world!'`"}
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  This is a good place to reference large blocks of code, or
                  even an entire file.
                </p>
              </div>
            </div>
            <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
              <span className="inline-flex rounded-md shadow-sm">
                <button
                  type="submit"
                  className={`inline-flex justify-center py-2 px-4 border border-transparent 
                  text-sm leading-5 font-medium rounded-md text-white 
                  bg-blue-600 hover:bg-blue-500 focus:outline-none 
                  focus:border-blue-700 focus:shadow-outline-blue 
                  active:bg-blue-700 transition duration-150 ease-in-out
                  ${isSubmittingForm ? "spinner" : ""}`}
                  onClick={e =>
                    sendEntryData(e, {
                      entry: {
                        title,
                        tagsText: tags,
                        body: details,
                        code
                      }
                    })
                  }
                >
                  Save
                </button>
              </span>
            </div>
          </div>
        </form>
      </div>
    </Section>
  )
}

export default withLayout(NewDocForm)
