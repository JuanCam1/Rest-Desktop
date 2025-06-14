import type { RequestMethod, ApiRequest, FolderType } from "./folder-model";
import type { DataResponseModel } from "./data-response-model";
import type { SendResponse } from "./response-model"

declare global {
  type RequestMethodI = RequestMethod;
  type ApiRequestI = ApiRequest;
  type FolderTypeI = FolderType;
  type SendResponseI<T> = SendResponse<T>;
  type ResponseModelI = DataResponseModel
}