import { patientResolvers } from "./patient.resolver";
import { queryResolvers } from "./query.resolver";
import { subscriptionResolvers } from "./subscription.resolver";

export const resolvers = {
  Query: queryResolvers,
  Subscription: subscriptionResolvers,
  Patient: patientResolvers,
};
