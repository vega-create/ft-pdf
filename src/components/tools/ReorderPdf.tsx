import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function ReorderPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<number[]>([]);
  const [status, setStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f);
    const pdf = await PDFDocument.load(await f.arrayBuffer());
    setPages(Array.from({length: pdf.getPageCount()}, (_, i) => i + 1));
  };

  const move = (i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= pages.length) return;
    const arr = [...pages];
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setPages(arr);
  };

  const save = async () => {
    if (!file) return;
    setStatus('Reordering...');
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(src, pages.map(p => p - 1));
      copied.forEach(p => newPdf.addPage(p));
      const data = await newPdf.save();
      const blob = new Blob([data], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'reordered.pdf'; a.click();
      setStatus('Done!');
    } catch (e) { setStatus('Error: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".pdf" onChange={loadFile} className="hidden" />
        <div className="text-4xl mb-2">🔀</div>
        <p className="text-gray-600 font-medium">{file ? file.name : 'Click to select a PDF'}</p>
      </div>
      {pages.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Use arrows to reorder pages:</p>
          {pages.map((p, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
              <span className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center text-red-600 font-bold text-sm">{p}</span>
              <span className="flex-1 text-sm text-gray-600">Page {p}</span>
              <button onClick={() => move(i, -1)} className="px-2 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200" disabled={i === 0}>↑</button>
              <button onClick={() => move(i, 1)} className="px-2 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200" disabled={i === pages.length - 1}>↓</button>
            </div>
          ))}
          <button onClick={save} className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">Save Reordered PDF</button>
          {status && <p className="text-sm text-center text-gray-600">{status}</p>}
        </div>
      )}
    </div>
  );
}
