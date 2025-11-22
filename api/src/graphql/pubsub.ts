import { PubSub } from "graphql-subscriptions";

export const pubsub = new PubSub();

export const TOPICS = {
  LIVE_VITALS: "LIVE_VITALS",
};
