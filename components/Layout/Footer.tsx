import { NextPage } from "next"
import Section from "./Section"

interface Props {}

const Footer: NextPage<Props> = ({}) => {
  const year = new Date().getFullYear()
  return (
    <Section extend="text-center">
      <footer className="flex justify-between items-center">
        <div>
          <span className="opacity-50 text-base">© {year} LiteDocs</span>
        </div>
        {/* <div>
          <Link href="/terms">
            <a
              href="/terms"
              className="opacity-50 text-base hover:opacity-100 mr-6 link-underline"
            >
              Terms
            </a>
          </Link>
          <Link href="/privacy">
            <a
              href="/privacy"
              className="opacity-50 text-base hover:opacity-100 mr-6 link-underline"
            >
              Privacy
            </a>
          </Link>
        </div> */}
      </footer>
    </Section>
  )
}

export default Footer
