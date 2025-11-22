import { useServer } from "graphql-ws/use/ws";
import { WebSocketServer } from "ws";
import { schema } from "./index";
import { getUserFromToken } from "../utils/auth.utils";

export const webSocket = (httpServer: any) => {
  const wsServer = new WebSocketServer({ server: httpServer, path: "/graphql" });

  useServer(
    {
      schema,
      onConnect: async (ctx) => {
        const token = ctx.connectionParams?.authorization as string;
        const user = getUserFromToken(token);

        if (!user) {
          console.log("Connection failed: Missing or invalid token");
          return false;
        }

        console.log("New subscription started");
        (ctx.extra as any).user = user;
        return true;
      },
      context: (ctx) => {
        return {
          user: ctx.extra.user,
        };
      },
    },
    wsServer
  );
};
