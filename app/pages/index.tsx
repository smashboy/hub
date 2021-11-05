import { Suspense } from "react"
import { Image, Link, BlitzPage } from "blitz"
import Layout from "app/core/layouts/Layout"
import logo from "public/logo.png"

/*
 * This file is just for a pleasant getting started page for your new app.
 * You can delete everything in here and start from scratch if you like.
 */

const HomePage: BlitzPage = () => {
  return <div className="container"></div>
}

// Home.suppressFirstRenderFlicker = true
HomePage.getLayout = (page) => <Layout>{page}</Layout>

export default HomePage
