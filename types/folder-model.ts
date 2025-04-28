export type RequestMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH"

export interface ApiRequest {
  id: string
  name: string
  url: string
  method: RequestMethod
  headers: { key: string; value: string }[]
  body: string
}

export interface FolderType {
  id: string
  name: string
  isOpen: boolean
  requests: ApiRequest[]
}