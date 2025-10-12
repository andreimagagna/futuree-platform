import { useEffect, useRef, useState } from 'react';
import { LandingPageComponent, LandingPageTemplate } from '@/types/LandingPage';

interface AutoSaveOptions {
  interval?: number; // milliseconds
  enabled?: boolean;
}

export function useAutoSave(
  pageId: string | null,
  components: LandingPageComponent[],
  pageData: LandingPageTemplate | null,
  options: AutoSaveOptions = {}
) {
  const { interval = 30000, enabled = true } = options; // 30 seconds default
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const saveToLocalStorage = () => {
    if (!pageId || !pageData) return;

    setIsSaving(true);
    try {
      const savedPages = JSON.parse(localStorage.getItem('landingPages') || '[]');
      const pageIndex = savedPages.findIndex((p: LandingPageTemplate) => p.id === pageId);

      const updatedPage: LandingPageTemplate = {
        ...pageData,
        components,
        updatedAt: new Date().toISOString(),
      };

      if (pageIndex >= 0) {
        savedPages[pageIndex] = updatedPage;
      } else {
        savedPages.push(updatedPage);
      }

      localStorage.setItem('landingPages', JSON.stringify(savedPages));
      
      // Save version history
      saveVersion(pageId, updatedPage);
      
      setLastSaved(new Date());
    } catch (error) {
      console.error('Error auto-saving:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const saveVersion = (id: string, page: LandingPageTemplate) => {
    try {
      const versions = JSON.parse(localStorage.getItem(`versions_${id}`) || '[]');
      
      // Keep only last 50 versions
      const newVersions = [
        {
          timestamp: new Date().toISOString(),
          components: page.components,
          settings: page.settings,
        },
        ...versions,
      ].slice(0, 50);

      localStorage.setItem(`versions_${id}`, JSON.stringify(newVersions));
    } catch (error) {
      console.error('Error saving version:', error);
    }
  };

  useEffect(() => {
    if (!enabled || !pageId) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      saveToLocalStorage();
    }, interval);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [components, pageId, enabled, interval]);

  const manualSave = () => {
    saveToLocalStorage();
  };

  return {
    lastSaved,
    isSaving,
    manualSave,
  };
}
