import React from "react";
import ReactMarkdown from "react-markdown";
import matter from "gray-matter";

type MarkdownViewerProps = {
  markdownContent: string;
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({ markdownContent }) => {
  const { content } = matter(markdownContent);

  return (
    <div className="w-full md:w-[85%] lg:w-[75%] mx-auto mt-12 md:mt-20 mb-20 flex justify-center">
      <div className="markdown-content text-xl lowercase">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export default MarkdownViewer;
