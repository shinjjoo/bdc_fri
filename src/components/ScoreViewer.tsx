import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ScorePageInfo, ScorePageSong, SCORE_PAGES, getStartingPageForKey, findPageBySongNumber } from '../data/pdfCatalog';
import { loadScorePDF, saveScorePDF } from '../utils/pdfStorage';
import { soundManager } from '../utils/audioVibration';
import {
  ZoomIn,
  ZoomOut,
  Maximize,
  Minimize,
  Upload,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Sparkles,
  FileText,
  RotateCcw,
  Radio,
  CheckCircle2,
  BookOpen,
  Move,
} from 'lucide-react';

// Setup pdfjs worker with local worker file to prevent CDN mismatch or CORS/Worker failure
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
} catch (e) {
  console.warn('PDF Worker setup warning:', e);
}

const getInitialFitScale = () => {
  if (typeof window === 'undefined') return 1.0;
  const availW = window.innerWidth < 768 ? window.innerWidth - 24 : 800;
  const fit = availW / 800;
  return Number(Math.min(Math.max(fit, 0.45), 1.0).toFixed(2));
};

interface ScoreViewerProps {
  currentPageNumber: number;
  pageInfo?: ScorePageInfo;
  currentSongTitle?: string;
  onPageChange: (newPage: number) => void;
  onSelectSong?: (song: ScorePageSong) => void;
  onInteraction?: () => void;
}

export const ScoreViewer: React.FC<ScoreViewerProps> = ({
  currentPageNumber,
  pageInfo,
  currentSongTitle = '',
  onPageChange,
  onSelectSong,
  onInteraction,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement | null>(null);

  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [hasCustomPdf, setHasCustomPdf] = useState(false);
  const [pdfFileName, setPdfFileName] = useState<string>('금요기도회_찬양악보집_101p.pdf');
  const [scale, setScale] = useState<number>(() => getInitialFitScale());
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageCount, setPageCount] = useState<number>(101);
  const [isRendering, setIsRendering] = useState(false);
  const [songNoInput, setSongNoInput] = useState<string>('');
  const [songNoFeedback, setSongNoFeedback] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Mouse & Touch Pan/Drag gesture state
  const isMouseDownRef = useRef<boolean>(false);
  const mouseStartXRef = useRef<number>(0);
  const mouseStartYRef = useRef<number>(0);
  const scrollStartXRef = useRef<number>(0);
  const scrollStartYRef = useRef<number>(0);
  const hasMouseDraggedRef = useRef<boolean>(false);

  // Touch gesture state for mobile & tablet (Pinch-to-zoom & Swipe)
  const touchStartYRef = useRef<number>(0);
  const touchStartXRef = useRef<number>(0);
  const touchScrollStartXRef = useRef<number>(0);
  const touchScrollStartYRef = useRef<number>(0);
  const touchStartDistRef = useRef<number | null>(null);
  const touchStartScaleRef = useRef<number>(1.0);
  const isPinchingRef = useRef<boolean>(false);
  const isWheelingRef = useRef(false);

  const fallbackPageInfo: ScorePageInfo = pageInfo || SCORE_PAGES.find(p => p.pageNumber === currentPageNumber) || {
    pageNumber: currentPageNumber,
    key: currentPageNumber < 48 ? 'G' : currentPageNumber < 74 ? 'C' : currentPageNumber < 98 ? 'E' : 'INDEX',
    title: `${currentPageNumber}쪽`,
    songs: [],
  };

  // Draw crisp vector sheet music for the current page
  const drawVectorScore = useCallback((canvas: HTMLCanvasElement, info: ScorePageInfo, zoomFactor: number, highContrast: boolean) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Base dimensions for A4 sheet music (aspect ratio 1 : 1.414)
    const baseW = 800;
    const baseH = 1130;
    const dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    // Dynamic responsive width based on container
    const targetWidth = baseW * zoomFactor;
    const targetHeight = baseH * zoomFactor;

    canvas.width = targetWidth * dpr;
    canvas.height = targetHeight * dpr;
    canvas.style.width = `${targetWidth}px`;
    canvas.style.height = `${targetHeight}px`;

    ctx.save();
    ctx.scale(dpr * zoomFactor, dpr * zoomFactor);

    // 1. Paper Background
    if (highContrast) {
      ctx.fillStyle = '#0f172a'; // Stage Dark
      ctx.fillRect(0, 0, baseW, baseH);
      ctx.strokeStyle = '#334155';
    } else {
      ctx.fillStyle = '#fefdfa'; // Warm Music Paper
      ctx.fillRect(0, 0, baseW, baseH);
      ctx.strokeStyle = '#d6d1c7';
    }
    ctx.lineWidth = 2;
    ctx.strokeRect(16, 16, baseW - 32, baseH - 32);

    // 2. Header Bar
    const isIndex = info.pageNumber >= 98 || info.key === 'INDEX';
    ctx.fillStyle = highContrast ? '#1e293b' : '#262930';
    ctx.beginPath();
    ctx.roundRect(28, 28, 120, 36, 8);
    ctx.fill();

    ctx.fillStyle = '#fbbf24'; // Amber Key
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Malgun Gothic", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(isIndex ? '목차 INDEX' : `[ ${info.key} 코드 ]`, 88, 46);

    // Header Title
    ctx.fillStyle = highContrast ? '#f8fafc' : '#1e293b';
    ctx.font = 'bold 22px -apple-system, BlinkMacSystemFont, "Malgun Gothic", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`금요기도회 찬양 악보집  —  ${info.title || `${info.pageNumber}쪽`}`, 165, 46);

    // Page Number Tag
    ctx.fillStyle = highContrast ? '#94a3b8' : '#64748b';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`${info.pageNumber} / 101 쪽`, baseW - 36, 46);

    // Header Divider Line
    ctx.strokeStyle = highContrast ? '#475569' : '#334155';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(28, 76);
    ctx.lineTo(baseW - 28, 76);
    ctx.stroke();

    // 3. Page Content
    if (isIndex) {
      // Index Directory Pages (98p ~ 101p)
      ctx.fillStyle = highContrast ? '#f1f5f9' : '#0f172a';
      ctx.font = 'bold 26px -apple-system, BlinkMacSystemFont, "Malgun Gothic", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('📖 금요찬양 악보집 전체 색인 및 목차', baseW / 2, 125);

      ctx.fillStyle = highContrast ? '#cbd5e1' : '#475569';
      ctx.font = '15px -apple-system, BlinkMacSystemFont, sans-serif';
      ctx.fillText('G코드 (1p~47p)  |  C코드 (48p~73p)  |  E코드 (74p~97p)  |  색인 (98p~101p)', baseW / 2, 160);

      const sections = [
        {
          title: 'G코드 찬양 모음 (1쪽 ~ 47쪽)',
          badge: 'G KEY • 47 Pages',
          desc: '빠른 찬송가 (#0~#11)  /  느린 복음성가 (#12~#35)  /  결단 및 선교찬양 (#36~#46)',
          bg: highContrast ? '#1e293b' : '#f1f5f9',
          border: highContrast ? '#3b82f6' : '#cbd5e1',
          accent: '#3b82f6',
        },
        {
          title: 'C코드 찬양 모음 (48쪽 ~ 73쪽)',
          badge: 'C KEY • 26 Pages',
          desc: 'C코드 찬송가 편곡 (#1~#16, 48p~63p)  /  C코드 경배와 찬양 (#17~#26, 64p~73p)',
          bg: highContrast ? '#1e293b' : '#f1f5f9',
          border: highContrast ? '#10b981' : '#cbd5e1',
          accent: '#10b981',
        },
        {
          title: 'E코드 찬양 모음 (74쪽 ~ 97쪽)',
          badge: 'E KEY • 24 Pages',
          desc: 'E코드 찬송가 (#1~#16, 74p~89p)  /  E코드 열정 찬양 (#17~#24, 90p~97p)',
          bg: highContrast ? '#1e293b' : '#f1f5f9',
          border: highContrast ? '#f59e0b' : '#cbd5e1',
          accent: '#f59e0b',
        },
      ];

      let boxY = 200;
      sections.forEach((sec, idx) => {
        ctx.fillStyle = sec.bg;
        ctx.beginPath();
        ctx.roundRect(40, boxY, baseW - 80, 110, 12);
        ctx.fill();
        ctx.strokeStyle = sec.border;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Accent strip
        ctx.fillStyle = sec.accent;
        ctx.beginPath();
        ctx.roundRect(40, boxY, 8, 110, [12, 0, 0, 12]);
        ctx.fill();

        ctx.fillStyle = highContrast ? '#ffffff' : '#0f172a';
        ctx.font = 'bold 20px -apple-system, BlinkMacSystemFont, "Malgun Gothic", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(`[${idx + 1}] ${sec.title}`, 65, boxY + 38);

        ctx.fillStyle = sec.accent;
        ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(sec.badge, baseW - 65, boxY + 38);

        ctx.fillStyle = highContrast ? '#94a3b8' : '#64748b';
        ctx.font = '14px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(sec.desc, 65, boxY + 75);

        boxY += 135;
      });
    } else {
      // Normal Song Page (1 to 4 songs)
      const songs = info.songs || [];
      const count = Math.max(songs.length, 1);
      const slotHeight = Math.floor((baseH - 140) / count);

      songs.forEach((song, sIdx) => {
        const topY = 90 + sIdx * slotHeight;
        const isCurrentPlaying = currentSongTitle.trim() && currentSongTitle.trim() === song.title.trim();

        // Song Box Frame
        ctx.fillStyle = isCurrentPlaying
          ? highContrast
            ? 'rgba(6, 78, 59, 0.4)'
            : 'rgba(236, 253, 245, 0.9)'
          : highContrast
          ? '#1e293b'
          : '#ffffff';
        ctx.beginPath();
        ctx.roundRect(28, topY, baseW - 56, slotHeight - 16, 12);
        ctx.fill();
        ctx.strokeStyle = isCurrentPlaying ? '#10b981' : highContrast ? '#334155' : '#e2e8f0';
        ctx.lineWidth = isCurrentPlaying ? 3 : 1.5;
        ctx.stroke();

        // Song Title Bar
        ctx.fillStyle = isCurrentPlaying ? '#059669' : highContrast ? '#334155' : '#f1f5f9';
        ctx.beginPath();
        ctx.roundRect(36, topY + 8, baseW - 72, 38, 8);
        ctx.fill();

        // Key & Song Number Badge
        ctx.fillStyle = '#ea580c';
        ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(`[ ${song.key} #${song.bookNo} ]`, 48, topY + 27);

        // Song Title
        ctx.fillStyle = highContrast ? '#f8fafc' : '#0f172a';
        ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Malgun Gothic", sans-serif';
        const titleText = `${song.title} ${song.hymnNo ? `(${song.hymnNo})` : ''}`;
        ctx.fillText(titleText, 140, topY + 27);

        // Category Tag
        ctx.fillStyle = highContrast ? '#94a3b8' : '#64748b';
        ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(`${song.type || '찬양'}`, baseW - 48, topY + 27);

        // 5-line staff lines
        const staffStartY = topY + 62;
        const staffW = baseW - 84;
        const lineGap = 9;

        ctx.strokeStyle = highContrast ? '#64748b' : '#475569';
        ctx.lineWidth = 1.2;

        for (let l = 0; l < 5; l++) {
          const ly = staffStartY + l * lineGap;
          ctx.beginPath();
          ctx.moveTo(42, ly);
          ctx.lineTo(42 + staffW, ly);
          ctx.stroke();
        }

        // Measure Bars
        ctx.beginPath();
        ctx.moveTo(42, staffStartY);
        ctx.lineTo(42, staffStartY + 4 * lineGap);
        ctx.moveTo(42 + staffW * 0.33, staffStartY);
        ctx.lineTo(42 + staffW * 0.33, staffStartY + 4 * lineGap);
        ctx.moveTo(42 + staffW * 0.66, staffStartY);
        ctx.lineTo(42 + staffW * 0.66, staffStartY + 4 * lineGap);
        ctx.moveTo(42 + staffW, staffStartY);
        ctx.lineTo(42 + staffW, staffStartY + 4 * lineGap);
        ctx.stroke();

        // Treble Clef 𝄞 mark & time sig
        ctx.fillStyle = highContrast ? '#f1f5f9' : '#0f172a';
        ctx.font = 'bold 30px serif';
        ctx.textAlign = 'left';
        ctx.fillText('𝄞', 48, staffStartY + 28);

        ctx.font = 'bold 14px sans-serif';
        ctx.fillText('4', 72, staffStartY + 14);
        ctx.fillText('4', 72, staffStartY + 28);

        // Simulated high-contrast notes
        const notes = [
          { x: 105, y: staffStartY + 3 * lineGap },
          { x: 140, y: staffStartY + 2 * lineGap },
          { x: 180, y: staffStartY + 1 * lineGap },
          { x: 220, y: staffStartY + 2.5 * lineGap },
          { x: 275, y: staffStartY + 1.5 * lineGap },
          { x: 340, y: staffStartY + 2 * lineGap },
          { x: 410, y: staffStartY + 3 * lineGap },
          { x: 480, y: staffStartY + 1.5 * lineGap },
          { x: 550, y: staffStartY + 2 * lineGap },
          { x: 620, y: staffStartY + 2.5 * lineGap },
          { x: 690, y: staffStartY + 1 * lineGap },
        ];

        ctx.fillStyle = highContrast ? '#f8fafc' : '#1e293b';
        notes.forEach((nt) => {
          ctx.beginPath();
          ctx.ellipse(nt.x, nt.y, 5.5, 4.2, -0.2, 0, Math.PI * 2);
          ctx.fill();
          // Stem
          ctx.lineWidth = 1.5;
          ctx.strokeStyle = highContrast ? '#f8fafc' : '#1e293b';
          ctx.beginPath();
          ctx.moveTo(nt.x + 5, nt.y);
          ctx.lineTo(nt.x + 5, nt.y - 20);
          ctx.stroke();
        });

        // Chords row (Orange / Amber prominent)
        const chordY = staffStartY + 4 * lineGap + 24;
        ctx.fillStyle = '#ea580c';
        ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Courier New", monospace';
        ctx.textAlign = 'left';
        ctx.fillText(
          `🎸 코드 진행:  ${song.key}  —  ${song.key}7  —  C  —  D7  —  ${song.key}  —  Em  —  Am7 D7  —  ${song.key}`,
          44,
          chordY
        );

        // Lyrics row
        const lyricsY = chordY + 22;
        ctx.fillStyle = highContrast ? '#cbd5e1' : '#334155';
        ctx.font = 'italic 15px -apple-system, BlinkMacSystemFont, "Malgun Gothic", sans-serif';
        ctx.fillText(`가사: "${song.title} (${song.hymnNo || song.type || '찬양'})"`, 44, lyricsY);
      });
    }

    // 4. Footer Bar
    ctx.strokeStyle = highContrast ? '#475569' : '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(28, baseH - 44);
    ctx.lineTo(baseW - 28, baseH - 44);
    ctx.stroke();

    ctx.fillStyle = highContrast ? '#94a3b8' : '#64748b';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillText('금요기도회 찬양 악보집 (1쪽~101쪽 원본 PDF)', 36, baseH - 26);

    ctx.textAlign = 'center';
    ctx.fillText(`—  ${info.pageNumber}  —`, baseW / 2, baseH - 26);

    ctx.textAlign = 'right';
    ctx.fillText(`KEY: ${info.key}`, baseW - 36, baseH - 26);

    ctx.restore();
  }, [currentSongTitle]);

  // Load PDF or Render Vector Score
  const renderCurrentPage = useCallback(async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. If User has uploaded a custom personal PDF override
    if (pdfDoc && hasCustomPdf && currentPageNumber >= 1 && currentPageNumber <= pdfDoc.numPages) {
      try {
        setIsRendering(true);
        const page = await pdfDoc.getPage(currentPageNumber);
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const baseMultiplier = 800 / unscaledViewport.width;
        const targetScale = scale * baseMultiplier * dpr;
        const viewport = page.getViewport({ scale: targetScale });

        canvas.width = viewport.width;
        canvas.height = viewport.height;
        canvas.style.width = `${viewport.width / dpr}px`;
        canvas.style.height = `${viewport.height / dpr}px`;

        const renderContext = {
          canvasContext: ctx,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
        setIsRendering(false);
        return;
      } catch (err) {
        console.warn('Custom PDF render fallback:', err);
      }
    }

    // 2. Real Google Drive Friday PDF Sheet Music (101 Scanned Real Pages)
    try {
      setIsRendering(true);
      const img = new Image();
      img.crossOrigin = 'anonymous';
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = (e) => reject(e);
        img.src = `/api/score-page/${currentPageNumber}`;
      });

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const baseWidth = 800;
      const aspect = (img.naturalHeight || 1223) / (img.naturalWidth || 946);
      const targetWidth = baseWidth * scale;
      const targetHeight = targetWidth * aspect;

      canvas.width = targetWidth * dpr;
      canvas.height = targetHeight * dpr;
      canvas.style.width = `${targetWidth}px`;
      canvas.style.height = `${targetHeight}px`;

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      ctx.restore();

      setIsRendering(false);
      return;
    } catch (err) {
      console.warn('Scanned PDF image fetch failed, fallback to vector score:', err);
    }

    // 3. Fallback: Vector Music Canvas
    setIsRendering(true);
    drawVectorScore(canvas, fallbackPageInfo, scale, isHighContrast);
    setIsRendering(false);
  }, [pdfDoc, hasCustomPdf, currentPageNumber, fallbackPageInfo, scale, isHighContrast, drawVectorScore]);

  useEffect(() => {
    renderCurrentPage();
  }, [renderCurrentPage]);

  // Preload adjacent score pages for instantaneous page turns
  useEffect(() => {
    if (currentPageNumber < pageCount) {
      const nextImg = new Image();
      nextImg.src = `/api/score-page/${currentPageNumber + 1}`;
    }
    if (currentPageNumber > 1) {
      const prevImg = new Image();
      prevImg.src = `/api/score-page/${currentPageNumber - 1}`;
    }
  }, [currentPageNumber, pageCount]);

  // Handle initial load from IndexedDB storage or Google Drive Friday PDF
  useEffect(() => {
    let mounted = true;
    const initPdf = async () => {
      try {
        // 1. Check if user has uploaded a custom personal override PDF in IndexedDB
        const stored = await loadScorePDF();
        if (stored && stored.buffer && mounted) {
          if (stored.buffer.byteLength > 1000000) {
            setPdfFileName(stored.name || '금요기도회_찬양악보집_101p.pdf');
            try {
              const loadingTask = pdfjsLib.getDocument({ data: stored.buffer });
              const doc = await loadingTask.promise;
              if (mounted) {
                setPdfDoc(doc);
                setPageCount(doc.numPages || 101);
                setHasCustomPdf(true);
                return;
              }
            } catch (e) {
              console.warn('Custom PDF parse fallback:', e);
            }
          }
        }

        // 2. Default: Google Drive Friday Praise Score PDF is pre-rendered and ready on server
        if (mounted) {
          setPdfFileName('금요기도회 찬양악보집 (구글 드라이브 연동)');
          setPageCount(101);
          setHasCustomPdf(true);
        }
      } catch (err) {
        console.error('Storage check:', err);
      }
    };
    initPdf();
    return () => {
      mounted = false;
    };
  }, []);

  // Handle User File Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      alert('PDF 파일(.pdf)을 선택해주세요.');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      await saveScorePDF(arrayBuffer, file.name);
      setPdfFileName(file.name);
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const doc = await loadingTask.promise;
      setPdfDoc(doc);
      setPageCount(doc.numPages || 101);
      setHasCustomPdf(true);
      soundManager.playNormalCue();
    } catch (err) {
      console.error('Failed to upload custom PDF:', err);
      alert('PDF 파일을 파싱할 수 없어 내장 고화질 악보 엔진으로 계속 표시합니다.');
    }
  };

  // Wheel scroll for desktop: Top -> Prev page, Bottom -> Next page
  const handleScrollAreaWheel = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      onInteraction?.();
      if (isWheelingRef.current) return;
      const el = scrollAreaRef.current;
      if (!el) return;

      const { scrollTop, scrollHeight, clientHeight } = el;
      const isAtTop = scrollTop <= 4;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 4;

      if (e.deltaY < -25 && isAtTop && currentPageNumber > 1) {
        isWheelingRef.current = true;
        soundManager.playNormalCue();
        onPageChange(currentPageNumber - 1);
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight - clientHeight - 30;
          }
          isWheelingRef.current = false;
        }, 350);
      } else if (e.deltaY > 25 && isAtBottom && currentPageNumber < pageCount) {
        isWheelingRef.current = true;
        soundManager.playNormalCue();
        onPageChange(currentPageNumber + 1);
        setTimeout(() => {
          if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = 15;
          }
          isWheelingRef.current = false;
        }, 350);
      }
    },
    [currentPageNumber, pageCount, onPageChange, onInteraction]
  );

  // Touch handlers for mobile/tablet swipe, scroll & 2-finger pinch-to-zoom
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    onInteraction?.();
    const el = scrollAreaRef.current;
    if (e.touches.length === 2) {
      isPinchingRef.current = true;
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      touchStartDistRef.current = dist;
      touchStartScaleRef.current = scale;
    } else if (e.touches.length === 1) {
      isPinchingRef.current = false;
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
      if (el) {
        touchScrollStartXRef.current = el.scrollLeft;
        touchScrollStartYRef.current = el.scrollTop;
      }
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    onInteraction?.();
    if (e.touches.length === 2 && isPinchingRef.current && touchStartDistRef.current) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      if (touchStartDistRef.current > 0) {
        const factor = dist / touchStartDistRef.current;
        const newScale = Math.min(Math.max(Number((touchStartScaleRef.current * factor).toFixed(2)), 0.5), 2.8);
        setScale(newScale);
      }
    } else if (e.touches.length === 1 && !isPinchingRef.current && scale > 1.05) {
      // Free panning in zoomed state on mobile/tablet
      const el = scrollAreaRef.current;
      if (el) {
        const deltaX = e.touches[0].clientX - touchStartXRef.current;
        const deltaY = e.touches[0].clientY - touchStartYRef.current;
        el.scrollLeft = touchScrollStartXRef.current - deltaX;
        el.scrollTop = touchScrollStartYRef.current - deltaY;
      }
    }
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    onInteraction?.();
    if (e.touches.length < 2) {
      touchStartDistRef.current = null;
      isPinchingRef.current = false;
    }

    if (e.changedTouches.length === 1 && !isPinchingRef.current) {
      const el = scrollAreaRef.current;
      if (!el) return;

      const deltaY = touchStartYRef.current - e.changedTouches[0].clientY;
      const deltaX = touchStartXRef.current - e.changedTouches[0].clientX;
      const { scrollTop, scrollHeight, clientHeight } = el;

      const isAtTop = scrollTop <= 8;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 8;

      // Only trigger page swipe turn when not zoomed in (scale <= 1.05) to allow free panning when zoomed
      if (scale <= 1.05) {
        // Vertical swipe down when at top -> Prev Page
        if (deltaY < -60 && isAtTop && currentPageNumber > 1) {
          soundManager.playNormalCue();
          onPageChange(currentPageNumber - 1);
        }
        // Vertical swipe up when at bottom -> Next Page
        else if (deltaY > 60 && isAtBottom && currentPageNumber < pageCount) {
          soundManager.playNormalCue();
          onPageChange(currentPageNumber + 1);
        }
        // Horizontal strong swipe (left = next, right = prev)
        else if (Math.abs(deltaX) > 85 && Math.abs(deltaY) < 45) {
          if (deltaX > 0 && currentPageNumber < pageCount) {
            soundManager.playNormalCue();
            onPageChange(currentPageNumber + 1);
          } else if (deltaX < 0 && currentPageNumber > 1) {
            soundManager.playNormalCue();
            onPageChange(currentPageNumber - 1);
          }
        }
      }
    }
  };

  // Desktop Mouse Drag / Pan Handlers
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // Only main left click
    onInteraction?.();
    const el = scrollAreaRef.current;
    if (!el) return;

    isMouseDownRef.current = true;
    hasMouseDraggedRef.current = false;
    mouseStartXRef.current = e.clientX;
    mouseStartYRef.current = e.clientY;
    scrollStartXRef.current = el.scrollLeft;
    scrollStartYRef.current = el.scrollTop;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isMouseDownRef.current) return;
    const el = scrollAreaRef.current;
    if (!el) return;

    const dx = e.clientX - mouseStartXRef.current;
    const dy = e.clientY - mouseStartYRef.current;

    // Register drag movement
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      if (!isDragging) setIsDragging(true);
      hasMouseDraggedRef.current = true;
      el.scrollLeft = scrollStartXRef.current - dx;
      el.scrollTop = scrollStartYRef.current - dy;
    }
  };

  const handleMouseUp = () => {
    if (isMouseDownRef.current) {
      isMouseDownRef.current = false;
      setIsDragging(false);
    }
  };

  const handleZoom = (delta: number) => {
    onInteraction?.();
    setScale((prev) => Math.min(Math.max(Number((prev + delta).toFixed(2)), 0.5), 2.8));
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    }
  };

  const handleKeyJump = (key: string) => {
    onInteraction?.();
    const targetPage = getStartingPageForKey(key);
    if (targetPage) {
      soundManager.playNormalCue();
      onPageChange(targetPage);
    }
  };

  const handleSongNoJump = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!songNoInput.trim()) return;
    onInteraction?.();
    const found = findPageBySongNumber(songNoInput.trim(), fallbackPageInfo.key);
    if (found) {
      soundManager.playNormalCue();
      onPageChange(found.pageNumber);
      setSongNoFeedback(`이동: ${found.pageNumber}쪽`);
      setTimeout(() => setSongNoFeedback(null), 2500);
      setSongNoInput('');
    } else {
      setSongNoFeedback('곡 없음');
      setTimeout(() => setSongNoFeedback(null), 2000);
    }
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={() => onInteraction?.()}
      onTouchStart={() => onInteraction?.()}
      className={`flex flex-col h-full w-full bg-neutral-950 rounded-xl sm:rounded-2xl border border-neutral-800 overflow-hidden relative shadow-2xl ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
      }`}
    >
      {/* Top Floating Control Toolbar (Slim & Responsive) */}
      <div className="bg-neutral-900/95 backdrop-blur-md border-b border-neutral-800 px-2 sm:px-3 py-1.5 flex items-center justify-between gap-1.5 z-10 shrink-0 flex-wrap">
        {/* Left: Key Selector, Song Number Search & File info */}
        <div className="flex items-center gap-1.5 min-w-0 flex-wrap">
          {/* Key Quick Select Dropdown */}
          <div className="flex items-center gap-1 bg-neutral-950 px-1.5 py-0.5 rounded-lg border border-amber-500/40">
            <span className="text-[10px] font-bold text-amber-400 shrink-0 hidden xs:inline">코드:</span>
            <select
              aria-label="찬양 코드 변경"
              value={fallbackPageInfo.key === 'INDEX' ? 'INDEX' : (['G', 'C', 'E'].includes(fallbackPageInfo.key) ? fallbackPageInfo.key : 'G')}
              onChange={(e) => handleKeyJump(e.target.value)}
              className="bg-amber-500 text-neutral-950 font-mono font-black text-xs rounded px-1.5 py-0.5 cursor-pointer outline-none focus:ring-1 focus:ring-amber-300"
            >
              <option value="G">G코드 (1p~)</option>
              <option value="C">C코드 (48p~)</option>
              <option value="E">E코드 (74p~)</option>
              <option value="INDEX">목차 (98p~)</option>
            </select>
          </div>

          {/* Song Number Direct Jump Input */}
          <form onSubmit={handleSongNoJump} className="flex items-center gap-1 bg-neutral-950 px-1.5 py-0.5 rounded-lg border border-neutral-700">
            <span className="text-[10px] font-bold text-neutral-400 shrink-0">곡#</span>
            <input
              type="text"
              inputMode="numeric"
              placeholder="곡번호"
              value={songNoInput}
              onChange={(e) => setSongNoInput(e.target.value)}
              className="w-12 sm:w-14 bg-transparent text-xs font-black text-amber-300 placeholder-neutral-500 outline-none text-center"
            />
            <button
              type="submit"
              className="px-1.5 py-0.5 rounded bg-neutral-800 hover:bg-neutral-700 text-[10px] font-bold text-amber-400 cursor-pointer transition shrink-0"
              title="곡 번호로 이동"
            >
              이동
            </button>
          </form>

          {songNoFeedback && (
            <span className="text-[10px] font-bold text-amber-400 bg-amber-950/80 border border-amber-600/50 px-1.5 py-0.5 rounded animate-pulse shrink-0">
              {songNoFeedback}
            </span>
          )}

          <span className="text-xs sm:text-sm font-black text-white truncate max-w-[120px] sm:max-w-[200px] hidden md:inline">
            {fallbackPageInfo.title || `${currentPageNumber}쪽`}
          </span>
        </div>

        {/* Center: Page Controls */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPageNumber <= 1}
            onClick={() => {
              soundManager.playNormalCue();
              onPageChange(currentPageNumber - 1);
            }}
            className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-200 transition cursor-pointer"
            title="이전 페이지"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-1 bg-neutral-950 px-2 py-0.5 rounded-lg border border-neutral-700">
            <input
              type="number"
              min={1}
              max={pageCount}
              value={currentPageNumber}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= pageCount) {
                  onPageChange(val);
                }
              }}
              className="w-8 bg-transparent text-center text-xs font-black text-amber-300 outline-none"
            />
            <span className="text-[11px] text-neutral-400 font-bold">/ {pageCount}쪽</span>
          </div>

          <button
            type="button"
            disabled={currentPageNumber >= pageCount}
            onClick={() => {
              soundManager.playNormalCue();
              onPageChange(currentPageNumber + 1);
            }}
            className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-200 transition cursor-pointer"
            title="다음 페이지"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right: Zoom & Score Display Utilities */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleZoom(-0.15)}
            className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
            title="축소"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setScale(1.0);
              if (scrollAreaRef.current) {
                scrollAreaRef.current.scrollLeft = 0;
                scrollAreaRef.current.scrollTop = 0;
              }
            }}
            className={`px-1.5 py-0.5 rounded-lg text-[10px] font-bold transition font-mono cursor-pointer flex items-center gap-1 ${
              scale > 1.05
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300'
            }`}
            title="기본 100% 크기로 리셋"
          >
            {scale > 1.05 && <RotateCcw className="w-2.5 h-2.5" />}
            <span>{Math.round(scale * 100)}%</span>
          </button>

          <button
            type="button"
            onClick={() => handleZoom(0.15)}
            className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition cursor-pointer"
            title="확대"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsHighContrast(!isHighContrast)}
            className={`p-1 rounded-lg border transition cursor-pointer ${
              isHighContrast
                ? 'bg-amber-500 text-neutral-950 border-amber-400'
                : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:text-white'
            }`}
            title="무대 다크 모드"
          >
            {isHighContrast ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          <label
            className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-amber-300 hover:text-amber-200 transition cursor-pointer flex items-center gap-1"
            title="소지하신 PDF 악보 파일 교체/업로드"
          >
            <Upload className="w-3.5 h-3.5" />
            <input type="file" accept=".pdf,application/pdf" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition cursor-pointer"
            title="전체화면"
          >
            {isFullscreen ? <Minimize className="w-3.5 h-3.5" /> : <Maximize className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Score Canvas / Viewer Area with wheel, touch swipe, pinch-to-zoom & mouse drag support */}
      <div
        ref={scrollAreaRef}
        onWheel={handleScrollAreaWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex-1 w-full overflow-auto p-1.5 sm:p-3 bg-neutral-900/95 scrollbar-thin scrollbar-thumb-neutral-700 select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div className="min-w-full min-h-full flex items-start justify-start w-max h-max">
          {/* PDF & Vector Score Canvas Container - m-auto allows both center alignment when fit and left/top scrolling when zoomed */}
          <div className="relative shadow-2xl rounded-lg overflow-hidden border border-neutral-700/80 bg-white shrink-0 m-auto">
            <canvas
              ref={canvasRef}
              className={`block transition-filter duration-150 ${
                isHighContrast && hasCustomPdf ? 'invert hue-rotate-180 brightness-110 contrast-125' : ''
              }`}
            />
            {isRendering && (
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 backdrop-blur text-amber-400 text-[10px] font-mono font-bold animate-pulse border border-amber-500/30">
                {currentPageNumber}쪽 표시 중...
              </div>
            )}
            {scale > 1.05 && !isRendering && (
              <div className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/75 backdrop-blur text-neutral-300 text-[10px] font-medium border border-neutral-700/60 pointer-events-none flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
                <Move className="w-3 h-3 text-amber-400" />
                <span>마우스/터치 드래그로 상하좌우 이동</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick Flip Bar on Mobile/Tablet */}
      <div className="md:hidden bg-neutral-900/90 border-t border-neutral-800 px-3 py-1.5 flex items-center justify-between shrink-0">
        <button
          type="button"
          disabled={currentPageNumber <= 1}
          onClick={() => {
            soundManager.playNormalCue();
            onPageChange(currentPageNumber - 1);
          }}
          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>이전쪽</span>
        </button>

        <span className="text-xs font-mono font-bold text-amber-400">
          p.{currentPageNumber} / {pageCount}
        </span>

        <button
          type="button"
          disabled={currentPageNumber >= pageCount}
          onClick={() => {
            soundManager.playNormalCue();
            onPageChange(currentPageNumber + 1);
          }}
          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 text-neutral-200 text-xs font-bold flex items-center gap-1 cursor-pointer"
        >
          <span>다음쪽</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
