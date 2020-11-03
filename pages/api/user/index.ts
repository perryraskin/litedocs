import { NextApiRequest, NextApiResponse } from "next"
import { decryptCookie } from "../../../utilities/cookie"

export default async function(req: NextApiRequest, res: NextApiResponse) {
  let userFromCookie

  try {
    userFromCookie = await decryptCookie(req.cookies.auth)
  } catch (error) {
    /* if there's no valid auth cookie, user is not logged in */
    return res.json({ authorized: false, error })
  }

  /* send back response with user obj */
  return res.json({ authorized: true, user: userFromCookie })
}
