import { instance } from "@/lib/instance"

export const getFoldersService = async (signal: AbortSignal) => {
  return await instance.get<SendResponseI<FolderTypeI[]>>("/folder", {
    signal
  });
}

export const addFolderService = async (folder: Omit<FolderTypeI, "requests" | "id">, signal: AbortSignal) => {
  return await instance.post<SendResponseI<FolderTypeI>>("/folder", folder, {
    signal
  });
}

export const updateFolderService = async (folder: FolderTypeI, signal: AbortSignal) => {
  return await instance.put<SendResponseI<FolderTypeI>>(`/folder`, folder, {
    signal
  });
}
export const deleteFolderService = async (id: string, signal: AbortSignal) => {
  return await instance.delete<SendResponseI<FolderTypeI>>(`/folder/${id}`, {
    signal
  });
}

export const getFolderByIdService = async (id: string, signal: AbortSignal) => {
  return await instance.get<SendResponseI<FolderTypeI>>(`/folder/${id}`, {
    signal
  });
}