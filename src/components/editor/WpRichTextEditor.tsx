import { useEffect, useMemo } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import Gapcursor from "@tiptap/extension-gapcursor";
import TurndownService from "turndown";
import { marked } from "marked";
import { Button } from "@/components/ui/button";
import {
  Bold,
  Italic,
  Strikethrough,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Link2,
  Image as ImageIcon,
  Undo2,
  Redo2,
} from "lucide-react";
import { uploadCoverImage } from "@/lib/storageUpload";

type Props = {
  valueMarkdown: string;
  onChangeMarkdown: (next: string) => void;
  placeholder?: string;
  uploadSlug?: string;
};

const turndown = new TurndownService({
  codeBlockStyle: "fenced",
  emDelimiter: "_",
});

turndown.addRule("strikethrough", {
  filter: ["del", "s", "strike"],
  replacement(content) {
    return `~~${content}~~`;
  },
});

export function WpRichTextEditor({ valueMarkdown, onChangeMarkdown, placeholder, uploadSlug }: Props) {
  const initialHtml = useMemo(() => {
    // Marked renders Markdown to HTML; we then edit it visually.
    // This keeps backward compatibility with our Markdown storage format.
    return marked.parse(valueMarkdown || "");
  }, [valueMarkdown]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Image.configure({
        inline: false,
        allowBase64: false,
      }),
      Dropcursor.configure({ color: "hsl(var(--primary))", width: 3 }),
      Gapcursor,
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: { rel: "noreferrer noopener", target: "_blank" },
      }),
      Placeholder.configure({
        placeholder: placeholder ?? "Write your post…",
      }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class:
          "min-h-[420px] focus:outline-none prose prose-slate dark:prose-invert max-w-none " +
          "prose-headings:font-display prose-headings:tracking-tight " +
          "prose-h2:border-l-4 prose-h2:border-primary/60 prose-h2:pl-4 " +
          "prose-h3:pl-4 " +
          "prose-a:underline prose-a:decoration-primary/40 prose-a:underline-offset-4 hover:prose-a:decoration-primary " +
          "prose-blockquote:border-l-4 prose-blockquote:border-primary/60 prose-blockquote:bg-muted/40 prose-blockquote:rounded-r-lg prose-blockquote:px-4 prose-blockquote:py-3 " +
          "prose-code:bg-muted/60 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded " +
          "prose-pre:bg-muted/60 prose-pre:border prose-pre:shadow-sm",
      },
    },
    onUpdate({ editor }) {
      const html = editor.getHTML();
      const md = turndown.turndown(html);
      onChangeMarkdown(md.trim());
    },
  });

  // If markdown changes externally (switching posts), update the editor.
  useEffect(() => {
    if (!editor) return;
    const nextHtml = marked.parse(valueMarkdown || "");
    // Avoid resetting on every keystroke (since we already call onChangeMarkdown).
    // Only reset when the editor content is materially different.
    const current = editor.getHTML();
    if (current !== nextHtml) editor.commands.setContent(nextHtml, false);
  }, [editor, valueMarkdown]);

  if (!editor) return null;

  const insertImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const url = await uploadCoverImage({ file, slug: uploadSlug ?? "wysiwyg" });
        editor.chain().focus().setImage({ src: url, alt: "" }).run();
      } catch {
        // best-effort; keep editor usable even if upload fails
      }
    };
    input.click();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    // eslint-disable-next-line no-alert
    const url = window.prompt("Link URL", previousUrl ?? "");
    if (url === null) return;
    if (url.trim() === "") {
      editor.chain().focus().unsetLink().run();
      return;
    }
    editor.chain().focus().setLink({ href: url.trim() }).run();
  };

  const ToolButton = ({
    active,
    onClick,
    label,
    children,
  }: {
    active?: boolean;
    onClick: () => void;
    label: string;
    children: React.ReactNode;
  }) => (
    <Button
      type="button"
      size="icon"
      variant={active ? "secondary" : "outline"}
      onClick={onClick}
      aria-label={label}
      title={label}
      className="h-9 w-9"
    >
      {children}
    </Button>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <ToolButton
          label="Undo"
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Redo"
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 className="h-4 w-4" />
        </ToolButton>

        <div className="w-px bg-border mx-1" />

        <ToolButton
          label="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Strikethrough"
          active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Inline code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code className="h-4 w-4" />
        </ToolButton>

        <div className="w-px bg-border mx-1" />

        <ToolButton
          label="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          <Heading2 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          <Heading3 className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote className="h-4 w-4" />
        </ToolButton>
        <ToolButton
          label="Link"
          active={editor.isActive("link")}
          onClick={setLink}
        >
          <Link2 className="h-4 w-4" />
        </ToolButton>

        <ToolButton label="Image" onClick={() => void insertImage()}>
          <ImageIcon className="h-4 w-4" />
        </ToolButton>
      </div>

      <div className="cognizo-article p-5 md:p-7">
        <EditorContent editor={editor} />
      </div>

      <div className="text-xs text-muted-foreground">
        Saved as Markdown (WordPress-like visual editing, portable content).
      </div>
    </div>
  );
}

