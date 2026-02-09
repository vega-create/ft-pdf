import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function ImagesToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(prev => [...prev, ...Array.from(e.target.files!)]);
  };

  const removeFile = (i: number) => setFiles(prev => prev.filter((_, idx) => idx !== i));

  const convert = async () => {
    if (files.length === 0) return;
    setStatus('Converting...');
    try {
      const pdf = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        let img;
        if (file.type === 'image/png') img = await pdf.embedPng(bytes);
        else img = await pdf.embedJpg(bytes);
        const page = pdf.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const data = await pdf.save();
      const blob = new Blob([data], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'images.pdf'; a.click();
      setStatus('Done!');
    } catch (e) { setStatus('Error: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept="image/jpeg,image/png" multiple onChange={addFiles} className="hidden" />
        <div className="text-4xl mb-2">🖼️</div>
        <p className="text-gray-600 font-medium">Click to select images (JPG, PNG)</p>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((f, i) => (
            <div key={i} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
              <span className="text-gray-400">🖼️</span>
              <span className="flex-1 text-sm text-gray-900 truncate">{f.name}</span>
              <span className="text-xs text-gray-400">{(f.size / 1024).toFixed(0)} KB</span>
              <button onClick={() => removeFile(i)} className="text-red-400 hover:text-red-600 text-sm">✕</button>
            </div>
          ))}
          <button onClick={convert} className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">
            Convert {files.length} images to PDF
          </button>
          {status && <p className="text-sm text-center text-gray-600">{status}</p>}
        </div>
      )}
    </div>
  );
}
