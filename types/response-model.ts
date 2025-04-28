type stateType = "success" | "error";

export interface SendResponse<T> {
  exito: stateType;
  estado: number;
  mensaje: string;
  data: T;
}
