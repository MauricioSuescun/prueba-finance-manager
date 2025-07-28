import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const debugInfo = {
    nodeEnv: process.env.NODE_ENV,
    betterAuthUrl: process.env.BETTER_AUTH_URL,
    nextAuthUrl: process.env.NEXTAUTH_URL,
    vercelUrl: process.env.VERCEL_URL,
    githubId: process.env.GITHUB_ID ? "✅ Configurado" : "❌ No configurado",
    githubSecret: process.env.GITHUB_SECRET ? "✅ Configurado" : "❌ No configurado",
    headers: {
      host: req.headers.host,
      origin: req.headers.origin,
      referer: req.headers.referer,
    },
    timestamp: new Date().toISOString(),
  };

  res.status(200).json(debugInfo);
}