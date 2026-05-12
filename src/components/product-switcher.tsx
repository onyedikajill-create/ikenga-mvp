"use client";

import { PRODUCTS, PRODUCT_IDS, type ProductId } from "@/src/ikenga/products/config";

interface Props {
  active:   ProductId;
  onChange: (id: ProductId) => void;
}

export function ProductSwitcher({ active, onChange }: Props) {
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 4,
        background: "#0a0a0a",
        border: "1px solid #1e1e1e",
        borderRadius: 12,
        padding: 4,
      }}
    >
      {PRODUCT_IDS.map(id => {
        const p       = PRODUCTS[id];
        const isActive = id === active;
        return (
          <button
            key={id}
            onClick={() => onChange(id)}
            title={p.tagline}
            style={{
              background: isActive ? p.bgColor : "transparent",
              border:     isActive ? `1px solid ${p.borderColor}` : "1px solid transparent",
              borderRadius: 8,
              padding: "8px 14px",
              cursor: "pointer",
              transition: "all 0.15s",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 700, color: isActive ? p.color : "#444", letterSpacing: "0.06em", lineHeight: 1 }}>{id}</div>
            <div style={{ fontSize: 9, fontWeight: 500, color: isActive ? p.color + "99" : "#2a2a2a", letterSpacing: "0.05em", marginTop: 3, whiteSpace: "nowrap" }}>{p.tagline.split(".")[0]}</div>
          </button>
        );
      })}
    </div>
  );
}
