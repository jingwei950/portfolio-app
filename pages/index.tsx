import { useContext } from 'react'
import {
  ReactBricksContext,
  PageViewer,
  fetchPage,
  cleanPage,
  types,
} from 'react-bricks/frontend'
import Head from 'next/head'
import { GetStaticProps } from 'next'

import config from '../react-bricks/config'
import Layout from '../components/layout'
import ErrorNoKeys from '../components/errorNoKeys'
import ErrorNoHomePage from '../components/errorNoHomePage'

interface HomeProps {
  page: types.Page
  error: string
}

const Home: React.FC<HomeProps> = ({ page, error }) => {
  // Clean the received content
  // Removes unknown or not allowed bricks
  const { pageTypes, bricks } = useContext(ReactBricksContext)

  const pageOk = page ? cleanPage(page, pageTypes, bricks) : null

  return (
    <Layout>
      {pageOk && (
        <>
          <Head>
            <title>Jing Wei's Portfolio</title>
            <meta name="description" content={page.meta.description} />
            <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚀</text></svg>"></link>
          </Head>
          <PageViewer page={pageOk} />
        </>
      )}
      {error === 'NOKEYS' && <ErrorNoKeys />}
      {error === 'NOPAGE' && <ErrorNoHomePage />}
    </Layout>
  )
}

export const getStaticProps: GetStaticProps = async (context) => {
  if (!config.apiKey) {
    return { props: { error: 'NOKEYS' } }
  }
  try {
    const page = await fetchPage('home', config.apiKey, context.locale)
    return { props: { page } }
  } catch {
    return { props: { error: 'NOPAGE' } }
  }
}

export default Home
