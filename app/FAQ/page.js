'use client';

import { useState } from "react";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import MainLayout from "@/app/MainLayout";

export default function FAQ() {
  const faqs = [
    {
      question: "What services do you offer?",
      answer:
        "We provide software development, cloud services, IT consulting, and more to help your business thrive.",
    },
    {
      question: "How can I contact support?",
      answer:
        "You can reach our support team via email at support@yourcompany.com or call us at +1 (555) 123-4567.",
    },
    {
      question: "What is your refund policy?",
      answer:
        "We offer a 30-day money-back guarantee for most of our services. Contact us for details.",
    },
    {
      question: "How do I get started?",
      answer:
        "Simply contact us through our Contact page, and our team will guide you through the process.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <MainLayout>
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Frequently Asked Questions
        </h1>
        <div className="space-y-4">
          <TransitionGroup>
            {faqs.map((faq, index) => (
              <CSSTransition key={index} timeout={500} classNames="dropdown">
                <div className="bg-gray-100 rounded-lg shadow-md overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full text-left p-4 flex justify-between items-center hover:bg-gray-200 smooth-transition"
                  >
                    <span className="text-lg font-semibold text-gray-800">
                      {faq.question}
                    </span>
                    <span className="text-gray-600">
                      {openIndex === index ? "−" : "+"}
                    </span>
                  </button>
                  {openIndex === index && (
                    <div className="p-4 bg-white">
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  )}
                </div>
              </CSSTransition>
            ))}
          </TransitionGroup>
        </div>
      </main>
    </MainLayout>
  );
}
