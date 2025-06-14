import type { StateCreator } from "zustand";

export interface ResponseState {
  response: ResponseModelI | null;
  isLoadingResponse: boolean;
  isErrorResponse: boolean;
  errorResponse: string | null;
  isSuccessResponse: boolean;
}

export const createResponseState: StateCreator<ResponseState> = () => ({
  response: null,
  isLoadingResponse: false,
  isErrorResponse: false,
  errorResponse: null,
  isSuccessResponse: false
});
