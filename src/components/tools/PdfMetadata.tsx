import { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';

export default function PdfMetadata() {
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState({ title: '', author: '', subject: '', keywords: '', creator: '', producer: '' });
  const [status, setStatus] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const loadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    setFile(f);
    const pdf = await PDFDocument.load(await f.arrayBuffer());
    setMeta({
      title: pdf.getTitle() || '', author: pdf.getAuthor() || '',
      subject: pdf.getSubject() || '', keywords: (pdf.getKeywords() || ''),
      creator: pdf.getCreator() || '', producer: pdf.getProducer() || '',
    });
  };

  const save = async () => {
    if (!file) return;
    setStatus('Saving...');
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer());
      if (meta.title) pdf.setTitle(meta.title);
      if (meta.author) pdf.setAuthor(meta.author);
      if (meta.subject) pdf.setSubject(meta.subject);
      if (meta.keywords) pdf.setKeywords([meta.keywords]);
      if (meta.creator) pdf.setCreator(meta.creator);
      if (meta.producer) pdf.setProducer(meta.producer);
      const data = await pdf.save();
      const blob = new Blob([data], { type: 'application/pdf' });
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'metadata-updated.pdf'; a.click();
      setStatus('Done!');
    } catch (e) { setStatus('Error: ' + (e as Error).message); }
  };

  const fields = [['title','Title'],['author','Author'],['subject','Subject'],['keywords','Keywords'],['creator','Creator'],['producer','Producer']];

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".pdf" onChange={loadFile} className="hidden" />
        <div className="text-4xl mb-2">📝</div>
        <p className="text-gray-600 font-medium">{file ? file.name : 'Click to select a PDF'}</p>
      </div>
      {file && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
          {fields.map(([key, label]) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
              <input type="text" value={(meta as any)[key]} onChange={e => setMeta(p => ({...p, [key]: e.target.value}))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" />
            </div>
          ))}
          <button onClick={save} className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">Save Metadata</button>
          {status && <p className="text-sm text-center text-gray-600">{status}</p>}
        </div>
      )}
    </div>
  );
}
