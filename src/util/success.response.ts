import { Response } from "express";
import { Transactions } from "../models/transactions.model";

export class SuccessResponse {
  static success(res: Response<any, Record<string, any>>, arg1: string, transaction: Transactions) {
    throw new Error("Method not implemented.");
  }
  public static ok(res: Response, message: string, data: any) {
    return res.status(200).send({
      ok: true,
      message,
      data,
    });
  }

  public static created(res: Response, message: string, data: any) {
    return res.status(201).send({
      ok: true,
      message,
      data,
    });
  }
}
