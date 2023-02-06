import { User } from "../models/user.model";
import { users } from "./users";

export class UserDatabase {
  public list() {
    return [...users];
  }

  public getOne(id: string) {
    return users.find((user) => user.id === id);
  }

  public getByCpf(cpf: string) {
    return users.find((user: { cpf: string }) => user.cpf === cpf);
  }

  public getByEmail(email: string) {
    return users.find((user: { email: string }) => user.email === email);
  }

  public getByName(name: string) {
    return users.find((user: { name: string }) => user.name === name);
  }

  public getIndex(id: string) {
    return users.findIndex((user: { id: string }) => user.id === id);
  }

  public create(user: User) {
    users.push(user);
  }

  public delete(index: number) {
    users.splice(index, 1);
  }
}
