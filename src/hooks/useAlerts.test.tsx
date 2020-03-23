import { renderHook, act } from '@testing-library/react-hooks'

import useAlerts from './useAlerts';

describe('useAlerts', () => {

  it('should return no alerts as default', () => {
    const { result } = renderHook(() => useAlerts());

    expect(result.current.alerts).toEqual([]);
  });

  it('should allow to add an alert', () => {
    const { result } = renderHook(() => useAlerts());

    act(() => result.current.addAlert({
      title: 'An alert',
    }));

    expect(result.current.alerts).toHaveLength(1);
  });

  it('should allow to add two alerts', () => {
    const { result } = renderHook(() => useAlerts());

    act(() => result.current.addAlert({
      title: 'An alert',
    }));
    act(() => result.current.addAlert({
      title: 'Another alert',
    }));

    expect(result.current.alerts).toHaveLength(2);
  });

  it('should allow to set two alerts', () => {
    const { result } = renderHook(() => useAlerts());

    act(() => result.current.setAlert({
      title: 'An alert',
    }));
    act(() => result.current.setAlert({
      title: 'Another alert',
    }));

    expect(result.current.alerts).toHaveLength(1);
  });

  it('should allow to add and remove an alert', () => {
    const { result } = renderHook(() => useAlerts());

    act(() => result.current.addAlert({
      key: 'alert-1',
      title: 'An alert',
    }));
    act(() => result.current.removeAlert('alert-1'));

    expect(result.current.alerts).toEqual([]);
  });

});
