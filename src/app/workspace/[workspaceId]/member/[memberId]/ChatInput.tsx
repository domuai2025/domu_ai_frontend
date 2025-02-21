import dynamic from "next/dynamic";
import Quill from "quill";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { useSupabase } from "@/components/supabase/provider";
import { useWorkspaceId } from "@/hooks/useWorkspaceId";

const Editor = dynamic(() => import("@/components/Editor"), { ssr: false });

interface ChatInputProps {
  placeholder: string;
  conversationId: string;
}

type CreateMessageValues = {
  conversationId: string;
  workspaceId: string;
  body: string;
  image_url?: string;
};

export const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const editorRef = useRef<Quill | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const { supabase } = useSupabase();
  const workspaceId = useWorkspaceId();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef.current?.enable(false);

      const values: CreateMessageValues = {
        body,
        workspaceId,
        conversationId,
      };

      if (image) {
        const fileExt = image.name.split('.').pop();
        const filePath = `${workspaceId}/${conversationId}/${Math.random()}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
          .from('messages')
          .upload(filePath, image);

        if (uploadError) {
          throw uploadError;
        }

        values.image_url = data.path;
      }

      const { error } = await supabase
        .from('messages')
        .insert(values);

      if (error) throw error;

      setEditorKey((prev) => prev + 1);
    } catch (error) {
      toast.error("Failed to send message");
    } finally {
      setIsPending(false);
      editorRef.current?.enable(true);
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
    </div>
  );
};
