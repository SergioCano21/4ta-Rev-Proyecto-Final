import { typeDefs } from "./schema";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { resolvers } from "./resolvers";
import { createHandler } from "graphql-http/lib/use/express";
import { getUserFromToken } from "../utils/auth.utils";

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

export const graphqlHandler = createHandler({
  schema,
  context: (req, res) => {
    const token = (req.headers as any).authorization;

    const user = getUserFromToken(token);

    return { user, req, res };
  },
});
