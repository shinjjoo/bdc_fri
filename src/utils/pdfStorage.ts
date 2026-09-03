/**
 * IndexedDB helper to persist and retrieve worship score PDF files locally
 */

const DB_NAME = 'PraiseCueDB';
const DB_VERSION = 1;
const STORE_NAME = 'pdf_assets';
const PDF_KEY = 'current_worship_score_pdf';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveScorePDF(arrayBuffer: ArrayBuffer, fileName: string = 'worship_scores.pdf'): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const data = {
        buffer: arrayBuffer,
        name: fileName,
        savedAt: Date.now(),
        size: arrayBuffer.byteLength,
      };
      const req = store.put(data, PDF_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to save PDF to IndexedDB:', err);
  }
}

export async function loadScorePDF(): Promise<{ buffer: ArrayBuffer; name: string } | null> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(PDF_KEY);
      req.onsuccess = () => {
        if (req.result && req.result.buffer) {
          resolve({ buffer: req.result.buffer, name: req.result.name });
        } else {
          resolve(null);
        }
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to load PDF from IndexedDB:', err);
    return null;
  }
}

export async function clearScorePDF(): Promise<void> {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(PDF_KEY);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('Failed to clear PDF from IndexedDB:', err);
  }
}
