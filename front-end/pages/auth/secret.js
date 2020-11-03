import Head from 'next/head'
import Layout from '../../components/Layout'
import { checkAuth } from '../../helpers/auth';

const Secret = (cards) => {
  return (
    <Layout>
      <h2>Secret page!</h2>
      
    </Layout>
  )
}

Secret.getInitialProps = async (ctx) => {
    await checkAuth(ctx)
    return {}
}

export default  Secret;