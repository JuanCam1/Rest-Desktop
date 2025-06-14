import { create } from "zustand";
import { createFolderState, type FolderState } from "./folder-slice";
import { createResponseState, type ResponseState } from "./response-slice";

type StoreState = FolderState & ResponseState;

export const useRestStore = create<StoreState>()((...a) => ({
  ...createFolderState(...a),
  ...createResponseState(...a),
}));
