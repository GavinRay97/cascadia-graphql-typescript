import { ApolloClient, HttpLink, InMemoryCache, NormalizedCacheObject, split } from "@apollo/client"
import { WebSocketLink } from "@apollo/client/link/ws"
import { getMainDefinition } from "@apollo/client/utilities"
import { useMemo } from "react"

let apolloClient: ApolloClient<NormalizedCacheObject>

function createApolloClient() {
  // HTTP Link
  const httpLink = new HttpLink({
    uri: `http://localhost:8080/v1/graphql`,
  })

  // WebSocket Link
  const wsLink = process.browser
    ? new WebSocketLink({
        uri: `ws://localhost:8080/v1/graphql`,
        options: {
          reconnect: true,
          lazy: true,
        },
      })
    : null

  const link = process.browser
    ? split(
        //only create the split in the browser
        // split based on operation type
        ({ query }) => {
          const definition = getMainDefinition(query)
          return definition.kind === "OperationDefinition" && definition.operation === "subscription"
        },
        wsLink!,
        httpLink
      )
    : httpLink

  return new ApolloClient({
    link,
    ssrMode: typeof window === "undefined", // set to true for SSR
    cache: new InMemoryCache(),
  })
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient()

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract()

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({ ...existingCache, ...initialState })
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient
  return _apolloClient
}

export function useApollo(initialState) {
  const store = useMemo(() => initializeApollo(initialState), [initialState])
  return store
}
