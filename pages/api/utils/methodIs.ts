import { NextApiRequest, NextApiResponse } from "next";

export function methodIs(
  methods: string[],
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  if (methods.findIndex((method) => req.method === method) === -1) {
    res
      .status(405)
      .json({ error: `Only ${methods} requests are allowed to this endpoint` });
    return false;
  }
  return true;
}
