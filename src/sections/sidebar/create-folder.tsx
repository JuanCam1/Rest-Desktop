import { useActionState, useEffect, type FC } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRestStore } from "@/store";
import { query } from "@/lib/query";
import { KeysQuery } from "@/const/keys-query";

interface Props {
  isActive: boolean;
  onClose: () => void;
}

type ActionState = {
  error: string | null;
  success: boolean;
};

const CreateFolder: FC<Props> = ({ isActive, onClose }) => {
  const addFolder = useRestStore((state) => state.addFolder);

  const createFolderAction = async (
    _prevState: ActionState,
    formData: FormData,
  ): Promise<ActionState> => {
    const folderName = formData.get("folderName") as string;

    if (!folderName || folderName.trim().length < 3) {
      return {
        error: "El nombre debe tener al menos 3 caracteres.",
        success: false,
      };
    }

    const newFolder = await addFolder(folderName);
    return newFolder;
  };

  const initialState: ActionState = { error: null, success: false };
  const [state, formAction, isPending] = useActionState(
    createFolderAction,
    initialState,
  );

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, onClose]);

  return (
    <Dialog open={isActive} onOpenChange={onClose}>
      <DialogContent className="dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Crear Carpeta</DialogTitle>
          <DialogDescription className="mb-4">
            Aquí puedes crear una nueva carpeta para organizar tus solicitudes.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col items-center gap-4" action={formAction}>
          <Input
            placeholder="Nombre de la carpeta"
            className="h-12 placeholder:dark:text-zinc-500"
            required
            name="folderName"
            autoFocus
            disabled={isPending}
          />
          {state.error && <p className="text-sm text-red-500">{state.error}</p>}
          <Button type="submit" size="sm" className="h-8" disabled={isPending}>
            {isPending ? (
              <span className="animate-spin h-4 w-4 border-b-2 border-current rounded-full inline-block"></span>
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span className="ml-2 font-bold">
              {isPending ? "Guardando..." : "Guardar"}
            </span>
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
export default CreateFolder;
