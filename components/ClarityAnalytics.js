// components/ClarityAnalytics.js
import Script from 'next/script'

const ClarityAnalytics = () => {
  return (
    <Script strategy="afterInteractive" id="microsoft-clarity-script">
      {`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "n07y4qsw6l");
      `}
    </Script>
  )
}

export default ClarityAnalytics