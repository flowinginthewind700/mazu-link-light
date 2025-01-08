"use client";

import ReactMarkdown from "react-markdown";
import { Navigation } from '@/components/navigation'

export default function QAPage() {
  const questions = [
    {
      title: "Question 1",
      content: "What is React?",
      answer: "React is a JavaScript library for building user interfaces.",
    },
    {
      title: "Question 2",
      content: "What is Next.js?",
      answer: "Next.js is a React framework that enables several extra features, including server-side rendering and generating static websites.",
    },
    // 添加更多问答
  ];

  return (
    <><Navigation
    currentPage=""
    showMobileMenu={true}
  />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <h1 className="text-3xl font-bold mb-4">Q&A</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {questions.map((item, index) => (
          <div key={index} className="block p-4 border rounded-lg">
            <h2 className="text-xl font-bold">{item.title}</h2>
            <ReactMarkdown>{item.content}</ReactMarkdown>
            <ReactMarkdown>{item.answer}</ReactMarkdown>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
