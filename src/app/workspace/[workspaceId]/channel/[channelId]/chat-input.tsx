// import { useCreateMessage } from "@/features/messages/api/use-create-messages";
// import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
// import { useChannelId } from "@/hooks/use-channel-id";
// import { useWorkspaceId } from "@/hooks/use-workspace-id";
// import dynamic from "next/dynamic";
// import Quill from "quill";
// import { useRef, useState } from "react";
// import { toast } from "sonner";
// import { Id } from "../../../../../../convex/_generated/dataModel";

// const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

// interface ChatInputProps {
//   placeholder: string;
// }
// type CreateMessageValues = {
//   channelId: Id<"channels">;
//   workspaceId: Id<"workspaces">;
//   body: string;
//   image: Id<"_storage"> | undefined;
// };

// export const ChatInput = ({ placeholder }: ChatInputProps) => {
//   const [editorKey, setEditorKey] = useState(0);
//   const [isPending, setIsPending] = useState(false);

//   const editorRef = useRef<Quill | null>(null);

//   const { mutate: generateUploadUrl } = useGenerateUploadUrl();
//   const { mutate: createMessage } = useCreateMessage();

//   const workspaceId = useWorkspaceId();
//   const channelId = useChannelId();

//   const handleSubmit = async ({
//     body,
//     image,
//   }: {
//     body: string;
//     image: File | null;
//   }) => {
//     try {
//       setIsPending(true);
//       editorRef?.current?.enable(false);

//       const values: CreateMessageValues = {
//         channelId,
//         workspaceId,
//         body,
//         image: undefined,
//       };

//       if (image) {
//         const url = await generateUploadUrl({}, { throwError: true });

//         if (!url) {
//           throw new Error("Url not found");
//         }
//         const result = await fetch(url, {
//           method: "POST",
//           headers: { "Content-Type": image.type },
//           body: image,
//         });

//         if (!result.ok) {
//           throw new Error("Failed to upload image");
//         }

//         const { storageId } = await result.json();
//         values.image = storageId;
//       }

//       await createMessage(values, { throwError: true });

//       setEditorKey((prevKey) => prevKey + 1);
//     } catch (error) {
//       toast.error("Failed to send message");
//     } finally {
//       setIsPending(false);
//       editorRef?.current?.enable(true);
//     }
//   };

//   return (
//     <div className="px-5 w-full">
//       <Editor
//         key={editorKey}
//         placeholder={placeholder}
//         onSubmit={handleSubmit}
//         disabled={isPending}
//         innerRef={editorRef}
//       />
//     </div>
//   );
// };

import { useCreateMessage } from "@/features/messages/api/use-create-messages";
import { useGenerateUploadUrl } from "@/features/upload/api/use-generate-upload-url";
import { useChannelId } from "@/hooks/use-channel-id";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Id } from "../../../../../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button"; // Add button component
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"; // Add dialog components

const Editor = dynamic(() => import("@/components/editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
}
type CreateMessageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
  tag?: "product"; // Add tag field
};

export const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [showTagModal, setShowTagModal] = useState(false);
  const [pendingData, setPendingData] = useState<{
    body: string;
    image: File | null;
  } | null>(null);

  const editorRef = useRef<Quill | null>(null);

  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createMessage } = useCreateMessage();

  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    setPendingData({ body, image });
    setShowTagModal(true);
  };

  const handleConfirmSubmit = async (isProduct: boolean) => {
    if (!pendingData) return;

    try {
      setIsPending(true);
      setShowTagModal(false);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        channelId,
        workspaceId,
        body: pendingData.body,
        image: undefined,
        tag: isProduct ? "product" : undefined,
      };

      if (pendingData.image) {
        const url = await generateUploadUrl({}, { throwError: true });
        if (!url) throw new Error("Url not found");

        const result = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": pendingData.image.type },
          body: pendingData.image,
        });

        if (!result.ok) throw new Error("Failed to upload image");

        const { storageId } = await result.json();
        values.image = storageId;
      }

      await createMessage(values, { throwError: true });
      setEditorKey((prevKey) => prevKey + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
      setPendingData(null);
    }
  };

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />

      <Dialog open={showTagModal} onOpenChange={setShowTagModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Message Type</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Is this message about a product?
            </p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => handleConfirmSubmit(false)}
              disabled={isPending}
            >
              Regular Message
            </Button>
            <Button
              onClick={() => handleConfirmSubmit(false)}
              disabled={isPending}
            >
              Product Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
