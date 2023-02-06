import { NextFunction, Request, Response } from "express";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { ServerError } from "../errors/server.error";
import { UserDatabase } from "../database/user.database";

export class CpfValidatorMiddleware {
  public static cpfValidMiddleware(req: Request, res: Response, next: NextFunction) {
    try {
      const { cpf } = req.body;

      if (!cpf) {
        return res.status(400).send({
          ok: false,
          message: "CPF was not provided (middleware)",
        });
      }

      const cpfText = cpf.toString().padStart(11, "0");

      let isValid = cpfValidator.isValid(cpfText);
      if (!isValid) {
        return res.status(400).send({
          ok: false,
          message: "CPF is invalid",
        });
      }

      next();
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public static cpfAlreadyExists(req: Request, res: Response, next: NextFunction) {
    try {
      const { cpf } = req.body;

      const database = new UserDatabase();
      const user = database.getByCpf(cpf);

      if (user) {
        return res.status(400).send({
          ok: false,
          message: "User already exists",
        });
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
