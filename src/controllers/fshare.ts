import { FshareClient, googleSearch, search } from "../clients";
import { fshareFactory } from "../factory";
import { Request, Response } from "express";
import path from "path";
import { autoComplete } from "../clients/film";

const client = FshareClient();

export const index = (request: Request, response: Response) => {
  return response.sendFile("views/index.html", { root: path.resolve() });
};

export const login = (account: fshareFactory.FshareAccount) => {
  return client.login(account);
};

export const refreshToken = () => {
  return client.refreshToken();
};

export const getFile = async (request: Request, response: Response) => {
  try {
    const result = await client.getFile(request.body);
    return response.json(result);
  } catch (error) {
    return response.json({ error });
  }
};

export const getFolder = async (request: Request, response: Response) => {
  try {
    const result = await client.getFolder(request.body.code);
    return response.json(result);
  } catch (error) {
    return response.json({ error });
  }
};

export const searchFilm = async (request: Request, response: Response) => {
  try {
    const result = await search(request.body.filmName);
    return response.json(result);
  } catch (error) {
    return response.json({ error });
  }
};

export const autoCompleteFilm = async (
  request: Request,
  response: Response
) => {
  try {
    const result = await autoComplete(<string>request.query.keyword);
    return response.json(result);
  } catch (error) {
    return response.json({ error });
  }
};

export const searchGoogle = async (request: Request, response: Response) => {
  try {
    const result = await googleSearch(request.body.q);
    return response.json(result);
  } catch (error) {
    return response.json({ error });
  }
};
