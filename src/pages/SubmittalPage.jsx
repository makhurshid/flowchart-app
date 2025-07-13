import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';




const LOCAL_STORAGE_KEY = 'submittal-tracker-projects';
const roofColors = ['bg-gray-200', 'bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-red-200'];




const SubmittalPage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [importantDocs, setImportantDocs] = useState([]);
const [entries, setEntries] = useState([]);
const [entrySectionsOpen, setEntrySectionsOpen] = useState({
  'Shops/OA': true,
  'Change Order': true,
  'RFI': true,
  'Other': true,
});
const toggleEntrySection = (type) => {
  setEntrySectionsOpen((prev) => ({
    ...prev,
    [type]: !prev[type],
  }));
};



  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      const projects = JSON.parse(stored);
      const proj = projects.find((p) => String(p.id) === String(projectId));
      if (proj) {
  setProject(proj);
  setImportantDocs(proj.importantDocs || []);
  setEntries(proj.entries || []);
}
    }
  }, [projectId]);




  const updateProject = (updatedFields) => {
    setProject((prev) => {
      const updated = { ...prev, ...updatedFields };
      const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
      const updatedProjects = stored.map((p) =>
        p.id === updated.id ? updated : p
      );
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedProjects));
      return updated;
    });
  };




  const handleDocumentUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newDoc = {
          id: Date.now(),
          title: '',
          content: reader.result,
          name: file.name
        };
        const updatedDocs = [...importantDocs, newDoc];
        setImportantDocs(updatedDocs);
        updateProject({ ...project, importantDocs: updatedDocs });
      };
      reader.readAsDataURL(file);
    }
  };




  const updateDocTitle = (docId, title) => {
    const updatedDocs = importantDocs.map(doc =>
      doc.id === docId ? { ...doc, title } : doc
    );
    setImportantDocs(updatedDocs);
    updateProject({ ...project, importantDocs: updatedDocs });
  };




const deleteDoc = (docId) => {
  const confirmed = window.confirm('Are you sure you want to delete this document?');
  if (!confirmed) return;
  const updatedDocs = importantDocs.filter(doc => doc.id !== docId);
  setImportantDocs(updatedDocs);
  updateProject({ ...project, importantDocs: updatedDocs });
};

const handleAddEntry = (type) => {
  const newEntry = {
    id: Date.now(),
    type,
    text: '',
    file: null,
    fileName: '',
    date: '',
    checked: false,
    shopsSentDate: '',
    shopsReturnedDate: '',
  };
  const updatedEntries = [...entries, newEntry];
  setEntries(updatedEntries);
  updateProject({ ...project, entries: updatedEntries });
};

const handleUpdateEntry = (index, key, value) => {
  const updated = [...entries];
  updated[index][key] = value;
  setEntries(updated);
  updateProject({ ...project, entries: updated });
};

const handleEntryFileUpload = (index, file) => {
  if (!file) return;
  const reader = new FileReader();
  reader.onloadend = () => {
    handleUpdateEntry(index, 'file', reader.result);
    handleUpdateEntry(index, 'fileName', file.name);
  };
  reader.readAsDataURL(file);
};

const handleDeleteEntry = (index) => {
  const confirmed = window.confirm('Are you sure you want to delete this entry?');
  if (!confirmed) return;
  const updated = [...entries];
  updated.splice(index, 1);
  setEntries(updated);
  updateProject({ ...project, entries: updated });
};




  const addRoof = () => {
    const newRoof = {
      id: Date.now(),
      name: '',
      features: [],
      products: []
    };
    updateProject({ ...project, roofs: [...(project.roofs || []), newRoof] });
  };




  const updateRoof = (roofId, field, value) => {
    const updatedRoofs = project.roofs.map((roof) =>
      roof.id === roofId ? { ...roof, [field]: value } : roof
    );
    updateProject({ ...project, roofs: updatedRoofs });
  };




  const deleteRoof = (roofId) => {
    const confirmed = window.confirm('Are you sure you want to delete this roof?');
    if (!confirmed) return;
    const updatedRoofs = project.roofs.filter((roof) => roof.id !== roofId);
    updateProject({ ...project, roofs: updatedRoofs });
  };




  const addFeature = (roofId) => {
    const updatedRoofs = project.roofs.map((roof) => {
      if (roof.id === roofId) {
        return { ...roof, features: [...(roof.features || []), { text: '' }] };
      }
      return roof;
    });
    updateProject({ ...project, roofs: updatedRoofs });
  };




  const updateFeature = (roofId, index, value) => {
    const updatedRoofs = project.roofs.map((roof) => {
      if (roof.id === roofId) {
        const features = [...roof.features];
        features[index].text = value;
        return { ...roof, features };
      }
      return roof;
    });
    updateProject({ ...project, roofs: updatedRoofs });
  };




const deleteFeature = (roofId, index) => {
  const confirmed = window.confirm('Are you sure you want to delete this roof feature?');
  if (!confirmed) return;
  const updatedRoofs = project.roofs.map((roof) => {
    if (roof.id === roofId) {
      const features = [...roof.features];
      features.splice(index, 1);
      return { ...roof, features };
    }
    return roof;
  });
  updateProject({ ...project, roofs: updatedRoofs });
};





  const addProduct = (roofId) => {
    const updatedRoofs = project.roofs.map((roof) => {
      if (roof.id === roofId) {
        return {
          ...roof,
          products: [...(roof.products || []), { name: '', features: [], info: '' }]
        };
      }
      return roof;
    });
    updateProject({ ...project, roofs: updatedRoofs });
  };




  const updateProductName = (roofId, index, value) => {
    const updatedRoofs = project.roofs.map((roof) => {
      if (roof.id === roofId) {
        const products = [...roof.products];
        products[index].name = value;
        return { ...roof, products };
      }
      return roof;
    });
    updateProject({ ...project, roofs: updatedRoofs });
  };




const deleteProductName = (roofId, index) => {
  const confirmed = window.confirm('Are you sure you want to delete this product?');
  if (!confirmed) return;
  const updatedRoofs = project.roofs.map((roof) => {
    if (roof.id === roofId) {
      const products = [...roof.products];
      products.splice(index, 1);
      return { ...roof, products };
    }
    return roof;
  });
  updateProject({ ...project, roofs: updatedRoofs });
};





  const addProductFeature = (roofId, productIndex) => {
    const updatedRoofs = project.roofs.map((roof) => {
      if (roof.id === roofId) {
        const products = [...roof.products];
        const features = [...products[productIndex].features, { text: '', approved: null }];
        products[productIndex].features = features;
        return { ...roof, products };
      }
      return roof;
    });
    updateProject({ ...project, roofs: updatedRoofs });
  };




const updateProductFeature = (roofId, productIndex, featureIndex, value, key = 'text') => {
  const updatedRoofs = project.roofs.map((roof) => {
    if (roof.id === roofId) {
      const products = [...roof.products];
      const feature = products[productIndex].features[featureIndex];

      products[productIndex].features[featureIndex] = {
        ...feature,
        [key]: value,
      };

      return { ...roof, products };
    }
    return roof;
  });
  updateProject({ ...project, roofs: updatedRoofs });
};




  const updateFeatureApproval = (roofId, productIndex, featureIndex, isApproved) => {
    const updatedRoofs = project.roofs.map((roof) => {
      if (roof.id === roofId) {
        const products = [...roof.products];
        products[productIndex].features[featureIndex].approved = isApproved;
        return { ...roof, products };
      }
      return roof;
    });
    updateProject({ ...project, roofs: updatedRoofs });
  };




const deleteProductFeature = (roofId, productIndex, featureIndex) => {
  const confirmed = window.confirm('Are you sure you want to delete this product feature?');
  if (!confirmed) return;
  const updatedRoofs = project.roofs.map((roof) => {
    if (roof.id === roofId) {
      const products = [...roof.products];
      products[productIndex].features.splice(featureIndex, 1);
      return { ...roof, products };
    }
    return roof;
  });
  updateProject({ ...project, roofs: updatedRoofs });
};





  const updateProductInfo = (roofId, productIndex, value) => {
    const updatedRoofs = project.roofs.map((roof) => {
      if (roof.id === roofId) {
        const products = [...roof.products];
        products[productIndex].info = value;
        return { ...roof, products };
      }
      return roof;
    });
    updateProject({ ...project, roofs: updatedRoofs });
  };




  if (!project) return <div>Loading...</div>;




  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Submittal Tracker</h1>
        <button
          onClick={() => navigate('/')}
          className="text-sm bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
        >
          ← Home
        </button>
      </div>




      <div className="bg-white p-6 rounded-xl shadow-md space-y-4 max-w-4xl mx-auto">
        <input
          type="text"
          value={project.name}
          onChange={(e) => updateProject({ ...project, name: e.target.value })}
          placeholder="Project Name"
          className="w-full text-2xl font-semibold border-b border-gray-300 focus:outline-none"
        />
        <input
          type="text"
          value={project.location || ''}
          onChange={(e) => updateProject({ ...project, location: e.target.value })}
          placeholder="Project Address"
          className="w-full text-sm border-b border-gray-300 focus:outline-none pb-1"
        />
        <div>
          <label className="block text-sm text-gray-600 mb-1">Completion Date</label>
          <input
            type="date"
            value={project.completionDate || ''}
            onChange={(e) => updateProject({ ...project, completionDate: e.target.value })}
            className="w-full text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none"
          />
        </div>
{['Shops/OA', 'Change Order', 'RFI', 'Other'].map((type) => (
  <div key={type} className="mt-3 border rounded bg-white shadow-sm">
    <div
      onClick={() => toggleEntrySection(type)}
      className="cursor-pointer bg-gray-100 px-3 py-1 flex justify-between items-center text-sm font-medium text-gray-700"
    >
      <span>{type}</span>
      <span>{entrySectionsOpen[type] ? '▲' : '▼'}</span>
    </div>

    {entrySectionsOpen[type] && (
      <div className="px-3 py-2 space-y-2 text-sm">
        <button
          onClick={() => handleAddEntry(type)}
          className="text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
        >
          + Add {type}
        </button>

        {(entries.filter((e) => e.type === type) || []).map((entry, idx) => (
          <div key={entry.id} className="border p-2 rounded bg-gray-50 space-y-1">
            <textarea
              value={entry.text}
              onChange={(e) => handleUpdateEntry(idx, 'text', e.target.value)}
              placeholder="Notes"
              className="w-full text-xs border rounded px-2 py-1 resize-y"
            />
            <input
              type="file"
              onChange={(e) => handleEntryFileUpload(idx, e.target.files[0])}
              className="text-xs"
            />
            {entry.file && (
              <a
                href={entry.file}
                download={entry.fileName}
                className="text-xs text-blue-600 underline block"
              >
                {entry.fileName}
              </a>
            )}
            <div className="flex flex-wrap items-center gap-2">
              {entry.type === 'Shops/OA' ? (
  <div className="flex flex-col sm:flex-row gap-2">
    <div>
      <label className="text-xs block mb-0.5">Shops/OA Sent</label>
      <input
        type="date"
        value={entry.shopsSentDate || ''}
        onChange={(e) => handleUpdateEntry(idx, 'shopsSentDate', e.target.value)}
        className="text-xs border rounded px-2 py-1"
      />
    </div>
    <div>
      <label className="text-xs block mb-0.5">Shops/OA Returned</label>
      <input
        type="date"
        value={entry.shopsReturnedDate || ''}
        onChange={(e) => handleUpdateEntry(idx, 'shopsReturnedDate', e.target.value)}
        className="text-xs border rounded px-2 py-1"
      />
    </div>
  </div>
) : (
  <input
    type="date"
    value={entry.date}
    onChange={(e) => handleUpdateEntry(idx, 'date', e.target.value)}
    className="text-xs border rounded px-2 py-1"
  />
)}

              <label className="flex items-center gap-1 text-xs">
                <input
                  type="checkbox"
                  checked={entry.checked}
                  onChange={(e) => handleUpdateEntry(idx, 'checked', e.target.checked)}
                />
                Done
              </label>
              <button
                onClick={() => handleDeleteEntry(idx)}
                className="text-xs text-red-500 hover:underline ml-auto"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
))}




        <div>
          <h2 className="text-lg font-semibold mt-4">Important Documents</h2>
          <input type="file" onChange={handleDocumentUpload} className="text-sm my-2" />
          <div className="space-y-2">
            {importantDocs.map((doc) => (
              <div key={doc.id} className="bg-gray-100 p-2 rounded">
                <input
  type="text"
  value={doc.title}
  onChange={(e) => updateDocTitle(doc.id, e.target.value)}
  placeholder="Document Title"
  className="w-full text-sm border-b border-gray-300 focus:outline-none mb-1"
/>
<div className="flex justify-between items-center text-xs">
  <span className="truncate mr-2">{doc.name}</span>
  <div className="flex gap-2">
    <a href={doc.content} download={doc.name} className="text-blue-500 underline">Download</a>
    <button onClick={() => deleteDoc(doc.id)} className="text-red-500 hover:underline">Delete</button>
  </div>
</div>

              </div>
            ))}
          </div>
        </div>




        <div>
          <button
            onClick={addRoof}
            className="bg-blue-500 text-white text-sm px-4 py-2 rounded hover:bg-blue-600"
          >
            + Add Roof
          </button>
        </div>




        {(project.roofs || []).map((roof, index) => (
          <div key={roof.id} className={`mt-4 p-4 border rounded-lg ${roofColors[index % roofColors.length]} relative`}>
            <button
              onClick={() => deleteRoof(roof.id)}
              className="absolute top-2 right-2 text-xs text-red-500 hover:underline"
            >
              Delete Roof
            </button>
            <textarea
              value={roof.name}
              onChange={(e) => updateRoof(roof.id, 'name', e.target.value)}
              placeholder="Roof Name"
              className="w-full text-xl font-bold border-b border-gray-400 focus:outline-none pb-1 mb-2 resize-y"
              rows={1}
            />
            <button
              onClick={() => addFeature(roof.id)}
              className="mb-2 text-sm bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
            >
              + Add Roof Aspect / Warranty / Wind / Etc
            </button>
            {(roof.features || []).map((feature, idx) => (
              <div key={idx} className="mb-2">
                <div className="flex gap-2 items-center mb-1">
                  <input
                    type="text"
                    value={feature.text}
                    onChange={(e) => updateFeature(roof.id, idx, e.target.value)}
                    placeholder="Feature Description"
                    className="w-full text-sm border-b border-gray-300 focus:outline-none pb-1"
                  />
                  <button onClick={() => deleteFeature(roof.id, idx)} className="text-xs text-red-500 hover:underline">Delete</button>
                </div>
              </div>
            ))}
            <button
              onClick={() => addProduct(roof.id)}
              className="mt-2 text-sm bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
            >
              + Add Product
            </button>
            {(roof.products || []).map((product, idx) => (
              <div key={idx} className="mt-2 space-y-1">
                <div className="flex gap-2 items-start">
  <textarea
  value={product.name}
  onChange={(e) => {
    updateProductName(roof.id, idx, e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }}
  placeholder="Product Name"
  rows={1}
  className="w-full font-bold text-sm bg-blue-100 border border-blue-300 rounded px-2 py-1 focus:outline-none resize-none"
  style={{ overflow: 'hidden' }}
/>

  <button onClick={() => deleteProductName(roof.id, idx)} className="text-xs text-red-500 hover:underline mt-1">
    Delete
  </button>
</div>

                <div className="flex flex-wrap gap-2">
                  {(product.features || []).map((feature, fIdx) => (
                    <div key={fIdx} className="flex flex-col gap-1">
       <div className="flex gap-1 items-start">
  <textarea
  value={feature.text}
  onChange={(e) => {
    updateProductFeature(roof.id, idx, fIdx, e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }}
  placeholder="Notes"
  rows={1}
  className={`text-xs border rounded p-1 focus:outline-none resize-none leading-tight w-64 ${
    feature.approved === true ? 'text-blue-600' :
    feature.approved === false ? 'text-red-600' : ''
  }`}
  style={{ overflow: 'hidden', minHeight: '24px' }}
/>





                        <button onClick={() => deleteProductFeature(roof.id, idx, fIdx)} className="text-xs text-red-500 hover:underline">x</button>
                      </div>
<textarea
  value={feature.approvedFrom || ''}
  onChange={(e) => {
    updateProductFeature(roof.id, idx, fIdx, e.target.value, 'approvedFrom');
    e.target.style.height = 'auto';
    e.target.style.height = e.target.scrollHeight + 'px';
  }}
  placeholder="Approved From"
  rows={1}
  className="text-xs border rounded px-2 py-1 focus:outline-none resize-none leading-tight w-64"
  style={{ overflow: 'hidden', minHeight: '24px' }}
/>


                      <div className="text-xs">
                        <span className="mr-2">Approved:</span>
                        <label className="mr-2">
                          <input
                            type="radio"
                            name={`approved-${roof.id}-${idx}-${fIdx}`}
                            checked={feature.approved === true}
                            onChange={() => updateFeatureApproval(roof.id, idx, fIdx, true)}
                          /> Yes
                        </label>
                        <label>
                          <input
                            type="radio"
                            name={`approved-${roof.id}-${idx}-${fIdx}`}
                            checked={feature.approved === false}
                            onChange={() => updateFeatureApproval(roof.id, idx, fIdx, false)}
                          /> No
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => addProductFeature(roof.id, idx)}
                  className="text-xs bg-green-400 text-white px-2 py-1 rounded hover:bg-green-500"
                >
                  + Add Feature
                </button>
                <textarea
                  value={product.info}
                  onChange={(e) => updateProductInfo(roof.id, idx, e.target.value)}
                  placeholder="Additional Info"
                  className="w-full text-sm border border-gray-300 rounded p-1 focus:outline-none resize-y mt-1"
                  rows={2}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};




export default SubmittalPage;









