// pages/_app.js
import '../styles/globals.css'
import ClarityAnalytics from '../components/ClarityAnalytics'
import Footer from '../components/Footer'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <ClarityAnalytics />
      <Component {...pageProps} />
      <Footer />
    </>
  )
}

export default MyApp