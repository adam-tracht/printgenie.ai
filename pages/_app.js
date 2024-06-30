// pages/_app.js
import '../styles/globals.css'
import ClarityAnalytics from '../components/ClarityAnalytics'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ClarityAnalytics />
      <Component {...pageProps} />
    </>
  )
}

export default MyApp