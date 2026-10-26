import { useState, type ChangeEvent } from 'react';
import { PdfViewer } from './PdfViewer';
import './drawings.css';

export function DrawingsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selection, setSelection] = useState(0);
  const [error, setError] = useState('');

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected) return;

    if (!selected.name.toLowerCase().endsWith('.pdf')) {
      setError('Choose a PDF file.');
      return;
    }

    setError('');
    setFile(selected);
    setSelection(selection + 1);
  }

  return (
    <section className="drawing">
      <div className="drawing-file-bar">
        <div>
          <label htmlFor="drawing-file">Open a drawing</label>
          <p>pdf file is not saved.</p>
        </div>
        <input
          id="drawing-file"
          type="file"
          accept=".pdf,application/pdf"
          onChange={chooseFile}
        />
      </div>
      {error && (
        <p className="drawing-error" role="alert">
          {error}
        </p>
      )}
      {file ? (
        <PdfViewer key={selection} file={file} />
      ) : (
        <div className="drawing-empty">
          <h2>No drawing selected</h2>
          <p>Choose a PDF to view it here.</p>
        </div>
      )}
    </section>
  );
}
