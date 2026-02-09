import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function MergePdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const moveFile = (i: number, dir: number) => {
    const arr = [...files];
    const j = i + dir;
    if (j < 0 || j >= arr.length) return;
    [arr[i], arr[j]] = [arr[j], arr[i]];
    setFiles(arr);
  };

  const merge = async () => {
    if (files.length < 2) return;
    setStatus('Merging...');
    try {
      const merged = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const pdf = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(p => merged.addPage(p));
      }
      const data = await merged.save();
      const blob = new Blob([data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = 'merged.pdf'; a.click();
      URL.revokeObjectURL(url);
      setStatus('Done! File downloaded.');
    } catch (e) { setStatus('Error: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".pdf" multiple onChange={addFiles} className="hidden" />
        <div className="text-4xl mb-2">📄</div>
        <p className="text-gray-600 font-medium">Click to select PDF files</p>
        <p className="text-sm text-gray-400 mt-1">or drag and drop</p>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
              <span className="text-red-500">📄</span>
              <span className="flex-1 text-sm text-gray-900 truncate">{f.name}</span>
              <span className="text-xs text-gray-400">{(f.size / 1024).toFixed(0)} KB</span>
              <button onClick={() => moveFile(i, -1)} className="text-gray-400 hover:text-gray-600 text-sm" disabled={i === 0}>↑</button>
              <button onClick={() => moveFile(i, 1)} className="text-gray-400 hover:text-gray-600 text-sm" disabled={i === files.length - 1}>↓</button>
              <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
            </div>
          ))}
          <button onClick={merge} disabled={files.length < 2} className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 disabled:opacity-50 transition-colors">
            Merge {files.length} PDFs
          </button>
          {status && <p className="text-sm text-center text-gray-600">{status}</p>}
        </div>
      )}
    </div>
  );
}
