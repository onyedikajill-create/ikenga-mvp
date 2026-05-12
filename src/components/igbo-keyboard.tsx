"use client";

// Igbo diacritic keyboard — injects characters at cursor in any focused input/textarea.
// Usage: render when lang === "ig". Clicking a key inserts the character at the cursor.

const IGBO_KEYS = [
  { display: "Ị",  char: "Ị" },
  { display: "ị",  char: "ị" },
  { display: "Ọ",  char: "Ọ" },
  { display: "ọ",  char: "ọ" },
  { display: "Ụ",  char: "Ụ" },
  { display: "ụ",  char: "ụ" },
  { display: "Ṅ",  char: "Ṅ" },
  { display: "ṅ",  char: "ṅ" },
  { display: "Ḿ",  char: "Ḿ" },
  { display: "ḿ",  char: "ḿ" },
  { display: "Ń",  char: "Ń" },
  { display: "ń",  char: "ń" },
];

function insertAtCursor(char: string) {
  const el = document.activeElement as HTMLInputElement | HTMLTextAreaElement | null;
  if (!el || (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA")) return;

  const start = el.selectionStart ?? el.value.length;
  const end   = el.selectionEnd   ?? el.value.length;
  const before = el.value.slice(0, start);
  const after  = el.value.slice(end);

  // Use execCommand for undo-stack compatibility where supported, fallback to direct value set
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    el.tagName === "INPUT" ? window.HTMLInputElement.prototype : window.HTMLTextAreaElement.prototype,
    "value"
  )?.set;
  nativeInputValueSetter?.call(el, before + char + after);

  // Fire React's synthetic change event
  el.dispatchEvent(new Event("input", { bubbles: true }));

  // Restore cursor position after the inserted character
  const newPos = start + char.length;
  requestAnimationFrame(() => {
    el.setSelectionRange(newPos, newPos);
    el.focus();
  });
}

export function IgboKeyboard() {
  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid #1e1e1e",
        borderRadius: 10,
        padding: "10px 12px",
        marginBottom: 12,
      }}
    >
      <p style={{ margin: "0 0 8px", fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: "#444" }}>
        Igbo diacritics — click to insert at cursor
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {IGBO_KEYS.map(k => (
          <button
            key={k.char}
            type="button"
            onMouseDown={e => {
              // Prevent blur on the target input before we read selectionStart
              e.preventDefault();
              insertAtCursor(k.char);
            }}
            style={{
              background: "#111",
              border: "1px solid #2a2a2a",
              borderRadius: 6,
              padding: "6px 10px",
              fontSize: 15,
              fontWeight: 700,
              color: "#FFD700",
              cursor: "pointer",
              fontFamily: "system-ui, sans-serif",
              lineHeight: 1,
              minWidth: 36,
              textAlign: "center",
            }}
          >
            {k.display}
          </button>
        ))}
      </div>
    </div>
  );
}
