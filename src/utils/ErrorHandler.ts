import { Request, Response, NextFunction } from "express";
import { HTTPClientError, HTTP404Error } from "./HttpErrors";

export const notFoundError = (req: Request) => {
    throw new HTTP404Error(`Method not found: ${req.path}`);
};

export const clientError = (err: HTTPClientError, res: Response, next: NextFunction) => {
    if (err instanceof HTTPClientError) {
        console.warn(err);
        res.status(err.statusCode).send(err.message);
    } else {
        next(err);
    }
};

export const serverError = (err: Error, res: Response, next: NextFunction) => {
    console.error(err);
    if (process.env.NODE_ENV === "production") {
        res.status(500).send("Internal Server Error");
    } else {
        res.status(500).send(err.stack);
    }
};
