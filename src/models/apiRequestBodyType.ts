import { type ModelType } from "./ModelType";
import { type ApiMessageType } from "./ApiMessageType";

export type apiRequestBodyType = {
    model: ModelType,
    messages: ApiMessageType[],
  };