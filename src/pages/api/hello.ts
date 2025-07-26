import type { NextApiRequest, NextApiResponse } from "next";
import { withAuth } from "@/lib/apiAuth";

type Data = {
  name: string;
};

async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: "John Doe" });
}

export default withAuth(handler);
