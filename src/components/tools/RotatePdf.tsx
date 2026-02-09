import { useState, useRef } from 'react';
import { PDFDocument, degrees } from 'pdf-lib';

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [angle, setAngle] = useState(90);
  const [applyTo, setApplyTo] = useState('all');
  const [status, setStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f);
    const pdf = await PDFDocument.load(await f.arrayBuffer());
    setPageCount(pdf.getPageCount());
  };

  const rotate = async () => {
    if (!file) return;
    setStatus('Rotating...');
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const pages = pdf.getPages();
      pages.forEach((p, i) => {
        if (applyTo === 'all' || (applyTo === 'even' && (i+1) % 2 === 0) || (applyTo === 'odd' && (i+1) % 2 === 1)) {
          p.setRotation(degrees((p.getRotation().angle + angle) % 360));
        }
      });
      const data = await pdf.save();
      const blob = new Blob([data], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rotated.pdf'; a.click();
      setStatus('Done!');
    } catch (e) { setStatus('Error: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".pdf" onChange={loadFile} className="hidden" />
        <div className="text-4xl mb-2">🔄</div>
        <p className="text-gray-600 font-medium">{file ? `${file.name} (${pageCount} pages)` : 'Click to select a PDF'}</p>
      </div>
      {file && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
          <div className="flex gap-2">
            {[90, 180, 270].map(a => (
              <button key={a} onClick={() => setAngle(a)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${angle === a ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{a}°</button>
            ))}
          </div>
          <div className="flex gap-2">
            {[['all','All'],['odd','Odd'],['even','Even']].map(([v,l]) => (
              <button key={v} onClick={() => setApplyTo(v)} className={`flex-1 py-2 rounded-lg text-sm font-medium ${applyTo === v ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{l} pages</button>
            ))}
          </div>
          <button onClick={rotate} className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">Rotate PDF</button>
          {status && <p className="text-sm text-center text-gray-600">{status}</p>}
        </div>
      )}
    </div>
  );
}
