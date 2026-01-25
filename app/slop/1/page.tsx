// app/slop/[id]/page.tsx
import React from "react";

export default function SlopDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="p-6">
      <h1>Slop Detail Page</h1>
      <p>Slop ID: {params.id}</p>
    </div>
  );
}
