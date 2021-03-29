# File Upload with GraphQL

# How to implement File Uploads feature in Node 14 and later

## Problem

> Apollo Server's built-in support for file uploads relies on an old version of the graphql-upload npm package for backward compatibility. This old version is not fully compatible with Node 14.

## Solutions

**Step 1.** Switch from using apollo-server to one of the Apollo Server integration packages, like apollo-server-express.

**Step 2.** Add the `graphql-upload` as express middleware.

**Step 3.** Disable the upload support provided by the older graphql-upload version included in Apollo Server 2.x by setting uploads: false on the ApolloServer constructor's "options"

**HERE IS the CODE SAMPLE for step 1, 2 and 3.**

```js
import express from "express";
import { ApolloServer, gql, makeExecutableSchema } from "apollo-server-express";
import { GraphQLUpload, graphqlUploadExpress } from "graphql-upload";

const app = express();
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); //ADD graphqlUploadExpress here!

const schema = makeExecutableSchema({ typeDefs, resolvers });

const apolloServer = new ApolloServer({ schema, uploads: false });
apolloServer.applyMiddleware({ app });

app.listen({ port }, () => {
  console.log(
    `🚀Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  );
});
```

<hr />

**Step 4.** Install the latest version of `graphql-upload`

```js
npm install graphql-upload@latest
```

<hr />

**Step 5.** Add the `Upload` scalar in both typeDefs SDL and resolvers appropriately.

```js
import { GraphQLUpload } from "graphql-upload"; // The GraphQL "Upload" Scalar

const typeDefs = gql`
  scalar Upload // HERE

  type Query {...}
  type Mutation {...}
`;

const resolvers = {
  Upload: GraphQLUpload, //HERE
  Query: {...},
  Mutation: {...},
};
```

<hr />

**Step 6.** Test to upload mutation using [Altair GraphQL Client](https://altair.sirmuel.design/), in which a file can be uploaded manually.

<hr />

## References(Back-end)

https://github.com/apollographql/apollo-server/issues/3508#issuecomment-662371289
https://www.apollographql.com/docs/apollo-server/data/file-uploads/
https://qiita.com/ymatzki/items/be68118c21d9d7b906a8
https://www.toptal.com/graphql/creating-your-first-graphql-api

## React

```js
npm run serve
npx create-react-app client --template clean-cra
```
