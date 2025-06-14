import { KeysQuery } from "@/const/keys-query";
import { query } from "@/lib/query";
import { addFolderService } from "@/services/folder-service";
import type { StateCreator } from "zustand";
const abortController = new AbortController();

interface AddFolderType {
  error: string | null;
  success: boolean
}


export interface FolderState {
  folders: FolderTypeI[]
  isPending: boolean;
  isError: boolean;
  refreshing: boolean;
  activeRequest: ApiRequestI | null

  loadFolders: (folders: FolderTypeI[]) => void;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  setActiveRequest: (field: keyof ApiRequestI, value: any) => void;

  newFolderName: string;
  showNewFolder: boolean;
  toggleFolder: (folderId: string) => void;
  addFolder: (folderName: string) => Promise<AddFolderType>;
  addRequest: (folderId: string) => void;
  deleteRequest: (folderId: string, requestId: string) => void;
  setNewFolderName: (name: string) => void;
  setShowNewFolder: (show: boolean) => void;

  updateHeader: (index: number, field: "key" | "value", value: string) => void;
  addHeader: () => void;
  removeHeader: (index: number) => void;
}

// const addHeader = () => {
//     if (!activeRequest) return
//     updateActiveRequest("headers", [...activeRequest.headers, { key: "", value: "" }])
//   }

//   const removeHeader = (index: number) => {
//     if (!activeRequest) return
//     const newHeaders = activeRequest.headers.filter((_, i) => i !== index)
//     updateActiveRequest("headers", newHeaders)
//   }
export const createFolderState: StateCreator<FolderState> = (set, get) => ({
  folders: [],
  isPending: false,
  isError: false,
  refreshing: false,
  activeRequest: null,
  newFolderName: "",
  showNewFolder: false,

  addHeader: () => {
    const request = get().activeRequest
    if (!request) return

    const newHeaders = [...request.headers, { key: "", value: "" }]
    get().setActiveRequest("headers", newHeaders)
  },
  removeHeader: (index: number) => {
    const request = get().activeRequest
    if (!request) return
    const newHeaders = request.headers.filter((_, i) => i !== index)
    get().setActiveRequest("headers", newHeaders)
  },

  updateHeader: (index: number, field: "key" | "value", value: string) => {
    const request = get().activeRequest
    if (!request) return

    const newHeaders = [...request.headers]
    newHeaders[index] = { ...newHeaders[index], [field]: value }

    get().setActiveRequest("headers", newHeaders)
  },

  toggleFolder: (folderId: string) => {
    set((state) => ({
      folders: state.folders.map((folder) => (folder.id === folderId ? { ...folder, isOpen: !folder.isOpen } : folder)),
    }))
  },
  addFolder: async (folderName: string) => {
    try {
      await addFolderService(
        {
          name: folderName,
          isOpen: false,
        },
        abortController.signal,
      );

      query.invalidateQueries({
        queryKey: [KeysQuery.FolderList],
      });
      return { error: null, success: true };
    } catch (e) {
      console.log(e);
      return { error: "No se pudo crear la carpeta.", success: false };
    }
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
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  setActiveRequest: (field: keyof ApiRequestI, value: any) => {
    const request = get().activeRequest
    if (!request) return
    request[field] = value
    set({ activeRequest: request })
  },
})