import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

export function withApiAuth(
  handler: NextApiHandler,
  allowedRoles: string[] = []
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (
      allowedRoles.length > 0 &&
      (!session.user?.role || !allowedRoles.includes(session.user.role))
    ) {
      return res.status(403).json({ error: "Not authorized" });
    }
    return handler(req, res);
  };
}
