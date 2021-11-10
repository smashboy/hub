// import { Children } from "react"
import { Document, Html, DocumentHead, Main, BlitzScript /*DocumentContext*/ } from "blitz"
// import createCache from "@emotion/cache"
// import createEmotionServer from "@emotion/server/create-instance"

class MyDocument extends Document {
  // Only uncomment if you need to customize this behaviour
  // static async getInitialProps(ctx: DocumentContext) {
  //   const initialProps = await Document.getInitialProps(ctx)
  //   return {...initialProps}
  // }

  render() {
    return (
      <Html lang="en">
        <DocumentHead />
        <body>
          <Main />
          <BlitzScript />
        </body>
      </Html>
    )
  }
}

// MyDocument.getInitialProps = async (ctx) => {
//   const originalRenderPage = ctx.renderPage

//   const cache = createCache({ key: "css" })
//   const { extractCriticalToChunks } = createEmotionServer(cache)

//   ctx.renderPage = () =>
//     originalRenderPage({
//       // @ts-ignore
//       enhanceApp: (App) => (props) => <App emotionCache={cache} {...props} />,
//     })

//   const initialProps = await Document.getInitialProps(ctx)
//   // This is important. It prevents emotion to render invalid HTML.
//   // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
//   const emotionStyles = extractCriticalToChunks(initialProps.html)
//   const emotionStyleTags = emotionStyles.styles.map((style) => (
//     <style
//       data-emotion={`${style.key} ${style.ids.join(" ")}`}
//       key={style.key}
//       // eslint-disable-next-line react/no-danger
//       dangerouslySetInnerHTML={{ __html: style.css }}
//     />
//   ))

//   return {
//     ...initialProps,
//     // Styles fragment is rendered after the app and page rendering finish.
//     styles: [...Children.toArray(initialProps.styles), ...emotionStyleTags],
//   }
// }

export default MyDocument
