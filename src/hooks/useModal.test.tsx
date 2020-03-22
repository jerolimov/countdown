import { renderHook, act } from '@testing-library/react-hooks'

import useModal from './useModal';

describe('useModal', () => {

  it('should not show the modal as default', () => {
    const { result } = renderHook(() => useModal());

    expect(result.current.isOpen).toBe(false);
  });

  it('should allow to open the modal dialog', () => {
    const { result } = renderHook(() => useModal());

    act(() => result.current.open())

    expect(result.current.isOpen).toBe(true);
  });

  it('should allow to open and close the modal dialog', () => {
    const { result } = renderHook(() => useModal());

    act(() => result.current.open())
    act(() => result.current.close())

    expect(result.current.isOpen).toBe(false);
  });

});
