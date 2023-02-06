import { v4 as createUuid } from "uuid";
import { cpf as cpfValidator } from "cpf-cnpj-validator";
import { Transactions } from "./transactions.model";

export class User {
  private _id: string;
  private _transactions: Transactions[] = [];

  constructor(
    private _name: string,
    private _cpf: string,
    private _email: string,
    private _age: string
  ) {
    this._id = createUuid();
  }

  // getter
  public get id() {
    return this._id;
  }

  public get name() {
    return this._name;
  }

  public get cpf() {
    return this._cpf;
  }

  public get email() {
    return this._email;
  }

  public get age() {
    return this._age;
  }

  public get transactions() {
    return this._transactions ?? [];
  }

  // setter
  public set name(name: string) {
    this._name = name;
  }

  public set cpf(cpf: string) {
    this._cpf = cpf;
  }

  public set email(email: string) {
    this._email = email;
  }

  public set age(age: string) {
    this._age = age;
  }

  public set transactions(transactions: Transactions[]) {
    this._transactions = transactions;
  }

  public toJson() {
    return {
      id: this._id,
      nome: this._name,
      cpf: cpfValidator.format(this._cpf.toString().padStart(11, "0")),
      email: this.email,
      idade: this._age,
    };
  }
}
