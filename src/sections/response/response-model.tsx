import { cn } from "@/lib/utils";
import { useRestStore } from "@/store";

const ResponseModel = () => {
  const response = useRestStore((state) => state.response);
  const isLoading = useRestStore((state) => state.isLoadingResponse);
  return (
    <div className="flex-1 p-4 overflow-auto">
      <h3 className="mb-2 font-medium text-lg">Response</h3>

      {isLoading && (
        <div className="text-muted-foreground text-sm">Loading...</div>
      )}

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
            <div className="text-muted-foreground text-sm">
              Time: {response.time}ms
            </div>
          </div>

          <div className="bg-muted p-4 rounded-md overflow-auto">
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {response.data}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
export default ResponseModel;
