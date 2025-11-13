/* eslint-disable prettier/prettier */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "../../../lib/shopify/types";

interface CollectionDropdownProps {
  title: string;
  submenu: Menu[];
}

export default function CollectionDropdown({
  title,
  submenu,
}: CollectionDropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span className="cursor-pointer">{title}</span>

      {open && submenu.length > 0 && (
        <ul className="absolute left-0 top-full mt-2 bg-white shadow-lg rounded-lg p-3 min-w-[180px] z-50">
          {submenu.map((item) => (
            <li key={item.title}>
              <Link
                href={`/${item.path}`}
                className="block px-3 py-1 hover:bg-gray-100 rounded"
              >
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
