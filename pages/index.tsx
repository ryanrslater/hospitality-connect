import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import LoggedIn from '../ui/layouts/index/LoggedIn'
import { GetServerSidePropsContext, NextPage } from 'next'
import { Auth } from '../lib/Auth'
import { PageProps } from '../types/PageProps'

const Home: NextPage<PageProps> = ({ signedIn }) => {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <LoggedIn />
    </div>
  )
}

export default Home

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const auth = new Auth()
  const session = await auth.authenticate(context.req, context.res)
  console.log(session)
  if (!session) {
    return {
      props: {
        signedIn: false
      }
    }
  }
  return {
    props: {
      signedIn: true
    }
  }

}
