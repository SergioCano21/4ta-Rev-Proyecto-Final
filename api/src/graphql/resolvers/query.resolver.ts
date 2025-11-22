import { GraphQLError } from "graphql";
import { getUserFromToken } from "../../utils/auth.utils";
import { prisma } from "../../config/prisma";

export const queryResolvers = {
  patients: async (_parent: any, _args: any, context: any) => {
    console.log("Entering patients graphql query resolver");

    if (!context.user) {
      console.log("Missing token or invalid token");
      throw new GraphQLError("Missing token or invalid token");
    }

    console.log("Patients retrieved successfully");
    return await prisma.patient.findMany({ where: { doctorId: context.user.id } });
  },
};
