import { useEffect } from "react";

export default function useKeyboard(
    eventType: 'keypress' | 'keyup' | 'keydown',
    listener: (event: KeyboardEvent) => void,
) {
  useEffect(() => {
    console.warn('mount');
    document.addEventListener(eventType, listener);
    return () => {
      console.warn('unmount');
      document.removeEventListener(eventType, listener);
    };
  }, [eventType, listener]);    
}
