import { useState, useMemo } from 'react';

export default function useModal() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = useMemo(() => () => setIsOpen(true), []);
  const close = useMemo(() => () => setIsOpen(false), []);

  return {
    isOpen,
    open,
    close,
  };
}
