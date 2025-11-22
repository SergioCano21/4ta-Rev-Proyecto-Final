import { prisma } from "../../config/prisma";

export const patientResolvers = {
  vitals: async (parent: any) => {
    return await prisma.vital.findMany({
      where: { patientId: parent.id },
      orderBy: { timestamp: "desc" },
      take: 5,
    });
  },

  doctor: async (parent: any) => {
    return await prisma.user.findUnique({ where: { id: parent.doctorId } });
  },
};
