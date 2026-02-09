import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';

const SIZES: Record<string, [number, number]> = {
  'A4': [595.28, 841.89], 'A3': [841.89, 1190.55], 'A5': [419.53, 595.28],
  'Letter': [612, 792], 'Legal': [612, 1008], 'Tabloid': [792, 1224],
};

export default function PageSize() {
  const [file, setFile] = useState<File | null>(null);
  const [size, setSize] = useState('A4');
  const [status, setStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) setFile(e.target.files[0]); };

  const resize = async () => {
    if (!file) return;
    setStatus('Resizing...');
    try {
      const src = await PDFDocument.load(await file.arrayBuffer());
      const [w, h] = SIZES[size];
      src.getPages().forEach(page => {
        const { width: ow, height: oh } = page.getSize();
        const scale = Math.min(w / ow, h / oh);
        page.setSize(w, h);
        page.scaleContent(scale, scale);
        page.translateContent((w - ow * scale) / 2, (h - oh * scale) / 2);
      });
      const data = await src.save();
      const blob = new Blob([data], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `resized-${size}.pdf`; a.click();
      setStatus('Done!');
    } catch (e) { setStatus('Error: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".pdf" onChange={loadFile} className="hidden" />
        <div className="text-4xl mb-2">📐</div>
        <p className="text-gray-600 font-medium">{file ? file.name : 'Click to select a PDF'}</p>
      </div>
      {file && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
          <label className="block text-sm font-medium text-gray-700">Target Size</label>
          <div className="grid grid-cols-3 gap-2">
            {Object.keys(SIZES).map(s => (
              <button key={s} onClick={() => setSize(s)} className={`py-2 rounded-lg text-sm font-medium ${size === s ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{s}</button>
            ))}
          </div>
          <button onClick={resize} className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">Resize to {size}</button>
          {status && <p className="text-sm text-center text-gray-600">{status}</p>}
        </div>
      )}
    </div>
  );
}
