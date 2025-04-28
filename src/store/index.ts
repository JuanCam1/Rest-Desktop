import { create } from "zustand";
import { createFolderState, type FolderState } from "./folder-slice";


type StoreState = FolderState;

export const useRestStore = create<StoreState>()(
  (...a) => ({
    ...createFolderState(...a),
  }),
);

