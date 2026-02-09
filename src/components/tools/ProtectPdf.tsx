import { useState, useRef } from 'react';

export default function ProtectPdf() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-red-300 transition-colors cursor-pointer" onClick={() => inputRef.current?.click()}>
        <input ref={inputRef} type="file" accept=".pdf" onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0]); }} className="hidden" />
        <div className="text-4xl mb-2">🔐</div>
        <p className="text-gray-600 font-medium">{file ? file.name : 'Click to select a PDF'}</p>
      </div>
      {file && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Set Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password to protect PDF"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg" />
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-700">
            <p className="font-medium mb-1">Note</p>
            <p>PDF encryption with passwords requires server-side processing or specialized libraries. For client-side PDF protection, we recommend using your system PDF viewer (Preview on Mac, Adobe Reader on Windows) to add password protection.</p>
            <p className="mt-2">This tool will be upgraded to support client-side encryption in a future update.</p>
          </div>
        </div>
      )}
    </div>
  );
}
