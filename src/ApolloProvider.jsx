import React from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { SchemaLink } from "apollo-link-schema";
import { makeExecutableSchema, addMockFunctionsToSchema } from "graphql-tools";
import { printSchema, buildClientSchema } from "graphql/utilities";
import { HttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import fetch from "node-fetch";
import introspectionResult from "../schema.json";

const link = new HttpLink({
  uri: "",
  fetch
});

function AutoMockedProvider({ children, mockResolvers = {} }) {
  // 1) Convert JSON schema into Schema Definition Language
  const schemaSDL = printSchema(
    buildClientSchema({ __schema: introspectionResult.__schema })
  );

  // 2) Make schema "executable"
  const schema = makeExecutableSchema({
    typeDefs: schemaSDL,
    resolverValidationOptions: {
      requireResolversForResolveType: false
    }
  });

  // 3) Apply mock resolvers to executable schema
  addMockFunctionsToSchema({ schema, mocks: mockResolvers });

  // 4) Define ApolloClient (client variable used below)
  const client = new ApolloClient({
    link: new SchemaLink({ schema }),
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client} mocks={[]}>
      {children}
    </ApolloProvider>
  );
}

function ProductionProvider({ children }) {
  const client = new ApolloClient({
    link: authLink.concat(link),
    cache: new InMemoryCache()
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}

function selectProvider(env) {
  if (env === "production") {
    return ProductionProvider;
  }
  return AutoMockedProvider;
}

export default selectProvider(process.env.NODE_ENV);
