import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface EditorProps {
  placeholder?: string;
  onSubmit: (values: { body: string; image: File | null }) => void;
  disabled?: boolean;
  innerRef?: React.MutableRefObject<Quill | null>;
}

export const Editor: React.FC<EditorProps> = ({
  placeholder,
  onSubmit,
  disabled,
  innerRef
}) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!editorRef.current) return;

    const quill = new Quill(editorRef.current, {
      theme: 'snow',
      placeholder,
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline'],
          ['image']
        ]
      }
    });

    if (innerRef) {
      innerRef.current = quill;
    }

    return () => {
      if (innerRef) {
        innerRef.current = null;
      }
    };
  }, [placeholder, innerRef]);

  return <div ref={editorRef} />;
};

export type { EditorProps }; 