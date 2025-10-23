import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      // Ignora se estiver digitando em um input, textarea ou elemento editável
      const target = event.target as HTMLElement;
      const isTyping = 
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable;

      if (isTyping) return;

      // Ignora se estiver usando modificadores (Ctrl, Alt, Meta/Cmd)
      if (event.ctrlKey || event.altKey || event.metaKey) return;

      // Converte para maiúscula para facilitar comparação
      const key = event.key.toUpperCase();

      // Atalhos de navegação
      switch (key) {
        case 'D':
          navigate('/');
          break;
        case 'C':
          navigate('/crm');
          break;
        case 'T':
          navigate('/tasks');
          break;
        case 'R':
          navigate('/reports');
          break;
        case 'F':
          navigate('/funnel');
          break;
        case 'A':
          navigate('/agent');
          break;
        case 'G':
          navigate('/guide');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [navigate]);
};
