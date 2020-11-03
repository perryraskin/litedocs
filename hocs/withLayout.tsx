import React, { ComponentType } from "react"

import Store from "../components/Store"
import Layout from "../components/Layout/Layout"

function withLayout<T>(WrappedComponent: ComponentType<T>) {
  return function ComponentWithLayout(props: T) {
    return (
      <Store>
        <Layout>
          <WrappedComponent {...props} />
        </Layout>
      </Store>
    )
  }
}

export default withLayout
