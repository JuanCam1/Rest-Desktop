import { toast } from "sonner";

export const notifySucces = (message: string) => {
  return toast.success(message);
}
export const notifyError = (message: string) => {
  return toast.error(message);
}
export const notifyWarning = (message: string) => {
  return toast.warning(message);
}
export const notifyInfo = (message: string) => {
  return toast.info(message);
}