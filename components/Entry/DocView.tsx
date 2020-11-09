import React from "react"
import { NextPage } from "next"
import Link from "next/link"
import Router from "next/router"
import { MagicContext, LoggedInContext, LoadingContext } from "../Store"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
dayjs.extend(utc)
import Markdown from "react-markdown"
import Highlight, { defaultProps } from "prism-react-renderer"
import theme from "prism-react-renderer/themes/nightOwl"
import styled from "styled-components"

import Section from "../Layout/Section"

import { Entry } from "../../models/interfaces"

interface Props {
  entry: Entry
}

const TeamDocs: NextPage<Props> = ({ entry }) => {
  return (
    <Section extend="mb-10">
      <div className="uppercase text-xxs font-semibold mb-4">
        {entry.teamId ? (
          <>
            <Link href="/[handle]" as={`/${entry.Team.handle}`}>
              <a className=" hover:text-gray-500">{entry.Team.handle}</a>
            </Link>{" "}
            /{" "}
          </>
        ) : (
          <>
            <Link href="/">
              <a className=" hover:text-gray-500">Docs</a>
            </Link>{" "}
            /{" "}
          </>
        )}
        {entry.title}
      </div>
      <div className="lg:flex lg:items-center lg:justify-between mb-4">
        <div>
          <h2 className="mt-6 text-3xl leading-9 font-bold">{entry.title}</h2>
        </div>
        <Link href="/entry/[entryid]/edit" as={`/entry/${entry.id}/edit`}>
          <a
            type="button"
            className="inline-flex items-center px-4 py-2 border border-gray-300 
              text-sm leading-5 font-medium rounded-md text-gray-700 bg-white 
              hover:text-gray-500 focus:outline-none focus:shadow-outline-blue 
              focus:border-blue-300 active:text-gray-800 active:bg-gray-50 
              transition duration-150 ease-in-out"
          >
            {/* Heroicon name: pencil */}
            <svg
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Edit
          </a>
        </Link>
      </div>

      <div className="text-sm leading-5 text-gray-900 mb-6">
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
      <div className="text-xs">
        Updated {dayjs.utc(entry.dateUpdated).format("MM/DD/YYYY")}
      </div>
      <div className="flex flex-col mt-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg bg-white">
              <div className="m-8">
                <Markdown className="markdown">{entry.body}</Markdown>

                <div className={`${entry.code.length > 0 ? "" : "hidden"}`}>
                  <br />
                  <hr />
                  <br />
                  Code:
                  <Highlight
                    {...defaultProps}
                    theme={theme}
                    code={entry.code
                      .replace("```", "")
                      .replace("```", "")
                      .trim()}
                    language="jsx"
                  >
                    {({
                      className,
                      style,
                      tokens,
                      getLineProps,
                      getTokenProps
                    }) => (
                      <Pre className={className} style={style}>
                        {tokens.map((line, i) => (
                          <Line key={i} {...getLineProps({ line, key: i })}>
                            <LineNo>{i + 1}</LineNo>
                            <LineContent>
                              {line.map((token, key) => (
                                <span
                                  key={key}
                                  {...getTokenProps({ token, key })}
                                />
                              ))}
                            </LineContent>
                          </Line>
                        ))}
                      </Pre>
                    )}
                  </Highlight>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  )
}

export default TeamDocs

export const Wrapper = styled.div`
  font-family: sans-serif;
  text-align: center;
`

export const Pre = styled.pre`
  text-align: left;
  font-size: 14px;
  margin: 1em 0;
  padding: 0.5em;
  overflow: scroll;

  & .token-line {
    line-height: 1.3em;
    height: 1.3em;
  }
`

export const Line = styled.div`
  display: table-row;
`

export const LineNo = styled.span`
  display: table-cell;
  text-align: right;
  padding-right: 1em;
  user-select: none;
  opacity: 0.5;
`

export const LineContent = styled.span`
  display: table-cell;
`
