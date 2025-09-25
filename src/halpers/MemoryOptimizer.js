import { Platform } from 'react-native';
import FastImage from 'react-native-fast-image';

class MemoryOptimizer {
  constructor() {
    this.memoryWarningListeners = [];
    this.imageCache = new Map();
    this.maxCacheSize = 50; // Maximum number of images to cache
    
    this.init();
  }

  init() {
    // Listen for memory warnings on iOS
    if (Platform.OS === 'ios') {
      // iOS memory warning handling would go here
      // React Native doesn't expose this directly, but we can simulate it
    }
  }

  // Optimize images
  optimizeImage = (source, options = {}) => {
    const defaultOptions = {
      priority: FastImage.priority.normal,
      cache: FastImage.cacheControl.immutable,
      resizeMode: FastImage.resizeMode.cover,
      ...options
    };

    return {
      ...source,
      ...defaultOptions
    };
  };

  // Clear image cache periodically
  clearImageCache = () => {
    try {
      FastImage.clearMemoryCache();
      FastImage.clearDiskCache();
      this.imageCache.clear();
      console.log('Image cache cleared');
    } catch (error) {
      console.error('Error clearing image cache:', error);
    }
  };

  // Manage image cache size
  manageImageCache = (imageUri) => {
    if (this.imageCache.size >= this.maxCacheSize) {
      // Remove oldest entries
      const firstKey = this.imageCache.keys().next().value;
      this.imageCache.delete(firstKey);
    }
    this.imageCache.set(imageUri, Date.now());
  };

  // Force garbage collection (if available)
  forceGarbageCollection = () => {
    if (global.gc) {
      global.gc();
      console.log('Garbage collection forced');
    }
  };

  // Optimize component rendering
  shouldComponentUpdate = (nextProps, currentProps, keys = []) => {
    if (!keys.length) {
      // Shallow comparison of all props
      return JSON.stringify(nextProps) !== JSON.stringify(currentProps);
    }
    
    // Compare specific keys only
    return keys.some(key => nextProps[key] !== currentProps[key]);
  };

  // Memory-efficient array operations
  chunkArray = (array, chunkSize = 10) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Debounce function calls to prevent excessive re-renders
  debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  };

  // Throttle function calls
  throttle = (func, limit = 100) => {
    let inThrottle;
    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  };

  // Clean up large objects
  cleanupLargeObjects = (obj) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
          if (Array.isArray(obj[key])) {
            obj[key] = [];
          } else {
            obj[key] = {};
          }
        } else {
          obj[key] = null;
        }
      });
    }
  };

  // Monitor memory usage (simplified)
  getMemoryInfo = () => {
    // This is a placeholder - actual memory monitoring would require native modules
    return {
      used: 'N/A',
      available: 'N/A',
      total: 'N/A'
    };
  };

  // Optimize FlatList rendering
  getFlatListOptimization = () => {
    return {
      removeClippedSubviews: true,
      maxToRenderPerBatch: 10,
      updateCellsBatchingPeriod: 50,
      initialNumToRender: 10,
      windowSize: 5,
      getItemLayout: (data, index) => ({
        length: 70, // Adjust based on your item height
        offset: 70 * index,
        index,
      }),
    };
  };

  // Cleanup function
  cleanup = () => {
    this.clearImageCache();
    this.forceGarbageCollection();
    this.memoryWarningListeners = [];
    console.log('Memory optimizer cleaned up');
  };
}

// Create singleton instance
const memoryOptimizer = new MemoryOptimizer();

export default memoryOptimizer;
