import { Request, Response } from "express";
import { UserDatabase } from "../database/user.database";
import { users } from "../database/users";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";
import { Transactions } from "../models/transactions.model";
import { User } from "../models/user.model";
import { SuccessResponse } from "../util/success.response";

export class TransactionsController {
  // http://localhost:4444/user/5bd700e3-88ea-453a-ba62-27633d4a1f8b/transactions
  public create(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { title, value, type } = req.body;
      const database = new UserDatabase();
      const user = database.getOne(userId);

      if (!userId) {
        return res.status(400).send({
          ok: false,
          message: "Id user not found",
        });
      }

      if (!user) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }

      if (!title) {
        return res.status(404).send({
          ok: false,
          message: "Title not found",
        });
      }

      if (!value) {
        return res.status(404).send({
          ok: false,
          message: "Value not found",
        });
      }

      if (!type) {
        return res.status(404).send({
          ok: false,
          message: "Type not found",
        });
      }

      const newTransaction = new Transactions(title, Number(value), type);
      user.transactions = user.transactions.concat(newTransaction);

      return res.status(201).send({
        ok: true,
        message: "Transactions success created",
        data: user,
        // transactions: user.transactions,
      });
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public getById(req: Request, res: Response) {
    try {
      const { userId, transactionId } = req.params;

      const database = new UserDatabase();
      const user = database.getOne(userId);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      const transactionFinded = user.transactions.find(
        (transaction) => transaction.id === transactionId
      );

      if (!transactionFinded) {
        return RequestError.notFound(res, "Transaction");
      }

      return SuccessResponse.ok(res, "Exibindo transação", transactionFinded);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  // http://localhost:4444/user/5bd700e3-88ea-453a-ba62-27633d4a1f8b/skill/nodejs
  public delete(req: Request, res: Response) {
    try {
      const { userId, idTransaction } = req.params;
      const user = users.find((user) => user.id === userId);
      if (!user) {
        return RequestError.notFound(res, "User");
      }
      const transaction = user.transactions.find((transaction) => transaction.id === idTransaction);
      if (!transaction) {
        return RequestError.notFound(res, "Transaction");
      }

      const indexTransaction = user.transactions.findIndex(
        (transaction) => transaction.id === idTransaction
      );

      user.transactions.splice(indexTransaction, 1);

      return res.status(200).send({
        ok: true,
        message: `Transaction was successfully deleted!`,
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public transactionExtract(req: Request, res: Response) {
    /////////////////////original
    try {
      const { userId } = req.params;
      const { title, type } = req.query;
      const user = users.find((user) => user.id === userId);
      if (!user) {
        return RequestError.notFound(res, "User");
      }

      const alltransactions = user.transactions;
      const transactionToJason = alltransactions.map((item) => {
        return {
          id: item.id,
          title: item.title,
          type: item.type,
          value: item.value,
        };
      });

      if (title) {
        let filterTitle = alltransactions.find(
          (transaction: Transactions) => transaction.title === title
        );
        if (filterTitle?.title === filterTitle?.title) {
          res.status(200).send({
            ok: true,
            message: "Title successfully obtained",
            data: filterTitle,
          });
        }
        RequestError.notFound(res, "Title");
      }

      if (type) {
        let filterType = alltransactions.filter(
          (transaction: Transactions) => transaction.type === type
        );

        res.status(200).send({
          ok: true,
          message: "Type successfully obtained",
          name: user.name,
          data: filterType,
        });

        RequestError.notFound(res, "Type");
      }

      let incomes = alltransactions
        .filter((transaction) => transaction.type == "income")
        .reduce((prev, transaction) => {
          return prev + transaction.value;
        }, 0);

      let outcomes = alltransactions
        .filter((transaction) => transaction.type == "outcome")
        .reduce((prev, transaction) => {
          return prev + transaction.value;
        }, 0);

      let result = incomes - outcomes;

      return res.status(200).send({
        transactions: transactionToJason,
        balance: {
          income: incomes,
          outcome: outcomes,
          total: result,
        },
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public listById(req: Request, res: Response) {
    try {
      const { userId, transactionId } = req.params;
      const user = users.find((user) => user.id === userId);
      if (!user) {
        return RequestError.notFound(res, "User");
      }
      const transaction = user.transactions.find((transaction) => transaction.id === transactionId);
      if (!transaction) {
        return RequestError.notFound(res, "Transaction");
      }
      return res.status(200).send({
        ok: true,
        message: "Transaction is here!",
        data: transaction,
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public editTransaction(req: Request, res: Response) {
    try {
      const { userId, idTransaction } = req.params;
      const { title, value, type } = req.body;
      const user = users.find((user) => user.id === userId);
      if (!user) {
        return RequestError.notFound(res, "User");
      }
      const transaction = user.transactions.find((transaction) => transaction.id === idTransaction);
      if (!transaction) {
        return RequestError.notFound(res, "Transaction");
      }

      const indexTransaction = user.transactions.findIndex(
        (transaction) => transaction.id === idTransaction
      );

      if (title) {
        transaction.title = title;
      }
      if (value) {
        transaction.value = value;
      }

      if (type) {
        transaction.type = type;
      }

      return res.status(200).send({
        ok: true,
        message: "Transaction successfully updated",
        data: transaction,
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
