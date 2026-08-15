import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, FileText, Clock, Loader2, Info, Mic,
  Lightbulb, List, Quote, BookOpen, BookOpenCheck,
  Download, Pencil, Save, X, Highlighter,
} from 'lucide-react';
import api from '../api';

const buildSegments = (text, highlights) => {
  if (!highlights?.length) return [{ text, highlighted: false }];
  const sorted = [...highlights].sort((a, b) => a.startIndex - b.startIndex);
  const segs = [];
  let pos = 0;
  for (const h of sorted) {
    if (h.startIndex > pos) segs.push({ text: text.slice(pos, h.startIndex), highlighted: false });
    const end = Math.min(h.endIndex, text.length);
    if (end > h.startIndex) segs.push({ text: text.slice(h.startIndex, end), highlighted: true, id: h._id, color: h.color || '#fef08a' });
    pos = Math.max(pos, end);
  }
  if (pos < text.length) segs.push({ text: text.slice(pos), highlighted: false });
  return segs;
};

const Notes = () => {
  const { lectureId } = useParams();
  const navigate = useNavigate();
  const [lecture, setLecture] = useState(null);
  const [notes, setNotes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [showHLBar, setShowHLBar] = useState(false);
  const [hlBarPos, setHLBarPos] = useState({ x: 0, y: 0 });
  const [selRange, setSelRange] = useState(null);
  const [clickHL, setClickHL] = useState(null);
  const [clickHLPos, setClickHLPos] = useState({ x: 0, y: 0 });

  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const { data } = await api.get(`/api/notes/${lectureId}`, { headers: { token } });
        if (data.success) {
          setLecture(data.lecture);
          setNotes(data.notes);
        } else {
          setError(data.message || 'Could not load notes');
        }
      } catch {
        setError('Failed to fetch lecture data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [lectureId]);

  const getSelOffset = useCallback(() => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || !sel.rangeCount || !contentRef.current) return null;
    const range = sel.getRangeAt(0);
    if (!contentRef.current.contains(range.commonAncestorContainer)) return null;
    const fullRange = document.createRange();
    fullRange.selectNodeContents(contentRef.current);
    fullRange.setEnd(range.startContainer, range.startOffset);
    const start = fullRange.toString().length;
    const end = start + range.toString().length;
    const text = range.toString();
    if (!text.trim()) return null;
    return { start, end, text };
  }, []);

  useEffect(() => {
    const dismiss = (e) => {
      if (contentRef.current && !contentRef.current.contains(e.target)) {
        setShowHLBar(false);
        setSelRange(null);
        setClickHL(null);
      }
    };
    document.addEventListener('mousedown', dismiss);
    return () => document.removeEventListener('mousedown', dismiss);
  }, []);

  const handleMouseUp = useCallback((e) => {
    if (e.target.closest('[data-highlight-id]')) return;
    setClickHL(null);
    requestAnimationFrame(() => {
      const offset = getSelOffset();
      if (offset) {
        const rect = window.getSelection().getRangeAt(0).getBoundingClientRect();
        setHLBarPos({ x: rect.left + rect.width / 2, y: rect.top - 10 });
        setSelRange(offset);
        setShowHLBar(true);
      } else {
        setShowHLBar(false);
        setSelRange(null);
      }
    });
  }, [getSelOffset]);

  const addHighlight = async () => {
    if (!selRange) return;
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.post(`/api/notes/${notes._id}/highlight`, {
        text: selRange.text, startIndex: selRange.start, endIndex: selRange.end, color: '#fef08a',
      }, { headers: { token } });
      if (data.success) setNotes(prev => ({ ...prev, highlights: data.highlights }));
    } catch (err) { console.error(err); }
    setShowHLBar(false);
    setSelRange(null);
    window.getSelection()?.removeAllRanges();
  };

  const removeHighlight = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.delete(`/api/notes/${notes._id}/highlight/${id}`, { headers: { token } });
      if (data.success) setNotes(prev => ({ ...prev, highlights: data.highlights }));
    } catch (err) { console.error(err); }
    setClickHL(null);
  };

  const startEditing = () => {
    setEditContent(notes.content);
    setIsEditing(true);
  };

  const saveEdit = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const { data } = await api.put(`/api/notes/${notes._id}`, { content: editContent }, { headers: { token } });
      if (data.success) {
        setNotes(data.notes);
        setIsEditing(false);
      }
    } catch (err) { console.error(err); }
    setSaving(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const buildTextContent = () => {
    const lines = [];
    lines.push(lecture?.title || 'Untitled');
    lines.push('='.repeat(40));
    lines.push(`Date: ${lecture?.createdAt ? new Date(lecture.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}`);
    lines.push('');
    if (notes?.chapters?.length) {
      lines.push('CHAPTERS');
      lines.push('-'.repeat(40));
      notes.chapters.forEach((ch, i) => {
        lines.push(`\n${ch.headline || `Chapter ${i + 1}`}`);
        lines.push(`  ${ch.summary}`);
      });
      lines.push('');
    }
    if (notes?.content) {
      lines.push('NOTES');
      lines.push('-'.repeat(40));
      lines.push(`\n${notes.content}`);
      lines.push('');
    }
    return lines.join('\n');
  };

  const exportTxt = () => {
    const text = buildTextContent();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${lecture?.title || 'notes'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = async () => {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();
    const text = buildTextContent();
    const lines = pdf.splitTextToSize(text, 170);
    let y = 20;
    for (const line of lines) {
      if (y > 275) { pdf.addPage(); y = 20; }
      pdf.text(line, 20, y);
      y += 6;
    }
    pdf.save(`${lecture?.title || 'notes'}.pdf`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-5">
            <Loader2 className="text-brand-500 text-xl animate-spin" />
          </div>
          <div className="skeleton h-4 w-40 mx-auto mb-2" />
          <div className="skeleton h-3 w-28 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !lecture) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-5">
            <Info className="text-red-400 text-2xl" />
          </div>
          <h2 className="text-xl font-bold text-surface-900 mb-1.5">Lecture not found</h2>
          <p className="text-sm text-surface-500 mb-6">{error || "The lecture you're looking for doesn't exist."}</p>
          <button onClick={() => navigate('/dashboard')}
            className="bg-brand-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/20 cursor-pointer">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const isProcessing = lecture.status === "processing";
  const isCompleted = lecture.status === "completed";
  const isFailed = lecture.status === "failed";
  const segments = buildSegments(notes?.content || '', notes?.highlights);

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="flex items-center gap-2.5 px-4 md:px-6 py-3 border-b border-surface-100 bg-surface-50/80 backdrop-blur-xl sticky top-0 z-40">
        <BookOpenCheck className="w-6 h-6 md:w-7 md:h-7 text-brand-500" />
        <span className="text-sm md:text-base font-bold text-surface-800 tracking-tight">Lecturely</span>
      </div>

      <div className="max-w-4xl mx-auto px-3 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex items-center justify-between mb-6 md:mb-8 gap-2 flex-wrap">
          <button onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm font-medium text-surface-500 hover:text-surface-700 transition-colors cursor-pointer group">
            <div className="w-7 h-7 rounded-lg bg-surface-100 flex items-center justify-center group-hover:bg-surface-200 transition-colors">
              <ArrowLeft className="text-[10px]" />
            </div>
            Back
          </button>
          <div className="flex items-center gap-2">
            {isCompleted && (
              <>
                <button onClick={exportPdf}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500  hover:bg-surface-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer">
                  <FileText className="text-[10px]" /> PDF
                </button>
                <button onClick={exportTxt}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500  hover:bg-surface-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer">
                  <Download className="text-[10px]" /> TXT
                </button>
              </>
            )}
            
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mb-6 md:mb-10">
          <div className="flex items-start gap-3 mb-3">
            <div className="w-9 h-9 md:w-10 md:h-10 rounded-x  flex items-center justify-center shrink-0 mt-0.5">
              <BookOpen  />
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-surface-900 break-words min-w-0">{lecture.title}</h1>
          </div>
        </motion.div>

        {isProcessing && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 md:p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center mx-auto mb-5">
              <Loader2 className="text-2xl text-amber-400 animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-surface-900 mb-1.5">Processing your lecture</h2>
            <p className="text-sm text-surface-500 mb-1">{lecture.progressMessage || 'This may take a few minutes depending on the audio length.'}</p>
            <p className="text-xs text-surface-400">You can leave and come back later — results are saved automatically.</p>
          </motion.div>
        )}

        {isFailed && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="bg-red-500/10 border border-red-500/20 rounded-2xl p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-5">
              <Info className="text-2xl text-red-400" />
            </div>
            <h2 className="text-lg font-bold text-surface-900 mb-1.5">Processing failed</h2>
            <p className="text-sm text-surface-500 mb-6">Something went wrong. Please try uploading again.</p>
            <button onClick={() => navigate('/upload')}
              className="bg-red-600 text-white text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-500/20 cursor-pointer">
              Try Again
            </button>
          </motion.div>
        )}

        {isCompleted && notes && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">

            {notes.chapters && notes.chapters.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4">
                  <List className="text-brand-500 text-xs" />
                  <h2 className="text-sm font-bold text-surface-900 uppercase tracking-wider">Chapters</h2>
                  <span className="text-xs text-surface-400">({notes.chapters.length})</span>
                </div>
                <div className="space-y-3">
                  {notes.chapters.map((ch, idx) => (
                    <div key={idx}
                      className="bg-surface-100 rounded-2xl border border-surface-200 p-5 hover:border-surface-300 transition-all">
                      <div className="flex items-start gap-3">
                      
                        <div className="min-w-0 flex-1">
                          <h3 className="text-base font-bold text-surface-900 mb-1">{ch.headline || `Chapter ${idx + 1}`}</h3>
                          <p className="text-sm text-surface-600 leading-relaxed">{ch.summary}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {notes.content && (
              <section>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="text-amber-400 text-xs" />
                    <h2 className="text-sm font-bold text-surface-900 uppercase tracking-wider">Notes</h2>
                  </div>
                  {!isEditing && (
                    <button onClick={startEditing}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-surface-500 bg-surface-100 hover:bg-surface-200 px-3 py-1.5 rounded-full transition-colors cursor-pointer">
                      <Pencil className="text-[10px]" /> Edit
                    </button>
                  )}
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <textarea value={editContent} onChange={e => setEditContent(e.target.value)}
                      className="w-full min-h-[300px] bg-surface-100 border border-surface-200 rounded-2xl p-6 text-sm text-surface-700 leading-relaxed font-mono resize-y focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
                      placeholder="Edit your notes here..." />
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={cancelEdit}
                        className="inline-flex items-center gap-1.5 text-xs font-medium text-surface-500 bg-surface-100 hover:bg-surface-200 px-4 py-2 rounded-xl transition-colors cursor-pointer">
                        <X className="text-[10px]" /> Cancel
                      </button>
                      <button onClick={saveEdit} disabled={saving}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer disabled:opacity-50">
                        {saving ? <Loader2 className="text-[10px] animate-spin" /> : <Save className="text-[10px]" />}
                        {saving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-surface-100 rounded-2xl border border-surface-200 p-6 md:p-8 relative">
                    <div ref={contentRef} onMouseUp={handleMouseUp}
                      className="text-sm text-surface-700 leading-relaxed whitespace-pre-wrap break-words select-text">
                      {segments.map((seg, i) =>
                        seg.highlighted ? (
                          <span key={i} data-highlight-id={seg.id}
                            onMouseDown={(e) => { e.stopPropagation(); setClickHL({ id: seg.id }); setClickHLPos({ x: e.clientX, y: e.clientY }); }}
                            className="cursor-pointer rounded-sm transition-colors"
                            style={{ backgroundColor: seg.color }}>
                            {seg.text}
                          </span>
                        ) : (
                          <span key={i}>{seg.text}</span>
                        )
                      )}
                    </div>

                    {showHLBar && selRange && (
                      <div className="fixed z-50 transform -translate-x-1/2"
                        style={{ left: hlBarPos.x, top: hlBarPos.y }}>
                        <div className="bg-surface-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                          <button onClick={addHighlight}
                            className="flex items-center gap-1 hover:text-amber-300 transition-colors cursor-pointer">
                            <Highlighter className="text-[10px]" /> Highlight
                          </button>
                        </div>
                      </div>
                    )}

                    {clickHL && (
                      <div className="fixed z-50"
                        style={{ left: clickHLPos.x, top: clickHLPos.y - 30 }}>
                        <div className="bg-surface-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2">
                          <button onClick={() => removeHighlight(clickHL.id)}
                            className="flex items-center gap-1 hover:text-red-300 transition-colors cursor-pointer whitespace-nowrap">
                            <X className="text-[10px]" /> Remove highlight
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>
            )}

          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notes;
