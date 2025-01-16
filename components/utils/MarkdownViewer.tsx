import React from "react";
import ReactMarkdown from "react-markdown";
import matter from "gray-matter";

type MarkdownViewerProps = {
  markdownContent: string;
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ markdownContent }) => {
  const { content } = matter(markdownContent);

  return (
    <div className="flex justify-center">
      <div className="markdown-content text-xl lowercase">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownViewer;
