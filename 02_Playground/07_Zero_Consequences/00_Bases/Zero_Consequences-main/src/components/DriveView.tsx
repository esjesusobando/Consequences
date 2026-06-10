import React, { useState } from "react";
import { DriveFile } from "../types";
import { FolderPlus, Upload, Grid, List, Folder, File, FileCode, AlertCircle, Plus, Eye, Share2, X, Sparkles } from "lucide-react";
import { translations } from "../lib/translations";

interface DriveViewProps {
  files: DriveFile[];
  onAddFile: (file: { name: string; mimeType: string; size: string }) => void;
  searchQuery: string;
  language?: 'es' | 'en';
  themeMode?: 'craft' | 'cyber';
}

export default function DriveView({
  files,
  onAddFile,
  searchQuery,
  language = 'es',
  themeMode = 'craft'
}: DriveViewProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isNewNodeOpen, setIsNewNodeOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  
  // Create File State
  const [nodeName, setNodeName] = useState("");
  const [nodeType, setNodeType] = useState("text/plain");
  const [nodeSize, setNodeSize] = useState("14 KB");

  const t = translations[language].drive;
  const isLight = themeMode === 'craft';

  // Filtering files based on Header search query
  const filteredFiles = files.filter(file => {
    if (!searchQuery) return true;
    return file.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSubmitNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeName.trim()) return;
    
    onAddFile({
      name: nodeName,
      mimeType: nodeType,
      size: nodeSize
    });
    
    setNodeName("");
    setIsNewNodeOpen(false);
  };

  const getFileIcon = (mime: string, name: string) => {
    if (mime.includes("folder")) {
      return <Folder className={`w-8 h-8 group-hover:scale-110 transition-transform duration-200 ${isLight ? 'text-amber-500' : 'text-[#FFB400]'}`} />;
    }
    if (mime.includes("shortcut") || name.includes("NODE")) {
      return <FileCode className={`w-8 h-8 group-hover:scale-110 transition-transform duration-200 ${isLight ? 'text-blue-500' : 'text-[#00f0ff]'}`} />;
    }
    return <File className={`w-8 h-8 group-hover:scale-110 transition-transform duration-200 ${isLight ? 'text-zinc-400' : 'text-[#7A839E]'}`} />;
  };

  const getMimeLabel = (mime: string, name: string) => {
    if (mime.includes("folder")) return "DIR";
    if (mime.includes("shortcut") || name.includes("CFG")) return "MANIFEST";
    if (name.includes("BIN")) return "BINARY";
    if (name.includes("JPG") || mime.includes("image")) return "MEDIA";
    return "NODE";
  };

  return (
    <div className="flex-grow flex flex-col gap-6 relative select-none">
      
      {/* Dynamic Toolbar matching mock toolbar design */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b ${
        isLight ? 'border-zinc-200' : 'border-[#1E2435]'
      }`}>
        
        {/* Actions triggering new node forms */}
        <div className="flex gap-2">
          <button 
            onClick={() => setIsNewNodeOpen(true)}
            className={`font-mono text-xs font-semibold px-4 py-2 flex items-center gap-2 rounded-full cursor-pointer transition-all duration-300 active:scale-95 hover:scale-[1.02] ${
              isLight 
                ? 'bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#8FEF10] text-white hover:opacity-95 shadow-[0_4px_12px_rgba(0,82,255,0.15)] border-transparent' 
                : 'bg-[#00f0ff] hover:bg-[#00dbe9] text-black font-bold rounded-xs shadow-[0_0_8px_rgba(0,240,255,0.3)]'
            }`}
          >
            <Plus className="w-4 h-4 cursor-pointer" /> {t.new_node}
          </button>
          
          <button 
            onClick={() => setIsUploadOpen(true)}
            className={`font-mono text-xs px-4 py-2 transition-all duration-150 active:scale-95 flex items-center gap-2 rounded-full cursor-pointer ${
              isLight 
                ? 'bg-zinc-100 font-medium hover:bg-zinc-200 text-zinc-900' 
                : 'bg-[#131826] text-white hover:text-[#00f0ff] hover:border-[#00f0ff] border border-[#1E2435] rounded-xs'
            }`}
          >
            <Upload className="w-3.5 h-3.5" /> {t.upload}
          </button>
        </div>

        {/* Layout control nodes */}
        <div className="flex items-center gap-4 font-mono text-xs font-semibold">
          <span className="text-[#7A839E]">{t.view}:</span>
          <div className={`flex items-center gap-1.5 p-0.5 border rounded-full ${
            isLight ? "bg-zinc-100 border-zinc-200" : "bg-night border-[#1E2435]"
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-all cursor-pointer rounded-full ${
                viewMode === 'grid' 
                  ? isLight ? 'text-white bg-gradient-to-br from-[#0052FF] to-[#3B82F6] font-semibold shadow-sm' : 'text-[#00f0ff] bg-[#1E2435]' 
                  : 'text-[#7A839E] hover:text-white'
              }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-all cursor-pointer rounded-full ${
                viewMode === 'list' 
                  ? isLight ? 'text-white bg-gradient-to-br from-[#0052FF] to-[#3B82F6] font-semibold shadow-sm' : 'text-[#00f0ff] bg-[#1E2435]' 
                  : 'text-[#7A839E] hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Files Display Grid/List */}
      {filteredFiles.length === 0 ? (
        <div className={`text-center py-20 border rounded-[2rem] ${
          isLight ? 'bg-white border-zinc-200' : 'bg-[#0a0e17] border-[#1E2435]'
        }`}>
          <AlertCircle className="w-8 h-8 text-[#7A839E] mx-auto mb-3" />
          <p className="font-mono text-xs text-[#7A839E] uppercase">{t.empty}</p>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* Cyber/Craft Styled Grid Files */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredFiles.map((file) => {
            const isLive = file.name.includes("ACTIVE") || file.name.includes("LIVE");
            const typeLabel = getMimeLabel(file.mimeType, file.name);
            
            return (
              <div 
                key={file.id}
                className={`border p-5 group flex flex-col gap-4 h-40 relative rounded-[2rem] transition-all duration-200 ${
                  isLight 
                    ? "bg-white border-zinc-300 hover:border-zinc-400 hover:shadow-md" 
                    : isLive 
                      ? "bg-[#131826]/70 border-[#00f0ff]/40 shadow-[inset_0_0_12px_rgba(0,240,255,0.06)]"
                      : "bg-[#131826]/70 border-[#1E2435] hover:border-[#00f0ff]"
                }`}
              >
                {/* Live tag accent from layout design */}
                {isLive && (
                  <div className={`absolute top-0 right-0 px-2.5 py-1 ${
                    isLight 
                      ? 'bg-emerald-500 text-white rounded-bl-xl rounded-tr-[1.95rem] font-sans text-[8px] font-bold tracking-wider' 
                      : 'bg-[#00f0ff]/15 text-[#00f0ff] font-mono text-[8px] font-bold border-b border-l border-[#00f0ff]/30 tracking-widest uppercase'
                  }`}>
                    {t.live}
                  </div>
                )}

                <div className="flex justify-between items-start">
                  {getFileIcon(file.mimeType, file.name)}
                  
                  {file.webViewLink && (
                    <a 
                      href={file.webViewLink} 
                      target="_blank" 
                      rel="noreferrer"
                      title={t.link}
                      className="text-[#7A839E] hover:text-[#00f0ff] transition-opacity cursor-pointer opacity-0 group-hover:opacity-100"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="mt-auto">
                  <div className={`font-semibold text-xs truncate leading-normal transition-colors group-hover:text-blue-600 ${
                    isLight ? 'text-zinc-900 border-none font-sans font-bold' : 'text-white'
                  }`} title={file.name}>
                    {file.name}
                  </div>
                  
                  <div className="font-mono text-[10px] text-[#7A839E] mt-1 flex justify-between items-center">
                    <span className={`font-semibold ${
                      typeLabel === 'MANIFEST' ? isLight ? 'text-emerald-600' : 'text-emerald-400' : 
                      typeLabel === 'BINARY' ? 'text-[#FF5E5E]' :
                      typeLabel === 'MEDIA' ? 'text-amber-500' : 'text-[#7A839E]'
                    }`}>
                      {typeLabel}
                    </span>
                    <span>{file.size || "--"}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        
        /* Column List View */
        <div className={`border rounded-[1.75rem] overflow-hidden divide-y ${
          isLight ? 'bg-white border-zinc-200 divide-zinc-200' : 'border-[#1E2435] bg-[#0a0e17] divide-[#1E2435]'
        }`}>
          <div className={`grid grid-cols-12 px-5 py-3 font-mono text-[10px] text-[#7A839E] uppercase tracking-wider font-extrabold ${
            isLight ? 'bg-zinc-50 border-b border-zinc-200' : ''
          }`}>
            <span className="col-span-6">{t.new_node}</span>
            <span className="col-span-2">{t.type}</span>
            <span className="col-span-2">{t.size}</span>
            <span className="col-span-2 text-right">{t.id}</span>
          </div>
          
          {filteredFiles.map((file) => {
            const typeLabel = getMimeLabel(file.mimeType, file.name);
            return (
              <div 
                key={file.id} 
                className={`grid grid-cols-12 px-5 py-4 items-center transition-colors ${
                  isLight ? 'hover:bg-zinc-50/50 text-zinc-950 font-sans' : 'font-mono text-xs text-[#dfe2ef] hover:bg-[#131826]/40'
                }`}
              >
                <div className="col-span-6 flex items-center gap-2.5 min-w-0 pr-4">
                  {getFileIcon(file.mimeType, file.name)}
                  <span className={`truncate font-semibold ${
                    isLight ? 'text-zinc-950' : 'text-white hover:text-[#00f0ff]'
                  }`}>
                    {file.name}
                  </span>
                </div>
                
                <span className={`col-span-2 font-bold text-xs ${
                  typeLabel === 'MANIFEST' ? isLight ? 'text-emerald-600' : 'text-emerald-400' : 
                  typeLabel === 'BINARY' ? 'text-[#FF5E5E]' :
                  typeLabel === 'MEDIA' ? 'text-amber-500' : 'text-[#7A839E]'
                }`}>
                  {typeLabel}
                </span>

                <span className="col-span-2 text-[#7A839E] text-xs">{file.size || "--"}</span>

                <div className="col-span-2 text-right flex items-center justify-end gap-2 text-[#7A839E]">
                  {file.webViewLink && (
                    <a 
                      href={file.webViewLink} 
                      target="_blank" 
                      rel="noreferrer"
                      className="hover:text-blue-600 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* NEW NODE CREATE DIALOGUE */}
      {isNewNodeOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg p-6 relative rounded-[2rem] shadow-xl border ${
            isLight ? 'bg-white border-zinc-200 shadow-2xl' : 'bg-[#0f131c] border-2 border-[#00f0ff] shadow-[0_0_30px_rgba(0,240,255,0.2)]'
          }`}>
            <button 
              onClick={() => setIsNewNodeOpen(false)}
              className="absolute top-4 right-4 text-[#7A839E] hover:text-white"
            >
              <X className="w-5 h-5 cursor-pointer" />
            </button>

            <h3 className={`font-semibold mb-4 flex items-center gap-2 ${
              isLight ? 'text-zinc-950 font-sans text-md' : 'font-display text-lg font-bold text-[#00f0ff] tracking-wider'
            }`}>
              <FolderPlus className="w-5 h-5" /> {t.create_node_title}
            </h3>

            <form onSubmit={handleSubmitNode} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] text-[#7A839E] mb-1 uppercase tracking-wider">{t.create_node_name}</label>
                <input
                  type="text"
                  required
                  value={nodeName}
                  onChange={(e) => setNodeName(e.target.value)}
                  placeholder="e.g. REPORT_FILE.CFG"
                  className={`w-full font-mono text-xs p-3 focus:outline-none rounded-full ${
                    isLight 
                      ? 'bg-zinc-100 border border-zinc-200 text-zinc-950 focus:bg-white focus:border-zinc-400' 
                      : 'bg-[#131826] border border-[#1E2435] text-white focus:border-[#00f0ff]'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-[10px] text-[#7A839E] mb-1 uppercase">{t.create_node_type}</label>
                  <select
                    value={nodeType}
                    onChange={(e) => setNodeType(e.target.value)}
                    className={`w-full font-mono text-xs p-3 focus:outline-none rounded-full ${
                      isLight 
                        ? 'bg-zinc-100 border border-zinc-200 text-zinc-950 focus:bg-white' 
                        : 'bg-[#131826] border border-[#1E2435] text-white focus:border-[#00f0ff]'
                    }`}
                  >
                    <option value="text/plain">MANIFEST (.CFG)</option>
                    <option value="application/octet-stream">BINARY (.BIN)</option>
                    <option value="image/jpeg">MEDIA (.JPG)</option>
                    <option value="application/vnd.google-apps.folder">DIRECTORY (DIR)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] text-[#7A839E] mb-1 uppercase">{t.create_node_size}</label>
                  <input
                    type="text"
                    required
                    value={nodeSize}
                    onChange={(e) => setNodeSize(e.target.value)}
                    placeholder="e.g. 14 KB"
                    className={`w-full font-mono text-xs p-3 focus:outline-none rounded-full ${
                      isLight 
                        ? 'bg-zinc-100 border border-zinc-200 text-zinc-950 focus:bg-white' 
                        : 'bg-[#131826] border border-[#1E2435] text-white focus:border-[#00f0ff]'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                className={`w-full mt-2 font-mono text-xs font-semibold py-3.5 transition-all duration-300 cursor-pointer rounded-full hover:scale-[1.01] active:scale-95 ${
                  isLight 
                    ? 'bg-gradient-to-r from-[#0052FF] via-[#3B82F6] to-[#8FEF10] text-white border-transparent hover:opacity-95 shadow-[0_4px_12px_rgba(0,82,255,0.15)]' 
                    : 'bg-[#00f0ff] hover:bg-[#00dbe9] text-black shadow-[0_0_10px_rgba(0,240,255,0.4)]'
                }`}
              >
                {t.create_node_submit}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* INTEGRATIONS FILE UPLOAD DIALOGUE (SUPPORTING DRAG AND DROP) */}
      {isUploadOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className={`w-full max-w-lg p-6 relative rounded-[2rem] shadow-xl border transition-all ${
            isLight ? 'bg-white border-zinc-200 shadow-2xl' : 'bg-[#0f131c] border-2 border-[#1E2435] hover:border-[#00f0ff]'
          }`}>
            <button 
              onClick={() => setIsUploadOpen(false)}
              className="absolute top-4 right-4 text-[#7A839E] hover:text-white"
            >
              <X className="w-5 h-5 cursor-pointer" />
            </button>

            <h3 className={`font-semibold mb-2 flex items-center gap-2 ${
              isLight ? 'text-zinc-950 font-sans text-md' : 'text-white font-display text-lg font-bold'
            }`}>
              <Upload className={`w-5 h-5 ${isLight ? 'text-zinc-800' : 'text-[#00f0ff]'}`} /> {t.upload_title}
            </h3>
            <p className="font-mono text-[10px] text-[#7A839E] mb-4 uppercase">{t.upload_desc}</p>

            {/* Direct Simulated File input supporting native files drop */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                setIsUploadOpen(false);
                const filesList = e.dataTransfer.files;
                if (filesList.length > 0) {
                  onAddFile({
                    name: filesList[0].name.toUpperCase(),
                    mimeType: filesList[0].type || "text/plain",
                    size: `${Math.round(filesList[0].size / 1024)} KB`
                  });
                }
              }}
              className={`border-2 border-dashed p-8 text-center rounded-[1.5rem] transition-all cursor-pointer ${
                isLight 
                  ? 'border-zinc-300 hover:border-zinc-500 bg-zinc-50/50' 
                  : 'border-[#1E2435] hover:border-[#00f0ff] bg-[#131826]/30'
              }`}
              onClick={() => {
                const name = prompt(language === 'es' ? "Ingrese el nombre del archivo a cargar:" : "Enter specific filename to upload:");
                if (name) {
                  onAddFile({
                    name: name.toUpperCase(),
                    mimeType: "text/plain",
                    size: "44 KB"
                  });
                  setIsUploadOpen(false);
                }
              }}
            >
              <Upload className="w-8 h-8 text-[#7A839E] mx-auto mb-3" />
              <p className={`font-mono text-xs ${isLight ? 'text-zinc-800' : 'text-[#dfe2ef]'}`}>{t.upload_placeholder}</p>
              <p className="font-mono text-[9px] text-[#7A839E] mt-1.5">MAX NODE DUP SIZE: 4.0 TB</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
