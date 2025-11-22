import jwt from "jsonwebtoken";

export const getUserFromToken = (authHeader: string | undefined): { id: number } | null => {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return null;
  }

  try {
    const payload = jwt.verify(token!, process.env.JWT_SECRET!) as { id: number };
    return payload;
  } catch (error) {
    return null;
  }
};
