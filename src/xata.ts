// Generated by Xata Codegen 0.26.7. Please do not edit.
import { buildClient } from "@xata.io/client";
import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";
import dotenv from 'dotenv';

dotenv.config();

const tables = [
  {
    name: "execution_result",
    columns: [{ name: "execution_result", type: "string" }],
  },
] as const;

export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;

export type ExecutionResult = InferredTypes["execution_result"];
export type ExecutionResultRecord = ExecutionResult & XataRecord;

export type DatabaseSchema = {
  execution_result: ExecutionResultRecord;
};

const DatabaseClient = buildClient();

const defaultOptions = {
  databaseURL:
    "https://0xsnowman-s-workspace-oh14af.us-east-1.xata.sh/db/eyekonos-ticketing",
};

export class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions) {
    super({ ...defaultOptions, ...options }, tables);
  }
}

let instance: XataClient | undefined = undefined;

export const getXataClient = () => {
  if (instance) return instance;

  instance = new XataClient();
  return instance;
};
