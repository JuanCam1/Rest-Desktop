import { createFileRoute } from "@tanstack/react-router";
import Sidebar from "@/sections/sidebar/sidebar";
import RequestEditor from "@/sections/request/request-editor";
import ResponseModel from "@/sections/response/response-model";
import { useRestStore } from "@/store";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const activeRequest = useRestStore((state) => state.activeRequest);

  return (
    <div className="flex bg-zinc-950 h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1 h-full">
        {activeRequest ? (
          <>
            <RequestEditor />
            <ResponseModel />
          </>
        ) : (
          <div className="flex justify-center items-center h-full text-muted-foreground">
            Selecciona o crea una solicitud para comenzar
          </div>
        )}
      </div>
    </div>
  );
}
