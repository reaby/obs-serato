/* eslint-disable @typescript-eslint/no-misused-promises */
import StatusCodes from "http-status-codes";
import { Request, Response, Router } from "express";
import { paramMissingError, IRequest } from "@shared/constants";
import SeratoParser from '../seratoParser';

const router = Router();
const parser = new SeratoParser();

const { BAD_REQUEST, CREATED, OK } = StatusCodes;

/******************************************************************************
 *                      Get All Users - "GET /api/users/all"
 ******************************************************************************/

router.get(
  "/current",
   (_req: Request, res: Response) => {
    const current = parser.parse();
    return res.status(200).json(current);
  }
);

export default router;
