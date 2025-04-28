import { instance } from "@/lib/instance"

export const getFolders = async (signal: AbortSignal) => {
  return await instance.get<SendResponseI<FolderTypeI[]>>("/folder", {
    signal
  });
}