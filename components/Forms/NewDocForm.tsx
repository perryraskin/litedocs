import React from "react"
import { NextPage } from "next"
import Link from "next/link"
import { Router, useRouter } from "next/router"
import withLayout from "../../hocs/withLayout"
import utilities from "../../utilities"
import Editor from "rich-markdown-editor"
import debounce from "lodash/debounce"
import Highlight, { defaultProps } from "prism-react-renderer"
import theme from "prism-react-renderer/themes/nightOwl"
import CodeEditor from "react-simple-code-editor"

import Button from "../Elements/Button"
import Section from "../Layout/Section"

import { Tag } from "../../models/interfaces"

interface Props {
  handle?: string
}

const NewDocForm: NextPage<Props> = ({ handle }) => {
  const router = useRouter()
  const [isNew, setIsNew] = React.useState(true)
  const [title, setTitle] = React.useState("")
  const [tags, setTags] = React.useState("")
  const [details, setDetails] = React.useState("")
  const [code, setCode] = React.useState("")
  const [isSubmittingForm, setIsSubmittingForm] = React.useState(false)
  const [currentEntry, setCurrentEntry] = React.useState(null)

  //state for tags autocomplete dropdown menu
  const [tagResults, setTagResults] = React.useState(null)

  React.useEffect(() => {
    fetchEntryRequest()
  }, [])

  function handleChangeTags(input) {
    setTags(
      input
        .trim()
        .replace(/ /g, "")
        .toLowerCase()
    )

    const tagArray = input.split(",")
    const currentTag =
      tagArray.length > 0 ? tagArray[tagArray.length - 1] : input
    //console.log("currentTag:", currentTag)

    fetchTagsRequest(currentTag)
  }

  function handleClickTag(tag) {
    const tagArray = tags.split(",")
    const currentTag =
      tagArray.length > 0 ? tagArray[tagArray.length - 1] : tags
    const updatedTags = tags.replace(currentTag, tag)
    setTags(updatedTags)
    setTagResults(null)
  }

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

  async function fetchTagsRequest(tag) {
    const res = await fetch(`/api/team/${handle}/tags?search=${tag}`)
    const data = await res.json()
    console.log(data)
    const { authorized, tags } = data
    if (authorized) {
      setTagResults(tags)
    }
  }

  async function fetchEntryRequest() {
    if (window.location.pathname.includes("new")) {
      localStorage.setItem("details", bodyTemplate)
      setDetails(bodyTemplate)
    } else {
      setIsNew(false)
      const entryId = window.location.pathname.replace(/[^\d.]/g, "")
      const res = await fetch(`/api/entry/${entryId}`)
      const data = await res.json()
      console.log(data)
      const { authorized, entry } = data
      if (!authorized) router.push("/")
      else {
        setTitle(entry.title)
        setTags(entry.tagsText)
        setDetails(entry.body)
        setCode(entry.code)
        setCurrentEntry(entry)
      }
    }
  }

  async function sendEntryData(e, entryData) {
    e.preventDefault()
    setIsSubmittingForm(true)

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
        if (entryResponse) router.push(`/entry/${entryResponse.id}`)
        setIsSubmittingForm(false)
      })
    }
  }

  const styles = {
    root: {
      boxSizing: "border-box",
      fontSize: "14px",
      fontFamily: '"Dank Mono", "Fira Code", monospace',
      ...theme.plain
    }
  }

  const highlight = code => (
    <Highlight {...defaultProps} theme={theme} code={code} language="jsx">
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <React.Fragment>
          {tokens.map((line, i) => (
            <div {...getLineProps({ line, key: i })}>
              {line.map((token, key) => (
                <span {...getTokenProps({ token, key })} />
              ))}
            </div>
          ))}
        </React.Fragment>
      )}
    </Highlight>
  )

  const onCodeChange = code => {
    setCode(code)
  }

  return (
    <Section extend="mb-10">
      <div className="uppercase text-xxs font-semibold">
        {handle ? (
          <>
            <Link href="/teams">
              <a className=" hover:text-gray-500">Teams</a>
            </Link>{" "}
            /{" "}
            <Link href="/[handle]" as={`/${handle}`}>
              <a className=" hover:text-gray-500">{handle}</a>
            </Link>
            {" / "}
          </>
        ) : currentEntry && currentEntry.Team ? (
          <>
            <Link href="/[handle]" as={`/${currentEntry.Team.handle}`}>
              <a className=" hover:text-gray-500">{currentEntry.Team.handle}</a>
            </Link>
            {" / "}
          </>
        ) : (
          <>
            <Link href="/">
              <a className=" hover:text-gray-500">Docs</a>
            </Link>
            {" / "}
          </>
        )}

        {currentEntry && currentEntry.id ? (
          <>
            <Link href="/entry/[entryid]" as={`/entry/${currentEntry.id}`}>
              <a className=" hover:text-gray-500">{currentEntry.title}</a>
            </Link>
            {" / "}
          </>
        ) : null}
        {currentEntry && currentEntry.id ? "Edit" : "New"}
      </div>
      <div>
        <h2 className="mt-6 text-3xl leading-9 font-extrabold">
          {currentEntry && currentEntry.id ? "Edit" : "New"} Doc
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
                  onChange={e => handleChangeTags(e.target.value)}
                />
              </div>
              <div
                className={`absolute z-40 mt-2 w-56 rounded-md shadow-lg bg-white 
              ring-1 ring-black ring-opacity-5 ${
                tagResults && tagResults.length > 0 && tags.length > 0
                  ? ""
                  : "hidden"
              }`}
              >
                <div
                  className="py-1"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  {tagResults
                    ? tagResults.map((tag: Tag) => (
                        <a
                          key={tag.id}
                          href="#"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={() => handleClickTag(tag.name)}
                        >
                          <span
                            className="px-2 inline-flex text-xs leading-5 font-semibold 
                    rounded-full bg-blue-100 text-blue-800"
                          >
                            {tag.name}
                          </span>
                        </a>
                      ))
                    : null}
                </div>
              </div>

              <p className="mt-2 text-sm text-gray-500">
                Separate each tag by a comma.
              </p>
            </div>
            <div className="md:ml-4 mt-6">
              <label className="block text-sm leading-5 font-medium text-gray-700 mb-1">
                Body
              </label>
              <hr></hr>
              <div className="rounded-md shadow-sm">
                {/* <textarea
                        rows={3}
                        className="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                        value={details}
                        onChange={() => {}}
                      /> */}
                <Editor
                  id="details"
                  className="text-sm mt-2"
                  defaultValue={bodyTemplate}
                  value={
                    currentEntry && currentEntry.body && !isNew
                      ? currentEntry.body
                      : bodyTemplate
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
                <textarea
                  rows={10}
                  className="form-textarea mt-1 block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                />
                {/* <Editor
                  id="code"
                  value={
                    currentEntry && currentEntry.code ? currentEntry.code : ""
                  }
                  onChange={handleChangeCode}
                  placeholder={"`var someCode = 'Hello, world!'`"}
                /> */}
                {/* <CodeEditor
                  value={
                    currentEntry && currentEntry.code ? currentEntry.code : ""
                  }
                  onValueChange={code => setCode(code)}
                  highlight={highlight}
                  padding={10}
                  style={styles.root as React.CSSProperties}
                /> */}
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This is a good place to reference large blocks of code, or even
                an entire file. It'll be automatically formatted upon
                submission.
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
                      code,
                      handle
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
    </Section>
  )
}

export default withLayout(NewDocForm)

const bodyTemplate = `
**Client:** Example Client Name

**Database ID:** 000

**Languages:** C#, HTML, JavaScript

**Frameworks:** .NET

**Tools:** Visual Studio 2019, XCode

**Source Code URL:** [https://bitbucket.org/blueswitchny/example-repo](https://bitbucket.org/blueswitchny/example-repo)

## Overview

_Sum up this piece of documentation in a sentence or two._

## Details

_Provide specific details in this section. What is the behavior of the code being referenced? How does the project get published? What are the known issues?_

### Order Export

_This is how we export orders..._

### Publishing

_To publish, go to the Visual Studio menu..._

### Known Issues

_Please note that exporting orders is currently very slow..._

### Credentials

_Username is... password is..._
`
