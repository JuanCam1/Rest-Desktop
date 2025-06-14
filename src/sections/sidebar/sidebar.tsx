import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { KeysQuery } from "@/const/keys-query";
import { notifyError } from "@/lib/notification";
import { cn } from "@/lib/utils";
import { getFoldersService } from "@/services/folder-service";
import { useRestStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, ChevronRight, Folder, Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import CreateFolder from "./create-folder";

const Sidebar = () => {
  const [showNewFolder, setShowNewFolder] = useState(true);

  const loadFolders = useRestStore((state) => state.loadFolders);
  const activeRequest = useRestStore((state) => state.activeRequest);
  const deleteRequest = useRestStore((state) => state.deleteRequest);

  const addRequest = useRestStore((state) => state.addRequest);
  const toggleFolder = useRestStore((state) => state.toggleFolder);

  const { isPending, isError, data } = useQuery({
    queryKey: [KeysQuery.FolderList],
    queryFn: ({ signal }) => getFoldersService(signal),
  });

  useEffect(() => {
    if (data?.data.data) {
      loadFolders(data.data.data);
    }
  }, []);

  if (isPending) {
    return <div>Loading...</div>;
  }

  console.log(data);

  if (isError || !data.data || data.data.data === undefined) {
    notifyError("Error al obtener las carpetas");
    return <div>Error al obtener las carpetas</div>;
  }

  const folders = data.data.data;

  console.log(folders);
  return (
    <div className="flex flex-col p-4 border-r w-64 h-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Carpetas</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowNewFolder(!showNewFolder)}
          className="w-8 h-8"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      {/* {showNewFolder && (
        <div className="flex gap-2 mb-2">
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name"
            className="h-8"
          />
          <Button size="sm" onClick={addFolder} className="h-8">
            <Save className="w-4 h-4" />
          </Button>
        </div>
      )} */}

      <div className="flex-1 overflow-y-auto">
        {folders.map((folder) => (
          <div key={folder.id} className="mb-2">
            <div
              className="flex items-center gap-2 hover:bg-muted p-2 rounded-md cursor-pointer"
              onClick={() => toggleFolder(folder.id)}
            >
              {folder.isOpen ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              <Folder className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{folder.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  addRequest(folder.id);
                }}
                className="ml-auto w-6 h-6"
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>

            {folder.isOpen && (
              <div className="pl-8">
                {folder.requests.map((request) => (
                  <div
                    key={request.id}
                    className={cn(
                      "flex items-center justify-between p-2 rounded-md text-sm cursor-pointer",
                      activeRequest?.id === request.id
                        ? "bg-muted"
                        : "hover:bg-muted/50",
                    )}
                    // onClick={() => setActiveRequest(request)}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "text-xs font-medium px-2 py-0.5 rounded",
                          request.method === "GET"
                            ? "bg-blue-100 text-blue-800"
                            : request.method === "POST"
                              ? "bg-green-100 text-green-800"
                              : request.method === "PUT"
                                ? "bg-yellow-100 text-yellow-800"
                                : request.method === "DELETE"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-purple-100 text-purple-800",
                        )}
                      >
                        {request.method}
                      </span>
                      <span className="max-w-[100px] truncate">
                        {request.name}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRequest(folder.id, request.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 w-6 h-6"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <CreateFolder
        isActive={showNewFolder}
        onClose={() => setShowNewFolder(false)}
      />
    </div>
  );
};
export default Sidebar;
