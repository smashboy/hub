import {
  AppProps,
  ErrorBoundary,
  ErrorComponent,
  AuthenticationError,
  AuthorizationError,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
} from "blitz"
import { GlobalStyles, ThemeProvider } from "@mui/material"
import AdapterDateFns from "@mui/lab/AdapterDateFns"
// import { CacheProvider } from "@emotion/react"
// import createCache, { EmotionCache } from "@emotion/cache"
import LocalizationProvider from "@mui/lab/LocalizationProvider"
import { SnackbarProvider } from "notistack"
// import lightTheme from "app/core/theme/lightTheme"
import darkTheme from "app/core/theme/darkTheme"
import { ConfirmDialogProvider } from "react-mui-confirm"

// const clientSideEmotionCache = createCache({ key: "css" })

// interface CustomAppProps extends AppProps {
//   emotionCache: EmotionCache
// }

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <ThemeProvider theme={darkTheme}>
      <ConfirmDialogProvider
        confirmTextFieldProps={{
          variant: "outlined",
          size: "small",
        }}
        cancelButtonProps={{ color: "secondary" }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <SnackbarProvider maxSnack={3}>
            <ErrorBoundary
              FallbackComponent={RootErrorFallback}
              onReset={useQueryErrorResetBoundary().reset}
            >
              <GlobalStyles
                styles={{
                  body: { margin: 0, backgroundColor: "#121212" },
                  "::-webkit-scrollbar": {
                    width: 4,
                    height: 4,
                  },

                  "::-webkit-scrollbar-track": {
                    backgroundColor: "transparent",
                  },

                  "::-webkit-scrollbar-thumb": {
                    background: "#ffffff",
                  },
                }}
              />
              {getLayout(<Component {...pageProps} />, pageProps)}
            </ErrorBoundary>
          </SnackbarProvider>
        </LocalizationProvider>
      </ConfirmDialogProvider>
    </ThemeProvider>
  )
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return null
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    )
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    )
  }
}
