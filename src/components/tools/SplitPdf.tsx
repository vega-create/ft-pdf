import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function SplitPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [range, setRange] = useState('');
  const [status, setStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    const pdf = await PDFDocument.load(await f.arrayBuffer());
    setPageCount(pdf.getPageCount());
    setRange(`1-${pdf.getPageCount()}`);
  };

  const split = async () => {
    if (!file) return;
    setStatus('Splitting...');
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const pages = parseRange(range, pageCount);
      const newPdf = await PDFDocument.create();
      const copied = await newPdf.copyPages(src, pages.map(p => p - 1));
      copied.forEach(p => newPdf.addPage(p));
      const data = await newPdf.save();
      const blob = new Blob([data], { type: 'application/pdf' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob); a.download = `split-${range.replace(/,/g, '_')}.pdf`; a.click();
      setStatus('Done!');
    } catch (e) { setStatus('Error: ' + (e as Error).message); }
  };

  const parseRange = (r: string, max: number): number[] => {
    const pages: number[] = [];
    r.split(',').forEach(part => {
      const m = part.trim().match(/^(\d+)\s*-\s*(\d+)$/);
      if (m) { for (let i = +m[1]; i <= Math.min(+m[2], max); i++) pages.push(i); }
      else { const n = parseInt(part.trim()); if (n >= 1 && n <= max) pages.push(n); }
    });
    return [...new Set(pages)].sort((a, b) => a - b);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".pdf" onChange={loadFile} className="hidden" />
        <div className="text-4xl mb-2">✂️</div>
        <p className="text-gray-600 font-medium">{file ? file.name : 'Click to select a PDF'}</p>
        {pageCount > 0 && <p className="text-sm text-gray-400 mt-1">{pageCount} pages</p>}
      </div>
      {file && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pages to extract</label>
            <input type="text" value={range} onChange={e => setRange(e.target.value)} placeholder="e.g. 1-3, 5, 7-10" className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
            <p className="text-xs text-gray-400 mt-1">Use ranges (1-5) and/or individual pages (1, 3, 7)</p>
          </div>
          <button onClick={split} className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">Extract Pages</button>
          {status && <p className="text-sm text-center text-gray-600">{status}</p>}
        </div>
      )}
    </div>
  );
}
