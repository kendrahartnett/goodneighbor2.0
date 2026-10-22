"use client";

import Image from "next/image";
import { useState } from "react";

export function ListingPhoto({ id, url, alt, variant = "card" }: { id: string; url: string; alt: string; variant?: "card" | "detail" }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  const privateUpload = url.includes(".private.blob.vercel-storage.com/");
  const src = privateUpload ? `/api/opportunities/${id}/photo` : url;
  if (variant === "detail") {
    return <div className="listing-photo listing-photo-detail">
      <Image src={src} alt={alt} width={900} height={600} sizes="(max-width: 900px) 100vw, 900px" loading="eager" unoptimized={!privateUpload} onError={() => setFailed(true)} />
    </div>;
  }
  return <div className={`listing-photo listing-photo-${variant}`}>
    <Image src={src} alt={alt} fill sizes="(max-width: 660px) 100vw, (max-width: 960px) 50vw, 33vw" unoptimized={!privateUpload} onError={() => setFailed(true)} />
  </div>;
}
