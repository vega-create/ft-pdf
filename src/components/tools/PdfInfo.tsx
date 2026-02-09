import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function PdfInfo() {
  const [file, setFile] = useState<File | null>(null);
  const [info, setInfo] = useState<any>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f);
    try {
      const pdf = await PDFDocument.load(await f.arrayBuffer());
      const pages = pdf.getPages();
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      setInfo({
        fileName: f.name, fileSize: f.size, pageCount: pages.length,
        width: width.toFixed(1), height: height.toFixed(1),
        widthInch: (width / 72).toFixed(2), heightInch: (height / 72).toFixed(2),
        widthMm: (width / 72 * 25.4).toFixed(1), heightMm: (height / 72 * 25.4).toFixed(1),
        title: pdf.getTitle() || '—', author: pdf.getAuthor() || '—',
        subject: pdf.getSubject() || '—', creator: pdf.getCreator() || '—',
        producer: pdf.getProducer() || '—',
        creationDate: pdf.getCreationDate()?.toLocaleDateString() || '—',
        modDate: pdf.getModificationDate()?.toLocaleDateString() || '—',
      });
    } catch (e) { setInfo({ error: (e as Error).message }); }
  };

  const fmt = (bytes: number) => bytes < 1024 ? bytes + ' B' : bytes < 1048576 ? (bytes/1024).toFixed(1) + ' KB' : (bytes/1048576).toFixed(2) + ' MB';

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".pdf" onChange={loadFile} className="hidden" />
        <div className="text-4xl mb-2">📊</div>
        <p className="text-gray-600 font-medium">{file ? file.name : 'Click to select a PDF'}</p>
      </div>
      {info && !info.error && (
        <div className="space-y-4">
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="bg-red-50 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-red-600">{info.pageCount}</div><div className="text-xs text-red-500 mt-1">Pages</div></div>
            <div className="bg-gray-50 rounded-xl p-4 text-center"><div className="text-3xl font-bold text-gray-900">{fmt(info.fileSize)}</div><div className="text-xs text-gray-500 mt-1">File Size</div></div>
            <div className="bg-blue-50 rounded-xl p-4 text-center"><div className="text-lg font-bold text-blue-600">{info.widthMm} x {info.heightMm}</div><div className="text-xs text-blue-500 mt-1">mm</div></div>
          </div>
          <div className="bg-white border border-gray-100 rounded-xl divide-y divide-gray-50">
            {[['File', info.fileName],['Pages', info.pageCount],['Size (pts)', `${info.width} x ${info.height}`],['Size (in)', `${info.widthInch} x ${info.heightInch}`],
              ['Title', info.title],['Author', info.author],['Subject', info.subject],['Creator', info.creator],['Producer', info.producer],
              ['Created', info.creationDate],['Modified', info.modDate],
            ].map(([k, v]) => (
              <div key={k as string} className="flex px-4 py-2"><span className="w-28 text-sm text-gray-500 flex-shrink-0">{k}</span><span className="text-sm text-gray-900 break-all">{v}</span></div>
            ))}
          </div>
        </div>
      )}
      {info?.error && <p className="text-sm text-red-600 text-center">Error: {info.error}</p>}
    </div>
  );
}
