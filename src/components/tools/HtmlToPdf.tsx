import { useState } from 'react';

export default function HtmlToPdf() {
  const [html, setHtml] = useState('<h1>Hello World</h1>\n<p>This is a sample document.</p>');

  const convert = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>PDF</title><style>body{font-family:Arial,sans-serif;margin:40px;line-height:1.6}h1{color:#333}p{color:#555}</style></head><body>${html}</body></html>`);
    printWindow.document.close();
    setTimeout(() => { printWindow.print(); }, 500);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">HTML Content</label>
        <textarea value={html} onChange={e => setHtml(e.target.value)} placeholder="Enter HTML..."
          className="w-full h-48 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 outline-none font-mono text-sm" />
      </div>
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
        <div className="prose prose-sm max-w-none border border-gray-100 rounded-lg p-4 min-h-[100px]" dangerouslySetInnerHTML={{__html: html}} />
      </div>
      <button onClick={convert} className="w-full py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700">
        Print as PDF
      </button>
      <p className="text-xs text-gray-400 text-center">Uses your browser's print dialog. Select "Save as PDF" as the printer.</p>
    </div>
  );
}
