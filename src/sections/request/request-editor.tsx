import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRestStore } from "@/store";
import { Send, Trash2 } from "lucide-react";

const RequestEditor = () => {
  const activeRequest = useRestStore((state) => state.activeRequest);
  const setActiveRequest = useRestStore((state) => state.setActiveRequest);
  const isLoading = useRestStore((state) => state.isPending);
  const updateHeader = useRestStore((state) => state.updateHeader);
  const removeHeader = useRestStore((state) => state.removeHeader);
  const addHeader = useRestStore((state) => state.addHeader);

  const handleSendRequest = async () => {
    // if (!activeRequest) return
    // setIsLoading(true)
    // setResponse(null)
    // const startTime = Date.now()
    // try {
    //   const headers: HeadersInit = {}
    //   activeRequest.headers.forEach((h) => {
    //     if (h.key && h.value) headers[h.key] = h.value
    //   })
    //   const options: RequestInit = {
    //     method: activeRequest.method,
    //     headers,
    //   }
    //   if (activeRequest.method !== "GET" && activeRequest.body) {
    //     options.body = activeRequest.body
    //   }
    //   const res = await fetch(activeRequest.url, options)
    //   const data = await res.text()
    //   const endTime = Date.now()
    //   setResponse({
    //     data,
    //     status: res.status,
    //     time: endTime - startTime,
    //   })
    // } catch (error) {
    //   setResponse({
    //     data: error instanceof Error ? error.message : "An unknown error occurred",
    //     status: 0,
    //     time: Date.now() - startTime,
    //   })
    // } finally {
    //   setIsLoading(false)
    // }
  };
  return (
    <div className="p-4 border-b">
      <div className="flex items-center gap-2 mb-4">
        <Select
          value={activeRequest?.method}
          onValueChange={(value) => setActiveRequest("method", value)}
        >
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
          value={activeRequest?.url}
          onChange={(e) => setActiveRequest("url", e.target.value)}
          placeholder="Enter request URL"
          className="flex-1"
        />

        <Button onClick={handleSendRequest} disabled={isLoading}>
          {isLoading ? "Sending..." : "Send"}
          {!isLoading && <Send className="ml-2 w-4 h-4" />}
        </Button>
      </div>

      <Input
        value={activeRequest?.name}
        onChange={(e) => setActiveRequest("name", e.target.value)}
        placeholder="Request name"
        className="mb-4"
      />

      <Tabs defaultValue="headers">
        <TabsList>
          <TabsTrigger value="headers">Headers</TabsTrigger>
          <TabsTrigger value="body">Body</TabsTrigger>
        </TabsList>

        <TabsContent value="headers" className="pt-4">
          {activeRequest?.headers.map((header, index) => (
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
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeHeader(index)}
                className="w-8 h-8"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={addHeader}
            className="mt-2"
          >
            Add Header
          </Button>
        </TabsContent>

        <TabsContent value="body" className="pt-4">
          <textarea
            value={activeRequest?.body}
            onChange={(e) => setActiveRequest("body", e.target.value)}
            placeholder={
              activeRequest?.method === "GET"
                ? "Body not available for GET requests"
                : "Enter request body (JSON, XML, etc.)"
            }
            className="min-h-[200px] font-mono"
            disabled={activeRequest?.method === "GET"}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default RequestEditor;
