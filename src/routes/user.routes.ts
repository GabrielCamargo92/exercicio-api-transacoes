import { NextFunction, Request, Response, Router } from "express";
import { TransactionsController } from "../controllers/transactions.controller";
import { UserController } from "../controllers/user.controller";
import { CpfValidatorMiddleware } from "../middlewares/cpf-validator.middleware";

import { logMethodMiddleware, LogMiddleware } from "../middlewares/log.middleware";
import { UserValidatorMiddleware } from "../middlewares/user-validator.middleware";

// http://localhost:4444/
export const userRoutes = () => {
  const app = Router();

  // GET http://localhost:4444/

  app.get("/", new UserController().getFilters);

  // GET http://localhost:4444/1234abc
  app.get("/:userID", new UserController().getID);

  // POST http://localhost:4444/
  app.post(
    "/",
    [
      UserValidatorMiddleware.validateMandatoryFields,
      CpfValidatorMiddleware.cpfValidMiddleware,
      CpfValidatorMiddleware.cpfAlreadyExists,
    ],
    new UserController().create
  );

  // DELETE http://localhost:4444/user/abc-1234
  app.delete("/:id", new UserController().delete);

  // PUT http://localhost:4444/user/abc-1234
  app.put("/:id", new UserController().update);

  // POST http://localhost:4444/user/:id/transactions
  app.post(
    "/:userId/transactions",
    UserValidatorMiddleware.validateMandatoryFields,
    new TransactionsController().create
  );

  // DELETE http://localhost:4444/user/:userId/transactions/:idTransaction
  app.delete(
    "/:userId/transactions/:idTransaction",
    UserValidatorMiddleware.validateMandatoryFields,
    new TransactionsController().delete
  );

  //GET - Filtrar pelo id do user http://localhost:4444/user/:userId/transactions/   <-- via req.query
  app.get(
    "/:userId/transactions/",
    UserValidatorMiddleware.validateMandatoryFields,
    new TransactionsController().transactionExtract
  );

  //GET - Filtrar pelo ID da transaction - http://localhost:4444/user/:userId/transactions/:transactionId
  app.get(
    "/:userId/transactions/:transactionId",
    UserValidatorMiddleware.validateMandatoryFields,
    new TransactionsController().listById
  );

  app.put(
    "/:userId/transactions/:idTransaction",
    UserValidatorMiddleware.validateMandatoryFields,
    new TransactionsController().editTransaction
  );

  return app;
};
