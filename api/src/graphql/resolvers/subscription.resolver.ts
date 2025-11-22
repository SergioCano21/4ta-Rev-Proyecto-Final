import { withFilter } from "graphql-subscriptions";
import { pubsub, TOPICS } from "../pubsub";

export const subscriptionResolvers = {
  liveVitals: {
    subscribe: withFilter(
      () => pubsub.asyncIterableIterator(TOPICS.LIVE_VITALS),
      async (payload, _, context) => {
        return payload.liveVital.doctorId === context.user.id;
      }
    ),
    resolve: (payload: any) => {
      console.log("Sending data");
      return payload.liveVital;
    },
  },
};
