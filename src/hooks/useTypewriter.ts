import { useState, useEffect } from 'react';

export function useTypewriter(text: string, speed: number = 20, enabled: boolean = true) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!enabled) { setDisplayed(text); setDone(true); return; }
    setDisplayed('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      if (i >= text.length) {
        setDisplayed(text);
        setDone(true);
        clearInterval(interval);
      } else {
        setDisplayed(text.substring(0, i));
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, enabled]);

  const skip = () => { setDisplayed(text); setDone(true); };
  return { displayed, done, skip };
}
