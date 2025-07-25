import type { NextApiRequest, NextApiResponse } from "next";
import { withApiAuth } from "@/lib/apiAuth";

type Data = {
  name: string;
};

function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  res.status(200).json({ name: "John Doe" });
}

export default withApiAuth(handler); // Solo autenticados
