// src/FlowchartNode.jsx
import React, { useRef } from 'react';
import { Handle } from 'reactflow';

const FlowchartNode = ({ id, data = {}, selected }) => {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPdfs = [...(data.pdfs || []), { name: file.name, url: reader.result, date: '' }];
      if (data.onPdfUpload) data.onPdfUpload(newPdfs);
    };
    reader.readAsDataURL(file);
  };

  const removePdf = (index) => {
    const newPdfs = [...(data.pdfs || [])];
    newPdfs.splice(index, 1);
    if (data.onPdfUpload) data.onPdfUpload(newPdfs);
  };

  const updatePdfDate = (index, date) => {
    const newPdfs = [...(data.pdfs || [])];
    newPdfs[index].date = date;
    if (data.onPdfUpload) data.onPdfUpload(newPdfs);
  };

  const setColor = (color) => {
    if (data.onColorChange) data.onColorChange(color);
  };

  const handleChange = (field, value) => {
    if (data.onChange) data.onChange(field, value);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this node?')) {
      if (data.onDelete) data.onDelete();
    }
  };

  return (
    <div
      className={`rounded-lg border-2 shadow-md p-2 text-xs min-w-[180px] max-w-[280px] relative ${
        selected ? 'border-blue-500' : 'border-gray-300'
      }`}
      style={{ backgroundColor: data.color || '#e5e7eb' }}
    >
      <Handle type="target" position="top" />

      {/* Title and Date */}
      <div className="flex justify-between items-center gap-2 mb-2">
        <textarea
          value={data.title || ''}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full bg-transparent resize-none focus:outline-none font-bold"
          rows={1}
          placeholder="Title here"
        />
        <input
          type="date"
          value={data.date || ''}
          onChange={(e) => handleChange('date', e.target.value)}
          className="text-xs border rounded px-1"
        />
      </div>

      {/* Content */}
      <textarea
        value={data.content || ''}
        placeholder="Write here..."
        className="w-full bg-white resize-none text-xs border rounded p-1 focus:outline-none overflow-hidden"
        rows={1}
        onInput={(e) => {
          e.target.style.height = 'auto';
          e.target.style.height = `${e.target.scrollHeight}px`;
        }}
        onChange={(e) => handleChange('content', e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            if (!e.altKey) {
              e.preventDefault();
            } else {
              e.preventDefault();
              const start = e.target.selectionStart;
              const end = e.target.selectionEnd;
              const newValue =
                (data.content || '').substring(0, start) +
                '\n' +
                (data.content || '').substring(end);
              handleChange('content', newValue);
              setTimeout(() => {
                e.target.selectionStart = e.target.selectionEnd = start + 1;
                e.target.style.height = 'auto';
                e.target.style.height = `${e.target.scrollHeight}px`;
              }, 0);
            }
          }
        }}
      />

      {/* PDFs */}
      <div className="mt-2 space-y-1">
        {(data.pdfs || []).map((pdf, index) => (
          <div key={index} className="flex flex-col gap-1 text-xs border-t pt-1 mt-1">
            <div className="flex justify-between items-center">
              <a
                href={pdf.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline truncate"
              >
                {pdf.name}
              </a>
              <button
                onClick={() => removePdf(index)}
                className="text-red-500 ml-2 text-[10px] hover:underline"
              >
                Remove
              </button>
            </div>
            <input
              type="date"
              value={pdf.date || ''}
              onChange={(e) => updatePdfDate(index, e.target.value)}
              className="text-xs border rounded px-1"
            />
          </div>
        ))}
        <button
          onClick={() => fileInputRef.current.click()}
          className="text-xs text-blue-600 underline"
        >
          + Attach PDF
        </button>
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
      </div>

      {/* Color & Delete */}
      <div className="flex justify-between items-center mt-2">
        <div className="flex gap-1 items-center">
          <button
            className="w-4 h-4 rounded-full bg-red-400 border border-gray-500"
            onClick={() => setColor('lightcoral')}
            title="Red"
          ></button>
          <button
            className="w-4 h-4 rounded-full bg-green-400 border border-gray-500"
            onClick={() => setColor('lightgreen')}
            title="Green"
          ></button>
          <button
            className="w-4 h-4 rounded-full bg-yellow-300 border border-gray-500"
            onClick={() => setColor('khaki')}
            title="Yellow"
          ></button>
        </div>
        <button
          onClick={handleDelete}
          className="text-red-500 text-xs hover:underline"
        >
          Delete
        </button>
      </div>

      <Handle type="source" position="bottom" />
    </div>
  );
};

export default FlowchartNode;
