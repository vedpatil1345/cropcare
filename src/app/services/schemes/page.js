"use client";
import { useEffect, useState } from "react";

export default function SchemesPage() {
  const [schemes, setSchemes] = useState([]);

  useEffect(() => {
    fetch("/api/schemes")
      .then(res => res.json())
      .then(data => setSchemes(data.schemes));
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Latest Schemes</h1>
      {schemes.map((scheme, i) => (
        <div key={i} className="p-3 border rounded mb-2 bg-white shadow">
          <h2 className="font-semibold text-lg">
            {scheme.title} {scheme.is_new && <span className="text-red-500">New</span>}
          </h2>
          <p>{scheme.description}</p>
          <a
            href={scheme.link}
            target="_blank"
            className="text-blue-600 underline"
          >
            Know More
          </a>
        </div>
      ))}
    </div>
  );
}