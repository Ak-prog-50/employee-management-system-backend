import { Request } from "express";

export interface IRequest extends Request {
  // body: { [key: string]: string | undefined };
  body: { [key: string]: any };
}
