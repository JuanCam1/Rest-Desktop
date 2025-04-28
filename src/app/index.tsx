import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react"
import { Folder, Send, Plus, Save, ChevronRight, ChevronDown, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import Sidebar from "@/sections/sidebar/sidebar";



export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [folders, setFolders] = useState<FolderTypeI[]>([
    {
      id: "1",
      name: "My APIs",
      isOpen: true,
      requests: [
        {
          id: "req1",
          name: "Get Users",
          url: "https://jsonplaceholder.typicode.com/users",
          method: "GET",
          headers: [{ key: "Content-Type", value: "application/json" }],
          body: "",
        },
      ],
    },
  ])

  const [activeRequest, setActiveRequest] = useState<ApiRequestI | null>(folders[0].requests[0])
  const [response, setResponse] = useState<{ data: string; status: number; time: number } | null>(null)
  const [isLoading, setIsLoading] = useState(false)


  const handleSendRequest = async () => {
    if (!activeRequest) return

    setIsLoading(true)
    setResponse(null)

    const startTime = Date.now()

    try {
      const headers: HeadersInit = {}
      activeRequest.headers.forEach((h) => {
        if (h.key && h.value) headers[h.key] = h.value
      })

      const options: RequestInit = {
        method: activeRequest.method,
        headers,
      }

      if (activeRequest.method !== "GET" && activeRequest.body) {
        options.body = activeRequest.body
      }

      const res = await fetch(activeRequest.url, options)
      const data = await res.text()
      const endTime = Date.now()

      setResponse({
        data,
        status: res.status,
        time: endTime - startTime,
      })
    } catch (error) {
      setResponse({
        data: error instanceof Error ? error.message : "An unknown error occurred",
        status: 0,
        time: Date.now() - startTime,
      })
    } finally {
      setIsLoading(false)
    }
  }

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  const updateActiveRequest = (field: keyof ApiRequestI, value: any) => {
    if (!activeRequest) return

    setActiveRequest({
      ...activeRequest,
      [field]: value,
    })

    // Also update in folders
    setFolders(
      folders.map((folder) => ({
        ...folder,
        requests: folder.requests.map((req) => (req.id === activeRequest.id ? { ...req, [field]: value } : req)),
      })),
    )
  }

  const updateHeader = (index: number, field: "key" | "value", value: string) => {
    if (!activeRequest) return

    const newHeaders = [...activeRequest.headers]
    newHeaders[index] = { ...newHeaders[index], [field]: value }

    updateActiveRequest("headers", newHeaders)
  }

  const addHeader = () => {
    if (!activeRequest) return
    updateActiveRequest("headers", [...activeRequest.headers, { key: "", value: "" }])
  }

  const removeHeader = (index: number) => {
    if (!activeRequest) return
    const newHeaders = activeRequest.headers.filter((_, i) => i !== index)
    updateActiveRequest("headers", newHeaders)
  }




  return (
    <div className="flex bg-zinc-950 h-screen">

      <Sidebar
        setFolders={setFolders}
        activeRequest={activeRequest}
        setActiveRequest={setActiveRequest}
      />

      {/* Main content */}
      <div className="flex flex-col flex-1 h-full">
        {activeRequest ? (
          <>
            {/* Request editor */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-2 mb-4">
                <Select value={activeRequest.method} onValueChange={(value) => updateActiveRequest("method", value)}>
                  <SelectTrigger className="w-24">
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>

                <Input
                  value={activeRequest.url}
                  onChange={(e) => updateActiveRequest("url", e.target.value)}
                  placeholder="Enter request URL"
                  className="flex-1"
                />

                <Button onClick={handleSendRequest} disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send"}
                  {!isLoading && <Send className="ml-2 w-4 h-4" />}
                </Button>
              </div>

              <Input
                value={activeRequest.name}
                onChange={(e) => updateActiveRequest("name", e.target.value)}
                placeholder="Request name"
                className="mb-4"
              />

              <Tabs defaultValue="headers">
                <TabsList>
                  <TabsTrigger value="headers">Headers</TabsTrigger>
                  <TabsTrigger value="body">Body</TabsTrigger>
                </TabsList>

                <TabsContent value="headers" className="pt-4">
                  {activeRequest.headers.map((header, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                      <Input
                        value={header.key}
                        onChange={(e) => updateHeader(index, "key", e.target.value)}
                        placeholder="Header name"
                        className="flex-1"
                      />
                      <Input
                        value={header.value}
                        onChange={(e) => updateHeader(index, "value", e.target.value)}
                        placeholder="Value"
                        className="flex-1"
                      />
                      <Button variant="ghost" size="icon" onClick={() => removeHeader(index)} className="w-8 h-8">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}

                  <Button variant="outline" size="sm" onClick={addHeader} className="mt-2">
                    Add Header
                  </Button>
                </TabsContent>

                <TabsContent value="body" className="pt-4">
                  <Textarea
                    value={activeRequest.body}
                    onChange={(e) => updateActiveRequest("body", e.target.value)}
                    placeholder={
                      activeRequest.method === "GET"
                        ? "Body not available for GET requests"
                        : "Enter request body (JSON, XML, etc.)"
                    }
                    className="min-h-[200px] font-mono"
                    disabled={activeRequest.method === "GET"}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Response panel */}
            <div className="flex-1 p-4 overflow-auto">
              <h3 className="mb-2 font-medium text-lg">Response</h3>

              {isLoading && <div className="text-muted-foreground text-sm">Loading...</div>}

              {response && (
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <div
                      className={cn(
                        "text-sm font-medium px-2 py-1 rounded",
                        response.status >= 200 && response.status < 300
                          ? "bg-green-100 text-green-800"
                          : response.status >= 400
                            ? "bg-red-100 text-red-800"
                            : "bg-yellow-100 text-yellow-800",
                      )}
                    >
                      Status: {response.status}
                    </div>
                    <div className="text-muted-foreground text-sm">Time: {response.time}ms</div>
                  </div>

                  <div className="bg-muted p-4 rounded-md overflow-auto">
                    <pre className="font-mono text-sm whitespace-pre-wrap">{response.data}</pre>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            Select a request or create a new one
          </div>
        )}
      </div>
    </div>
  )
}
