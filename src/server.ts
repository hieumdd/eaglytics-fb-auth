import express, { NextFunction, Request, Response } from "express";
import { ValidatedRequest, createValidator } from "express-joi-validation";
import createError from "http-errors";
import bodyParser from "body-parser";
import Joi from "joi";

import { logger } from "./logging.service";
import {
  GetAuthorizationURLRequest,
  GetAuthorizationURLQuerySchema,
  AuthorizationCallbackRequest,
  AuthorizationCallbackQuerySchema,
  GetUserRequest,
  GetUserQuerySchema,
} from "./facebook/facebook.request.dto";
import {
  getAuthorizationURL,
  handleAuthorizationCallback,
} from "./facebook/auth.service";
import { getUser } from "./facebook/user.service";

export const server = () => {
  const validator = createValidator({
    passError: true,
    joi: { stripUnknown: true },
  });
  const app = express();

  app.use(bodyParser.json());

  app.use(({ method, path, query, body }, res, next) => {
    logger.info({ method, query, path, body });
    res.on("finish", () => {
      logger.debug({ method, path, query, body, status: res.statusCode });
    });
    next();
  });

  app.get(
    "/authorize",
    validator.query(GetAuthorizationURLQuerySchema),
    ({ query }: ValidatedRequest<GetAuthorizationURLRequest>, res) => {
      res.status(200).json({ url: getAuthorizationURL(query) });
    },
  );

  app.get(
    "/callback",
    validator.query(AuthorizationCallbackQuerySchema),
    ({ query }: ValidatedRequest<AuthorizationCallbackRequest>, res, next) => {
      handleAuthorizationCallback(query)
        .then(() => res.status(200).json({ status: "ok" }))
        .catch(next);
    },
  );

  app.get(
    "/user",
    validator.query(GetUserQuerySchema),
    ({ query }: ValidatedRequest<GetUserRequest>, res, next) => {
      getUser(query)
        .then((result) => res.status(200).json)
        .catch(next);
    },
  );

  app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    if (Joi.isError(error.error)) {
      logger.warn({ error: error.error });
      res.status(400).json({ error: error.error });
      return;
    }

    if (createError.isHttpError(error)) {
      logger.warn({ error: error.message });
      res.status(error.statusCode).json({ error });
      return;
    }

    logger.error({ error });
    res.status(500).json({ error });
  });

  app.listen(8080);
};
