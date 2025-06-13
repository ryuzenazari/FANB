import { ref, computed } from 'vue';

interface CacheValue<T> {
  data: T;
  timestamp: number;
  expiresAt: number; // Timestamp ketika cache kedaluwarsa
}

interface CacheOptions {
  /** Waktu kedaluwarsa dalam milidetik */
  ttl?: number;
  /** Menentukan apakah akan refresh cache secara otomatis ketika hampir kedaluwarsa */
  autoRefresh?: boolean;
  /** Persentase TTL ketika auto refresh terjadi (0-1) */
  refreshThreshold?: number;
}

// Simpan cache di memori
const globalCache: Record<string, CacheValue<unknown>> = {};

/**
 * Composable untuk manajemen cache data
 */
export function useCache() {
  // TTL default 5 menit
  const DEFAULT_TTL = 5 * 60 * 1000;
  // Default refresh threshold 75% dari TTL
  const DEFAULT_REFRESH_THRESHOLD = 0.75;
  
  /**
   * Menyimpan data ke cache
   * @param key - Kunci cache
   * @param data - Data yang akan disimpan
   * @param options - Opsi cache
   */
  const setItem = <T>(key: string, data: T, options: CacheOptions = {}) => {
    const ttl = options.ttl || DEFAULT_TTL;
    const now = Date.now();
    
    globalCache[key] = {
      data,
      timestamp: now,
      expiresAt: now + ttl
    };
  };
  
  /**
   * Mengambil data dari cache
   * @param key - Kunci cache
   * @param fetchCallback - Fungsi untuk memperbarui data jika tidak ada cache atau sudah kedaluwarsa
   * @param options - Opsi cache
   */
  const getItem = async <T>(
    key: string, 
    fetchCallback?: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T | null> => {
    const now = Date.now();
    const cachedItem = globalCache[key] as CacheValue<T> | undefined;
    
    // Jika cache ada dan belum kedaluwarsa
    if (cachedItem && cachedItem.expiresAt > now) {
      const { autoRefresh, refreshThreshold = DEFAULT_REFRESH_THRESHOLD } = options;
      
      // Jika autoRefresh diaktifkan dan cache hampir kedaluwarsa, update cache di latar belakang
      if (
        autoRefresh && 
        fetchCallback && 
        (cachedItem.expiresAt - now) < ((options.ttl || DEFAULT_TTL) * (1 - refreshThreshold))
      ) {
        // Lakukan refresh di background
        fetchCallback().then(freshData => {
          setItem(key, freshData, options);
        }).catch(err => {
          console.warn(`Background cache refresh failed for key "${key}":`, err);
        });
      }
      
      return cachedItem.data;
    }
    
    // Jika tidak ada cache atau sudah kedaluwarsa, tetapi ada fetchCallback
    if (fetchCallback) {
      try {
        const freshData = await fetchCallback();
        setItem(key, freshData, options);
        return freshData;
      } catch (error) {
        console.error(`Failed to fetch data for cache key "${key}":`, error);
        
        // Jika cache ada tapi kedaluwarsa, gunakan data lama daripada gagal total
        if (cachedItem) {
          console.warn(`Returning stale data for key "${key}"`);
          return cachedItem.data;
        }
        
        throw error;
      }
    }
    
    // Tidak ada cache dan tidak ada fetchCallback
    return null;
  };
  
  /**
   * Memeriksa apakah cache sudah kedaluwarsa
   * @param key - Kunci cache
   */
  const isExpired = (key: string): boolean => {
    const item = globalCache[key];
    return !item || item.expiresAt < Date.now();
  };
  
  /**
   * Menghapus item dari cache
   * @param key - Kunci cache
   */
  const removeItem = (key: string): void => {
    delete globalCache[key];
  };
  
  /**
   * Membersihkan semua cache
   */
  const clearCache = (): void => {
    Object.keys(globalCache).forEach(key => {
      delete globalCache[key];
    });
  };
  
  /**
   * Menghapus semua cache yang sudah kedaluwarsa
   */
  const clearExpired = (): void => {
    const now = Date.now();
    Object.keys(globalCache).forEach(key => {
      if (globalCache[key].expiresAt < now) {
        delete globalCache[key];
      }
    });
  };
  
  /**
   * Mendapatkan info tentang status cache
   */
  const getCacheStats = () => {
    const now = Date.now();
    const totalItems = Object.keys(globalCache).length;
    const expiredItems = Object.values(globalCache).filter(item => item.expiresAt < now).length;
    
    return {
      totalItems,
      expiredItems,
      validItems: totalItems - expiredItems
    };
  };
  
  return {
    setItem,
    getItem,
    removeItem,
    clearCache,
    clearExpired,
    isExpired,
    getCacheStats
  };
} 