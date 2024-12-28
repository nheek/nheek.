import { NextApiRequest, NextApiResponse } from "next";

interface Query {
  url?: string;
}
interface ErrorResponse {
  error: string;
}
interface StatusResponse {
  status: string;
  error?: string;
}

export default async function WebsiteStatus(
  req: NextApiRequest,
  res: NextApiResponse<StatusResponse | ErrorResponse>,
) {
  const { url } = req.query as Query;

  if (!url) {
    return res.status(400).json({ error: "URL parameter is required" });
  }

  try {
    const response = await fetch(url);

    if (response.ok) {
      res.status(200).json({ status: "up" });
    } else {
      res.status(500).json({ status: "down", error: `Failed to fetch ${url}` });
    }
  } catch (error) {
    res.status(500).json({ status: "down", error: (error as Error).message });
  }
}
