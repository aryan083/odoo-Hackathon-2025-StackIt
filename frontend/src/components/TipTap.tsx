import "../styles/tiptap.scss";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Strike from "@tiptap/extension-strike";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Emoji from "@tiptap/extension-emoji";
import React from "react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Heading1,
  Heading2,
  Smile,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight
} from "lucide-react";

const MenuBar = () => {
  const { editor } = useCurrentEditor();
  if (!editor) return null;
  return (
    <div className="control-group">
      <div className="button-group">
        <button onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={editor.isActive("bold") ? "is-active" : ""} aria-label="Bold" title="Bold (Ctrl+B)"><Bold size={18} /></button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? "is-active" : ""} aria-label="Italic" title="Italic (Ctrl+I)"><Italic size={18} /></button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} disabled={!editor.can().chain().focus().toggleStrike().run()} className={editor.isActive("strike") ? "is-active" : ""} aria-label="Strikethrough" title="Strikethrough"><Strikethrough size={18} /></button>
        <button onClick={() => editor.chain().focus().toggleCode().run()} disabled={!editor.can().chain().focus().toggleCode().run()} className={editor.isActive("code") ? "is-active" : ""} aria-label="Code" title="Inline Code (Ctrl+E)"><Code size={18} /></button>
        <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? "is-active" : ""} aria-label="Blockquote" title="Blockquote"><Quote size={18} /></button>
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? "is-active" : ""} aria-label="Bullet List" title="Bullet List"><List size={18} /></button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? "is-active" : ""} aria-label="Ordered List" title="Ordered List"><ListOrdered size={18} /></button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""} aria-label="Heading 1" title="Heading 1"><Heading1 size={18} /></button>
        <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""} aria-label="Heading 2" title="Heading 2"><Heading2 size={18} /></button>
        <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={editor.isActive({ textAlign: "left" }) ? "is-active" : ""} aria-label="Align Left" title="Align Left"><AlignLeft size={18} /></button>
        <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={editor.isActive({ textAlign: "center" }) ? "is-active" : ""} aria-label="Align Center" title="Align Center"><AlignCenter size={18} /></button>
        <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={editor.isActive({ textAlign: "right" }) ? "is-active" : ""} aria-label="Align Right" title="Align Right"><AlignRight size={18} /></button>
        <button onClick={() => {
          const url = window.prompt("Enter image URL");
          if (url) editor.chain().focus().setImage({ src: url }).run();
        }} aria-label="Insert Image" title="Insert Image"><ImageIcon size={18} /></button>
        <button onClick={() => {
          const url = window.prompt("Enter link URL");
          if (url) editor.chain().focus().toggleLink({ href: url }).run();
        }} className={editor.isActive("link") ? "is-active" : ""} aria-label="Insert Link" title="Insert Link"><LinkIcon size={18} /></button>
        <button onClick={() => editor.chain().focus().insertContent({ type: "emoji", attrs: { name: "smile" } }).run()} aria-label="Insert Emoji" title="Insert Emoji"><Smile size={18} /></button>
        <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().chain().focus().undo().run()} aria-label="Undo" title="Undo (Ctrl+Z)"><Undo size={18} /></button>
        <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().chain().focus().redo().run()} aria-label="Redo" title="Redo (Ctrl+Y)"><Redo size={18} /></button>
      </div>
    </div>
  );
};

const extensions = [
  StarterKit,
  Strike,
  Link,
  Image,
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  Emoji,
];

const content = "";

export default () => {
  return (
    <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
      editorProps={{
        attributes: {
          class: "tiptap border border-border rounded-lg min-h-[180px] bg-white focus:outline-none focus:ring-2 focus:ring-primary px-4 py-3 text-base",
        },
      }}
    />
  );
};
