import { useEffect, useState } from 'react';
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from 'pdfjs-dist';
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PdfPage } from './PdfPage';

GlobalWorkerOptions.workerSrc = workerUrl;

export function PdfViewer({ file }: { file: File }) {
  const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    let cancelled = false;
    const url = URL.createObjectURL(file);
    const task = getDocument({ url });

    task.promise
      .then((document) => {
        if (!cancelled) setPdf(document);
      })
      .catch((problem: Error) => {
        if (cancelled) return;
        setError(
          problem.name === 'PasswordException'
            ? 'Password-protected PDFs are not supported yet. Choose an unlocked PDF.'
            : 'This PDF could not be opened. Try another file.'
        );
      });

    // Release the document when another file is selected or this page is closed.
    return () => {
      cancelled = true;
      void task.destroy();
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <div className="pdf-viewer">
      <div className="pdf-toolbar">
        <span className="pdf-filename" title={file.name}>
          {file.name}
        </span>
        {pdf && (
          <div className="pdf-pagination" aria-label="PDF pages">
            <button
              type="button"
              disabled={pageNumber === 1}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              Previous
            </button>
            <span aria-live="polite">
              Page {pageNumber} of {pdf.numPages}
            </span>
            <button
              type="button"
              disabled={pageNumber === pdf.numPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
      {error ? (
        <p className="drawing-error" role="alert">
          {error}
        </p>
      ) : pdf ? (
        <PdfPage key={pageNumber} pdf={pdf} pageNumber={pageNumber} />
      ) : (
        <p className="drawing-message" role="status">
          Opening PDF...
        </p>
      )}
      <p className="drawing-note">
        Choose the file again after refreshing or leaving this screen.
      </p>
    </div>
  );
}
