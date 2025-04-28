import { KeysQuery } from "@/const/keys-query";
import { getFolders } from "@/services/folder-service";
import { useQuery } from "@tanstack/react-query";
import type { StateCreator } from "zustand";


export interface FolderState {
  folders: FolderTypeI[]
  isPending: boolean;
  isError: boolean;
  refreshing: boolean;
  activeRequest: ApiRequestI | null

  loadFolders: (folders: FolderTypeI[]) => void;
  setActiveRequest: (request: ApiRequestI | null) => void;

  newFolderName: string;
  showNewFolder: boolean;
  toggleFolder: (folderId: string) => void;
  addFolder: () => void;
  addRequest: (folderId: string) => void;
  deleteRequest: (folderId: string, requestId: string) => void;
  setNewFolderName: (name: string) => void;
  setShowNewFolder: (show: boolean) => void;
}

export const createFolderState: StateCreator<FolderState> = (set, get) => ({
  folders: [],
  isPending: false,
  isError: false,
  refreshing: false,
  activeRequest: null,
  newFolderName: "",
  showNewFolder: false,

  toggleFolder: (folderId: string) => {
    set((state) => ({
      folders: state.folders.map((folder) => (folder.id === folderId ? { ...folder, isOpen: !folder.isOpen } : folder)),
    }))
  },
  addFolder: () => {
    set((state) => ({
      folders: [...state.folders, { id: Date.now().toString(), name: "New Folder", isOpen: true, requests: [] }],
      newFolderName: "",
      showNewFolder: false,
    }))
  },
  addRequest: (folderId: string) => {
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === folderId ? { ...folder, requests: [...folder.requests, { id: Date.now().toString(), name: "New Request", url: "", method: "GET", headers: [{ key: "Content-Type", value: "application/json" }], body: "" }] } : folder,
      ),
    }))
  },
  deleteRequest: (folderId: string, requestId: string) => {
    set((state) => ({
      folders: state.folders.map((folder) =>
        folder.id === folderId
          ? { ...folder, requests: folder.requests.filter((req) => req.id !== requestId) }
          : folder,
      ),
    }))

    if (get().activeRequest?.id === requestId) {
      set({ activeRequest: null })
    }
  },
  setNewFolderName: (name: string) => {
    set({ newFolderName: name })
  },
  setShowNewFolder: (show: boolean) => {
    set({ showNewFolder: show })
  },
  loadFolders: async (folders: FolderTypeI[]) => {
    set({ folders })
  },
  setActiveRequest: (request: ApiRequestI | null) => {
    set({ activeRequest: request })
  },
})