import { useState, useRef } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function PageNumbers() {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState('bottom-center');
  const [startNum, setStartNum] = useState(1);
  const [status, setStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) setFile(e.target.files[0]); };

  const apply = async () => {
    if (!file) return;
    setStatus('Adding page numbers...');
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const font = await pdf.embedFont(StandardFonts.Helvetica);
      const pages = pdf.getPages();
      pages.forEach((page, i) => {
        const { width, height } = page.getSize();
        const text = `${i + startNum}`;
        const tw = font.widthOfTextAtSize(text, 10);
        let x = 0, y = 0;
        if (position.includes('center')) x = (width - tw) / 2;
        else if (position.includes('right')) x = width - tw - 40;
        else x = 40;
        if (position.includes('bottom')) y = 30;
        else y = height - 40;
        page.drawText(text, { x, y, size: 10, font, color: rgb(0.4, 0.4, 0.4) });
      });
      const data = await pdf.save();
      const blob = new Blob([data], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'numbered.pdf'; a.click();
      setStatus('Done!');
    } catch (e) { setStatus('Error: ' + (e as Error).message); }
  };

  const positions = [
    ['bottom-left','Bottom Left'],['bottom-center','Bottom Center'],['bottom-right','Bottom Right'],
    ['top-left','Top Left'],['top-center','Top Center'],['top-right','Top Right'],
  ];

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".pdf" onChange={loadFile} className="hidden" />
        <div className="text-4xl mb-2">🔢</div>
        <p className="text-gray-600 font-medium">{file ? file.name : 'Click to select a PDF'}</p>
      </div>
      {file && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
            <div className="grid grid-cols-3 gap-2">
              {positions.map(([v, l]) => (
                <button key={v} onClick={() => setPosition(v)} className={`py-2 rounded-lg text-xs font-medium ${position === v ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600'}`}>{l}</button>
              ))}
            </div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Start number</label>
            <input type="number" value={startNum} onChange={e => setStartNum(+e.target.value)} min="1" className="w-24 px-3 py-2 border border-gray-200 rounded-lg" /></div>
          <button onClick={apply} className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">Add Page Numbers</button>
          {status && <p className="text-sm text-center text-gray-600">{status}</p>}
        </div>
      )}
    </div>
  );
}
