import Joi from "joi";
import { ContainerTypes, ValidatedRequestSchema } from "express-joi-validation";

import {
  GetAuthorizationURLOptions,
  HandleAuthorizationCallbackOptions,
} from "./auth.service";
import { GetUserOptions } from "./user.service";

export interface GetAuthorizationURLRequest extends ValidatedRequestSchema {
  [ContainerTypes.Query]: GetAuthorizationURLOptions;
}

export const GetAuthorizationURLQuerySchema =
  Joi.object<GetAuthorizationURLOptions>({
    state: Joi.string(),
  });

export interface AuthorizationCallbackRequest extends ValidatedRequestSchema {
  [ContainerTypes.Query]: HandleAuthorizationCallbackOptions;
}

export const AuthorizationCallbackQuerySchema =
  Joi.object<HandleAuthorizationCallbackOptions>({
    code: Joi.string().required(),
    state: Joi.string().required(),
  });

export interface GetUserRequest extends ValidatedRequestSchema {
  [ContainerTypes.Query]: GetUserOptions;
}

export const GetUserQuerySchema = Joi.object<GetUserOptions>({
  id: Joi.string().required(),
});
