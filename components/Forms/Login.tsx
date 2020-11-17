import { useContext, useState } from "react"
import { MagicContext, LoggedInContext, LoadingContext } from "../Store"
import Router from "next/router"
import Link from "next/link"

import Section from "../Layout/Section"

const Login = () => {
  const [loggedIn, setLoggedIn] = useContext(LoggedInContext)
  const [isLoading, setIsLoading] = useContext(LoadingContext)
  const [email, setEmail] = useState("")
  const [magic] = useContext(MagicContext)
  const [errorMsg, setErrorMsg] = useState("")
  const [disableLogin, setDisableLogin] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  const handleLogin = async () => {
    /* Get DID Token returned from when the email link is clicked */
    const DIDT = await magic.auth.loginWithMagicLink({ email })
    if (DIDT) setIsLoggingIn(false)

    /* Pass the Decentralized ID token in the Authorization header to the database */
    let res = await fetch(`/api/user/login`, {
      method: "POST",
      headers: new Headers({
        Authorization: "Bearer " + DIDT
      })
    })

    let data = await res.json()

    /* If the user is authorized, return an object containing the user properties (issuer, publicAddress, email) */
    /* Else, the login was not successful and return false */
    let user = data.authorized ? data.user : false
    if (user) {
      setLoggedIn(user.email)
      Router.push("/")
    }
  }

  return (
    <>
      {isLoading ? ( // if fetching data, show a loading symbol
        // <button
        //   className={`inline-flex justify-center py-2 px-4 border border-transparent
        //   text-sm leading-5 font-medium rounded-md text-white
        //   bg-blue-600 hover:bg-blue-500 focus:outline-none
        //   focus:border-blue-700 focus:shadow-outline-blue
        //   active:bg-blue-700 transition duration-150 ease-in-out spinner`}
        // >
        //   Loading...
        // </button>
        <Section>
          <img
            className="ml-auto mr-auto block text-center"
            width="150"
            src="https://i1.wp.com/hubbravissimo.com/wp-content/uploads/2019/07/fff16-862c4e_80c174747b704e778f110260a995cc97mv2.gif?ssl=1"
          ></img>
        </Section>
      ) : loggedIn ? ( // If the user is logged in
        <Section extend="mb-20 text-center">You're already logged in!</Section>
      ) : (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            <div>
              <h2 className="mt-6 text-center text-3xl leading-9 font-extrabold text-gray-900">
                Sign in
              </h2>
            </div>
            <form>
              <div className="col-span-6 sm:col-span-4">
                <label
                  htmlFor="email_address"
                  className="block text-sm font-medium leading-5 text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={e => {
                    setErrorMsg("") // remove error msg
                    setEmail(e.target.value)
                  }}
                  className="mt-1 form-input block w-full transition duration-150 
              ease-in-out sm:text-sm sm:leading-5"
                />
              </div>
              <div className="px-4 py-3 text-right sm:px-6">
                <span className="inline-flex rounded-md shadow-sm">
                  <button
                    type="submit"
                    className={`inline-flex justify-center py-2 px-4 border border-transparent 
                  text-sm leading-5 font-medium rounded-md text-white 
                  bg-blue-600 hover:bg-blue-500 focus:outline-none 
                  focus:border-blue-700 focus:shadow-outline-blue 
                  active:bg-blue-700 transition duration-150 ease-in-out
                  ${isLoggingIn ? "spinner" : ""}`}
                    disabled={disableLogin}
                    onClick={e => {
                      e.preventDefault()
                      setIsLoggingIn(true)
                      if (!email) return setErrorMsg("Email cannot be empty.")
                      handleLogin()
                    }}
                  >
                    Log in
                  </button>
                </span>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Login
