import { NextFunction, Request, Response } from "express";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";

export class UserValidatorMiddleware {
  public static validateMandatoryFields(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, cpf, email, age } = req.body;

      if (!name) {
        return RequestError.fieldNotProvided(res, "Name");
      }

      if (!cpf) {
        return RequestError.fieldNotProvided(res, "cpf");
      }

      if (!email) {
        return RequestError.fieldNotProvided(res, "email");
      }

      if (!age) {
        return RequestError.fieldNotProvided(res, "age");
      }

      next();
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
