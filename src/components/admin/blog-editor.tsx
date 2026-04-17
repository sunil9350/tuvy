"use client";

import LinkExtension from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Bold, Heading2, Italic, Link as LinkIcon, List, ListOrdered, Redo2, Undo2 } from "lucide-react";
type BlogEditorProps = {
  initialHtml: string;
  onChangeHtml: (html: string) => void;
};

export function BlogEditor({ initialHtml, onChangeHtml }: BlogEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      LinkExtension.configure({
        openOnClick: false,
        autolink: true,
        protocols: ["http", "https"],
      }),
      Placeholder.configure({ placeholder: "Write your post… Headings, lists, and links work like WordPress." }),
    ],
    content: initialHtml,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "min-h-[280px] px-4 py-3 text-sm leading-relaxed focus:outline-none [&_a]:text-brand [&_a]:underline [&_blockquote]:border-l-4 [&_blockquote]:border-brand/30 [&_blockquote]:pl-4 [&_blockquote]:italic [&_h2]:mt-6 [&_h2]:text-xl [&_h2]:font-extrabold [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-bold [&_li]:my-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_p]:my-3 [&_ul]:list-disc [&_ul]:pl-5",
      },
    },
    onUpdate: ({ editor }) => onChangeHtml(editor.getHTML()),
  });

  if (!editor) {
    return (
      <div className="rounded-2xl border border-border bg-background px-4 py-8 text-sm font-medium text-muted">
        Loading editor…
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card ring-1 ring-black/[0.03]">
      <div className="flex flex-wrap items-center gap-1 border-b border-border bg-background/80 px-2 py-2">
        <ToolbarButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="size-4" />
        </ToolbarButton>
        <ToolbarButton
          label="Ordered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Link" onClick={addLink}>
          <LinkIcon className="size-4" />
        </ToolbarButton>
        <span className="mx-1 hidden h-6 w-px bg-border sm:inline" aria-hidden />
        <ToolbarButton label="Undo" onClick={() => editor.chain().focus().undo().run()}>
          <Undo2 className="size-4" />
        </ToolbarButton>
        <ToolbarButton label="Redo" onClick={() => editor.chain().focus().redo().run()}>
          <Redo2 className="size-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  );

  function addLink() {
    if (!editor) return;
    const previous = editor.getAttributes("link").href;
    const url = window.prompt("Link URL", previous || "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }
}

function ToolbarButton({
  label,
  active,
  onClick,
  children,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={`inline-flex size-9 items-center justify-center rounded-xl border text-foreground transition ${
        active
          ? "border-brand/40 bg-brand/10 text-brand"
          : "border-transparent bg-transparent hover:bg-background"
      }`}
    >
      {children}
    </button>
  );
}
