import { NextFunction, Request, Response, Router } from "express";
import { TransactionsController } from "../controllers/transactions.controller";
import { UserController } from "../controllers/user.controller";
import { CpfValidatorMiddleware } from "../middlewares/cpf-validator.middleware";

import { TransactionValidatorMiddleware } from "../middlewares/transaction-validator";
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
    [
      TransactionValidatorMiddleware.validateMandatoryFields,
      TransactionValidatorMiddleware.validateUserExists,
    ],
    new TransactionsController().create
  );

  // DELETE http://localhost:4444/user/:userId/transactions/:idTransaction
  app.delete(
    "/:userId/transactions/:idTransaction",
    TransactionValidatorMiddleware.validateUserExists,
    new TransactionsController().delete
  );

  //GET - Filtrar pelo id do user http://localhost:4444/user/:userId/transactions/   <-- via req.query
  app.get(
    "/:userId/transactions/",
    [TransactionValidatorMiddleware.validateUserExists],
    new TransactionsController().transactionExtract
  );

  //GET - Filtrar pelo ID da transaction - http://localhost:4444/user/:userId/transactions/:transactionId
  app.get(
    "/:userId/transactions/:transactionId",
    TransactionValidatorMiddleware.validateUserExists,
    new TransactionsController().listById
  );

  app.put(
    "/:userId/transactions/:idTransaction",
    [
      TransactionValidatorMiddleware.validateUserExists,
      TransactionValidatorMiddleware.validateMandatoryFields,
    ],
    new TransactionsController().editTransaction
  );

  return app;
};
