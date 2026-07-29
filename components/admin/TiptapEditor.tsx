'use client';

import React, { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import ImageExtension from '@tiptap/extension-image';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Image as ImageIcon,
  Smile,
  Undo,
  Redo,
} from 'lucide-react';

interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

export default function TiptapEditor({ content, onChange }: TiptapEditorProps) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      ImageExtension.configure({
        inline: true,
        allowBase64: true,
      }),
    ],
    content: content || '<p>Write your essay or excerpt here...</p>',
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return <div className="p-4 bg-storm rounded border border-seafoam/20">Loading Editor...</div>;
  }

  const addImage = () => {
    const url = window.prompt('Enter image URL:');
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addEmoji = (emoji: any) => {
    editor.chain().focus().insertContent(emoji.native).run();
    setShowEmojiPicker(false);
  };

  return (
    <div className="border border-seafoam/20 rounded-lg overflow-hidden bg-abyssal space-y-0">
      {/* Toolbar */}
      <div className="bg-storm p-2 border-b border-seafoam/20 flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-abyssal text-fog ${editor.isActive('bold') ? 'bg-brass/20 text-brass' : ''}`}
          title="Bold"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-abyssal text-fog ${editor.isActive('italic') ? 'bg-brass/20 text-brass' : ''}`}
          title="Italic"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-abyssal text-fog ${editor.isActive('heading', { level: 1 }) ? 'bg-brass/20 text-brass' : ''}`}
          title="Heading 1"
        >
          <Heading1 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-abyssal text-fog ${editor.isActive('heading', { level: 2 }) ? 'bg-brass/20 text-brass' : ''}`}
          title="Heading 2"
        >
          <Heading2 className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-abyssal text-fog ${editor.isActive('bulletList') ? 'bg-brass/20 text-brass' : ''}`}
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-abyssal text-fog ${editor.isActive('blockquote') ? 'bg-brass/20 text-brass' : ''}`}
          title="Blockquote"
        >
          <Quote className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-seafoam/20 mx-1" />

        <button
          type="button"
          onClick={addImage}
          className="p-1.5 rounded hover:bg-abyssal text-fog"
          title="Insert Image"
        >
          <ImageIcon className="w-4 h-4" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1.5 rounded hover:bg-abyssal text-brass"
            title="Emoji Picker"
          >
            <Smile className="w-4 h-4" />
          </button>

          {showEmojiPicker && (
            <div className="absolute top-10 left-0 z-50 shadow-2xl">
              <Picker data={data} onEmojiSelect={addEmoji} theme="dark" />
            </div>
          )}
        </div>

        <div className="w-[1px] h-5 bg-seafoam/20 mx-1" />

        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-abyssal text-fog"
          title="Undo"
        >
          <Undo className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-abyssal text-fog"
          title="Redo"
        >
          <Redo className="w-4 h-4" />
        </button>
      </div>

      {/* Content Area */}
      <div className="p-4 min-h-[300px] prose-editorial focus:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
