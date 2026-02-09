import { useState, useRef } from 'react';
import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';

export default function WatermarkPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.15);
  const [status, setStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = (e: React.ChangeEvent<HTMLInputElement>) => { if (e.target.files?.[0]) setFile(e.target.files[0]); };

  const apply = async () => {
    if (!file || !text) return;
    setStatus('Adding watermark...');
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      const font = await pdf.embedFont(StandardFonts.HelveticaBold);
      pdf.getPages().forEach(page => {
        const { width, height } = page.getSize();
        const tw = font.widthOfTextAtSize(text, fontSize);
        page.drawText(text, {
          x: (width - tw * Math.cos(Math.PI / 4)) / 2,
          y: height / 2 - tw * Math.sin(Math.PI / 4) / 4,
          size: fontSize, font, color: rgb(0.5, 0.5, 0.5), opacity,
          rotate: degrees(45),
        });
      });
      const data = await pdf.save();
      const blob = new Blob([data], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'watermarked.pdf'; a.click();
      setStatus('Done!');
    } catch (e) { setStatus('Error: ' + (e as Error).message); }
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".pdf" onChange={loadFile} className="hidden" />
        <div className="text-4xl mb-2">💧</div>
        <p className="text-gray-600 font-medium">{file ? file.name : 'Click to select a PDF'}</p>
      </div>
      {file && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Watermark Text</label>
            <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full px-4 py-2 border border-gray-200 rounded-lg" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-xs text-gray-500 mb-1">Font Size: {fontSize}</label>
              <input type="range" min="12" max="96" value={fontSize} onChange={e => setFontSize(+e.target.value)} className="w-full accent-red-600" /></div>
            <div><label className="block text-xs text-gray-500 mb-1">Opacity: {(opacity*100).toFixed(0)}%</label>
              <input type="range" min="5" max="50" value={opacity*100} onChange={e => setOpacity(+e.target.value/100)} className="w-full accent-red-600" /></div>
          </div>
          <button onClick={apply} className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">Add Watermark</button>
          {status && <p className="text-sm text-center text-gray-600">{status}</p>}
        </div>
      )}
    </div>
  );
}
