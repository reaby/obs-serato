/* eslint-disable @typescript-eslint/no-misused-promises */
import { Request, Response, Router } from "express";
import SeratoParser from '../seratoParser';

const router = Router();
const parser = new SeratoParser();

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get(
  "/current",
   async (_req: Request, res: Response) => {
    const current = await parser.parse();
    return res.status(200).json(current);
  }
);

export default router;
