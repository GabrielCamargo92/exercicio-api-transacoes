import { Request, Response } from "express";
import { RequestError } from "../errors/request.error";
import { ServerError } from "../errors/server.error";
import { SuccessResponse } from "../util/success.response";
import { User } from "../models/user.model";
import { UserDatabase } from "../database/user.database";

export class UserController {
  public getID(req: Request, res: Response) {
    //filtra pelo ID
    try {
      const { userID } = req.params;

      const database = new UserDatabase();
      const user = database.getOne(userID);

      if (!user) {
        return RequestError.notFound(res, "User");
      }

      res.status(200).send({
        ok: true,
        message: "User successfully obtained",
        data: {
          id: user.id,
          name: user.name,
          cpf: user.cpf,
          email: user.email,
          age: user.age,
        },
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public getFilters(req: Request, res: Response) {
    // filtrar por cpf, nome ou email
    try {
      const { name, email, cpf } = req.query;
      const database = new UserDatabase();
      const users = database.list();
      const result = users.map((user) => user.toJson());

      if (name) {
        let nameUser = database.getByName(String(name));
        if (nameUser) {
          res.status(200).send({
            ok: true,
            message: "User successfully obtained",
            data: {
              id: nameUser.id,
              name: nameUser.name,
              cpf: nameUser.cpf,
              email: nameUser.email,
              age: nameUser.age,
            },
          });
        }
        RequestError.notFound(res, "User");
      }

      if (email) {
        let emailUser = database.getByEmail(String(email));

        if (emailUser) {
          res.status(200).send({
            ok: true,
            message: "User successfully obtained",
            data: {
              id: emailUser.id,
              name: emailUser.name,
              cpf: emailUser.cpf,
              email: emailUser.email,
              age: emailUser.age,
            },
          });
        }
        RequestError.notFound(res, "User");
      }

      if (cpf) {
        let cpfUser = database.getByCpf(String(cpf));
        if (cpfUser) {
          res.status(200).send({
            ok: true,
            message: "User successfully obtained",
            data: {
              id: cpfUser.id,
              name: cpfUser.name,
              cpf: cpfUser.cpf,
              email: cpfUser.email,
              age: cpfUser.age,
            },
          });
        }
        RequestError.notFound(res, "User");
      }
      res.status(200).send({
        //3°
        ok: true,
        message: "Users successfully listed",
        data: result,
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public create(req: Request, res: Response) {
    try {
      const { name, cpf, email, age } = req.body;

      const user = new User(name, cpf, email, age);

      const database = new UserDatabase();
      database.create(user);

      return SuccessResponse.created(res, "User was successfully create", user);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const database = new UserDatabase();
      const userIndex = database.getIndex(id);

      if (userIndex < 0) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }

      database.delete(userIndex);

      return SuccessResponse.ok(res, "User was successfully deleted", userIndex);
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }

  public update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, cpf, email, age } = req.body;

      const database = new UserDatabase();
      const user = database.getOne(id);

      if (!user) {
        return res.status(404).send({
          ok: false,
          message: "User not found",
        });
      }

      if (name) {
        user.name = name;
      }
      if (cpf) {
        user.cpf = cpf;
      }

      if (email) {
        user.email = email;
      }
      if (age) {
        user.age = age;
      }
      return res.status(200).send({
        ok: true,
        message: "User successfully updated",
      });
    } catch (error: any) {
      return ServerError.genericError(res, error);
    }
  }
}
