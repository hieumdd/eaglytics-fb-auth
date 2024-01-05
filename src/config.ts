import Joi from "joi";

export const config = () => {
  return Joi.attempt(
    process.env,
    Joi.object<{
      PUBLIC_URL: string;
      FACEBOOK_CLIENT_ID: string;
      FACEBOOK_CLIENT_SECRET: string;
      MONGO_URI: string;
    }>({
      PUBLIC_URL: Joi.string().required(),
      FACEBOOK_CLIENT_ID: Joi.string().required(),
      FACEBOOK_CLIENT_SECRET: Joi.string().required(),
      MONGO_URI: Joi.string().required(),
    }),
    { allowUnknown: true },
  );
};
