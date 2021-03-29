// import gql from "graphql-tag";
import express from "express";
import { ApolloServer, gql, makeExecutableSchema } from "apollo-server-express";
import {
  GraphQLUpload, // The GraphQL "Upload" Scalar
  graphqlUploadExpress, // The Express middleware.
} from "graphql-upload";
import * as path from "path";
import * as fs from "fs";
import cors from "cors";

const port = process.env.PORT || 4000;

const generateRandomString = (length) => {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

// Define APIs using GraphQL SDL
const typeDefs = gql`
  scalar Upload
  type File {
    url: String!
  }

  type Query {
    uploads: [File]
  }

  type Mutation {
    singleUpload(file: Upload!): File!
  }
`;

// Define resolvers map for API definitions in SDL
const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    uploads: (parent, args) => {},
  },
  Mutation: {
    singleUpload: async (parent, { file }) => {
      const { filename, createReadStream } = await file;
      const { ext } = path.parse(filename);
      const randomName = generateRandomString(12) + ext;

      const stream = createReadStream();
      const pathName = path.join(__dirname, `/public/images/${randomName}`);
      await stream.pipe(fs.createWriteStream(pathName));
      return {
        url: `http://localhost:4000/images/${randomName}`,
      };
    },
  },
};

// Configure express
const app = express();
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 })); // Maximum file size is up to 10MB
app.use(express.static("public"));
app.use(cors());

// Build GraphQL schema based on SDL definitions and resolvers maps
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Build Apollo server
const apolloServer = new ApolloServer({ schema, uploads: false });
apolloServer.applyMiddleware({ app });

// Run server
app.listen({ port }, () => {
  console.log(
    `🚀Server ready at http://localhost:${port}${apolloServer.graphqlPath}`
  );
});
