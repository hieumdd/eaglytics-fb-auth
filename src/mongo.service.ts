import createError from "http-errors";
import { MongoClient } from "mongodb";

import { config } from "./config";

export const client = new MongoClient(config().MONGO_URI!);

type MongoOperation<D extends object, R = any> = (operations: {
  getOne: (id: string) => Promise<D | null>;
  setOne: (id: string, data: D) => Promise<any>;
}) => Promise<R>;

export const withMongoConnection = <D extends object>(
  collectionName: string,
) => {
  const collection = client.db("facebook").collection(collectionName);
  return async (operation: MongoOperation<D>) => {
    await client.connect();
    const results = await operation({
      getOne: async (id: string) => {
        const result = await collection.findOne<D>({ id });
        if (!result) {
          throw createError(404);
        }
        return result;
      },
      setOne: async (id: string, data: D) => {
        return await collection.replaceOne(
          { id },
          { ...data, id },
          { upsert: true },
        );
      },
    });
    await client.close();
    return results;
  };
};
