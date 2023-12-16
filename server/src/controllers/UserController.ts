import { Request, Response } from "express";
import { Citi, Crud } from "../global";

class UserController implements Crud {
  constructor(private readonly citi = new Citi("User")) {}
  create = async (request: Request, response: Response) => {
    const { firstName, lastName, age } = request.body;

    const isAnyUndefined = this.citi.areValuesUndefined(
      firstName,
      lastName,
      age
    );
    if (isAnyUndefined) return response.status(400).send();

    const newUser = { firstName, lastName, age };
    const { httpStatus, message } = await this.citi.insertIntoDatabase(newUser);

    return response.status(httpStatus).send({ message });
  };

  get = async (request: Request, response: Response) => {
    const { httpStatus, values } = await this.citi.getAll();

    return response.status(httpStatus).send(values);
  };

  delete = async (request: Request, response: Response) => {
    const { id } = request.params;

    const { httpStatus, messageFromDelete } = await this.citi.deleteValue(id);

    return response.status(httpStatus).send({ messageFromDelete });
  };

  update = async (request: Request, response: Response) => {
    const { id } = request.params;
    const { firstName, lastName, age } = request.body;

    const updatedValues = { firstName, lastName, age };

    const { httpStatus, messageFromUpdate } = await this.citi.updateValue(
      id,
      updatedValues
    );

    return response.status(httpStatus).send({ messageFromUpdate });
  };

  getById = async (request: Request, response: Response) => {
    const { id } = request.params;
  
    const { httpStatus, value } = await this.citi.getById(id);
  
    if (httpStatus === 404) {
      return response.status(httpStatus).send({ message: "User not found" });
    }
  
    return response.status(httpStatus).send(value);
  };
}

export default new UserController();
