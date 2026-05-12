// ============================================================
// IKENGA — PDF export via browser print API
// Works without external libraries.
// ============================================================

export interface ExportSlide {
  headline: string;
  body:     string;
}

function slidesHtml(slides: ExportSlide[], title: string): string {
  const pages = slides.map((s, i) => `
    <div class="page">
      <div class="page-num">${i + 1} / ${slides.length}</div>
      <div class="logo">IKENGA AI</div>
      <h1>${escapeHtml(s.headline)}</h1>
      <p>${escapeHtml(s.body)}</p>
      <div class="rule"></div>
    </div>
  `).join("");

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #1B3A2D; font-family: 'Inter', sans-serif; }
  .page {
    width: 210mm;
    min-height: 148mm;
    background: #1B3A2D;
    color: #FFF4C0;
    padding: 28mm 24mm 20mm;
    page-break-after: always;
    display: flex;
    flex-direction: column;
    gap: 14px;
    position: relative;
    border-bottom: 2px solid #C9A84C33;
  }
  .page-num { font-size: 9px; letter-spacing: 0.18em; color: #C9A84C88; text-transform: uppercase; }
  .logo { font-size: 9px; letter-spacing: 0.22em; color: #C9A84C; text-transform: uppercase; position: absolute; top: 12mm; right: 24mm; }
  h1 { font-family: 'Playfair Display', Georgia, serif; font-size: 22px; color: #C9A84C; line-height: 1.3; }
  p  { font-size: 13px; color: #d4e8dc; line-height: 1.75; }
  .rule { flex: 1; }
  @media print {
    body { background: white; }
    .page { background: white; color: #1B3A2D; border-bottom: 1px solid #1B3A2D22; }
    h1 { color: #1B3A2D; }
    p  { color: #3a5a4a; }
    .logo { color: #C9A84C; }
  }
</style>
</head>
<body>${pages}</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Opens a print dialog in a popup window so the user can save as PDF.
 */
export function exportToPdf(slides: ExportSlide[], title: string): void {
  const html    = slidesHtml(slides, title);
  const popup   = window.open("", "_blank", "width=900,height=700");
  if (!popup) {
    alert("Please allow pop-ups for this site to export PDF.");
    return;
  }
  popup.document.write(html);
  popup.document.close();
  popup.onload = () => {
    popup.focus();
    popup.print();
  };
}
