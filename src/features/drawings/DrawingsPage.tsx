import { useEffect, useState, type ChangeEvent } from 'react';
import { PdfViewer } from './PdfViewer';
import './drawings.css';

type Sheet = { id: string; filename: string; created_at: string };
async function checkResponse(response: Response) {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error ?? 'Request failed. Make sure the backend is running.');
  }
  return response;
}

export function DrawingsPage() {
  const [file, setFile] = useState<File | null>(null);
  const [selection, setSelection] = useState(0);
  const [sheets, setSheets] = useState<Sheet[]>([]);
  const [saved, setSaved] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();
    fetch('/api/sheets', { signal: controller.signal }).then(checkResponse)
      .then((r) => r.json()).then(setSheets)
      .catch((e: Error) => { if (!controller.signal.aborted) setError(e.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  function chooseFile(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0];
    event.target.value = '';
    if (!selected) return;
    if (!selected.name.toLowerCase().endsWith('.pdf')) { setError('Choose a PDF file.'); return; }
    setError(''); setMessage(''); setSaved(false);
    setFile(selected); setSelection((n) => n + 1);
  }

  async function saveFile() {
    if (!file) return;
    if (!file.size || file.size > 10 * 1024 * 1024) { setError('Choose a nonempty PDF of 10 MB or smaller.'); return; }
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await checkResponse(await fetch(`/api/sheets?filename=${encodeURIComponent(file.name)}`, {
        method: 'POST', headers: { 'Content-Type': 'application/pdf' }, body: file,
      }));
      const sheet: Sheet = await response.json();
      setSheets((previous) => [sheet, ...previous]);
      setSaved(true); setMessage('Drawing saved. You can reopen it from Saved drawings after refreshing.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save drawing.'); }
    finally { setBusy(false); }
  }

  async function openSheet(sheet: Sheet) {
    setBusy(true); setError(''); setMessage('');
    try {
      const response = await checkResponse(await fetch(`/api/sheets/${sheet.id}/file`));
      setFile(new File([await response.blob()], sheet.filename, { type: 'application/pdf' }));
      setSelection((n) => n + 1); setSaved(true);
      setMessage('Opened saved drawing.');
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not open drawing.'); }
    finally { setBusy(false); }
  }

  return (
    <section className="drawing">
      <div className="drawing-file-bar">
        <div>
          <label htmlFor="drawing-file">Open a drawing</label>
          <p>Choose a PDF to preview, then save it to this project. Maximum 10 MB.</p>
        </div>
        <input id="drawing-file" type="file" accept=".pdf,application/pdf" onChange={chooseFile} disabled={busy || loading} />
        <button type="button" onClick={saveFile} disabled={!file || saved || busy || loading}>
          {saved ? 'Saved' : 'Save drawing'}
        </button>
      </div>
      {busy && <p role="status">Working...</p>}
      {error && <p className="drawing-error" role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <div className="saved-drawings">
        <h2>Saved drawings</h2>
        {loading ? <p role="status">Loading drawings...</p> : sheets.length === 0 ? <p>No saved drawings loaded.</p> : (
          <ul>{sheets.map((sheet) => <li key={sheet.id}>
            <button type="button" disabled={busy} onClick={() => openSheet(sheet)}>{sheet.filename}</button>
          </li>)}</ul>
        )}
      </div>
      {file ? <PdfViewer key={selection} file={file} saved={saved} /> : (
        <div className="drawing-empty"><h2>No drawing selected</h2><p>Choose a PDF or open a saved drawing.</p></div>
      )}
    </section>
  );
}
