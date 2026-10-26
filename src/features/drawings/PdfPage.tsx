import { useEffect, useRef, useState } from 'react';
import type { PDFDocumentProxy, RenderTask } from 'pdfjs-dist';

export function PdfPage({
  pdf,
  pageNumber,
}: {
  pdf: PDFDocumentProxy;
  pageNumber: number;
}) {
  const container = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    let renderTask: RenderTask | undefined;
    const canvas = document.createElement('canvas');

    async function renderPage() {
      try {
        const page = await pdf.getPage(pageNumber);
        if (cancelled) return;

        const original = page.getViewport({ scale: 1 });
        // Limit canvas size so large construction sheets do not exhaust memory.
        const scale = Math.min(
          2,
          1800 / Math.max(original.width, original.height)
        );
        const viewport = page.getViewport({ scale });
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', `PDF drawing, page ${pageNumber}`);
        renderTask = page.render({ canvas, viewport });
        await renderTask.promise;

        if (!cancelled) {
          container.current?.replaceChildren(canvas);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setLoading(false);
          setError(
            'This page could not be displayed. Try a different page or PDF.'
          );
        }
      }
    }

    void renderPage();
    return () => {
      cancelled = true;
      renderTask?.cancel();
      canvas.remove();
    };
  }, [pdf, pageNumber]);

  return (
    <div className="pdf-stage" aria-busy={loading}>
      {loading && <p role="status">Rendering page...</p>}
      {error && (
        <p className="drawing-error" role="alert">
          {error}
        </p>
      )}
      <div className="pdf-page" ref={container} />
    </div>
  );
}
