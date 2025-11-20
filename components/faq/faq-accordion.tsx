/* eslint-disable prettier/prettier */
"use client";

import { useState, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  html: string;
}

// Parse HTML to extract FAQ items
// Supports multiple formats:
// 1. <div class="faq-item"><h3>Question</h3><p>Answer</p></div>
// 2. <h2>Question</h2><p>Answer</p> (heading followed by paragraph)
// 3. <h3>Question</h3><p>Answer</p>
function parseFAQFromHTML(html: string): FAQItem[] {
  // Only parse in browser environment
  if (typeof window === "undefined") {
    return [];
  }

  const items: FAQItem[] = [];

  // Create a temporary DOM element to parse HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");

  // Method 1: Look for divs with class "faq-item"
  const faqItems = doc.querySelectorAll(".faq-item");
  if (faqItems.length > 0) {
    faqItems.forEach((item) => {
      const questionEl = item.querySelector("h2, h3, h4");
      if (!questionEl) return;

      const question = questionEl.textContent?.trim() || "";
      if (!question) return;

      // Determine the heading level of the question (2, 3, or 4)
      const questionLevel = parseInt(questionEl.tagName.charAt(1));

      // Get all content after the heading (all siblings after questionEl)
      let answerEl: Element | null = questionEl.nextElementSibling;
      const answerParts: string[] = [];

      // Collect all content until we hit another heading of same or higher level
      // (e.g., if question is h3, stop at h2 or h3, but continue through h4, h5, h6)
      while (answerEl) {
        const tagName = answerEl.tagName;
        if (["H1", "H2", "H3", "H4", "H5", "H6"].includes(tagName)) {
          const headingLevel = parseInt(tagName.charAt(1));
          // Stop if we hit a heading of same or higher level (lower number)
          if (headingLevel <= questionLevel) {
            break;
          }
        }
        answerParts.push(answerEl.outerHTML);
        answerEl = answerEl.nextElementSibling;
      }

      // If no siblings found, try getting all content except the heading
      if (answerParts.length === 0) {
        const tempDiv = item.cloneNode(true) as Element;
        const heading = tempDiv.querySelector("h2, h3, h4");
        if (heading) {
          heading.remove();
          answerParts.push(tempDiv.innerHTML);
        }
      }

      const answer = answerParts.join("").trim();
      if (answer) {
        items.push({ question, answer });
      }
    });
    return items;
  }

  // Method 2: Look for headings (h2, h3) followed by paragraphs
  const headings = doc.querySelectorAll("h2, h3");
  headings.forEach((heading) => {
    const question = heading.textContent?.trim() || "";
    if (!question) return;

    // Find the next sibling that is a paragraph or div
    let answerEl: Element | null = heading.nextElementSibling;
    let answer = "";

    // Collect all paragraphs/divs until the next heading
    const answerParts: string[] = [];
    while (answerEl && !["H2", "H3", "H4"].includes(answerEl.tagName)) {
      if (["P", "DIV"].includes(answerEl.tagName)) {
        answerParts.push(answerEl.innerHTML);
      }
      answerEl = answerEl.nextElementSibling;
    }

    answer = answerParts.join("");

    if (answer) {
      items.push({ question, answer });
    }
  });

  return items;
}

export default function FAQAccordion({ html }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [faqItems, setFaqItems] = useState<FAQItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const items = parseFAQFromHTML(html);
    setFaqItems(items);
  }, [html]);

  // Show loading state during SSR or before parsing
  if (!isClient) {
    return (
      <div
        className="prose mx-auto max-w-6xl text-base leading-7 text-black prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-a:text-black prose-a:underline hover:prose-a:text-neutral-300 prose-strong:text-black prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  if (faqItems.length === 0) {
    // Fallback: render as regular HTML if no FAQ items found
    return (
      <div
        className="prose mx-auto max-w-6xl text-base leading-7 text-black prose-headings:mt-8 prose-headings:font-semibold prose-headings:tracking-wide prose-headings:text-black prose-h1:text-5xl prose-h2:text-4xl prose-h3:text-3xl prose-h4:text-2xl prose-h5:text-xl prose-h6:text-lg prose-a:text-black prose-a:underline hover:prose-a:text-neutral-300 prose-strong:text-black prose-ol:mt-8 prose-ol:list-decimal prose-ol:pl-6 prose-ul:mt-8 prose-ul:list-disc prose-ul:pl-6"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl faq-accordion-wrapper">
      <div className="space-y-4">
        {faqItems.map((item, index) => {
          const isOpen = openIndex === index;

          return (
            <div
              key={index}
              className="border-b border-neutral-200 last:border-b-0"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full flex items-center justify-between py-6 text-left hover:opacity-80 transition-opacity"
                {...(isOpen
                  ? { "aria-expanded": "true" }
                  : { "aria-expanded": "false" })}
                aria-controls={`faq-answer-${index}`}
              >
                <h3 className="text-lg font-semibold text-black pr-8">
                  {item.question}
                </h3>
                <ChevronDownIcon
                  className={`w-5 h-5 text-neutral-600 shrink-0 transition-transform duration-200 ${
                    isOpen ? "transform rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <div
                id={`faq-answer-${index}`}
                className={`overflow-hidden transition-all duration-300 ${
                  isOpen ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div
                  className="faq-answer-content pb-6 prose prose-sm max-w-none text-neutral-700 prose-p:mb-4 prose-p:text-[15px] last:prose-p:mb-0 prose-a:text-black prose-a:underline hover:prose-a:text-neutral-500 prose-strong:text-black prose-ul:mt-4 prose-ul:mb-4 prose-ul:list-disc prose-ul:pl-6 prose-li:text-[15px] prose-ol:mt-4 prose-ol:mb-4 prose-ol:list-decimal prose-ol:pl-6 prose-h4:font-bold prose-h4:text-black prose-h4:text-lg prose-h4:mt-6 prose-h4:mb-3 prose-h5:font-bold prose-h5:text-black prose-h5:text-base prose-h5:mt-4 prose-h5:mb-2"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
