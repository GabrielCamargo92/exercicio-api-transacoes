import { v4 as createUuid } from "uuid";

export class Transactions {
  private _id: string;

  constructor(private _title: string, private _value: number, private _type: "income" | "outcome") {
    this._id = createUuid();
  }
  // getter
  public get id() {
    return this._id;
  }

  public get title() {
    return this._title;
  }

  public get value() {
    return this._value;
  }

  public get type() {
    return this._type;
  }

  //setter

  public set title(title: string) {
    this._title = title;
  }

  public set value(value: number) {
    this._value = value;
  }

  public set type(type: "income" | "outcome") {
    this._type = type;
  }
}
