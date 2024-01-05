import { API_VER } from "./facebook.const";
import { userRepository } from "./user.repository";

export type GetUserOptions = { id: string };

export const getUser = async ({ id }: GetUserOptions) => {
  const user = await userRepository(({ getOne }) => getOne(id));
  return { API_VER, token: user.access_token };
};
