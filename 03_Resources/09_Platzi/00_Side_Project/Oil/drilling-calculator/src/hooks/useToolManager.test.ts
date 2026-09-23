import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useToolManager } from './useToolManager';

describe('useToolManager', () => {
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    // Spy on window.addEventListener/removeEventListener inside the test block
    // where window is guaranteed to be available in jsdom environment
    if (typeof window !== 'undefined') {
      removeEventListenerSpy = vi.spyOn(window, 'removeEventListener');
    }
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (removeEventListenerSpy) {
      removeEventListenerSpy.mockRestore();
    }
  });

  it('debería inicializar en modo rotate por defecto', () => {
    const { result } = renderHook(() => useToolManager());

    expect(result.current.mode).toBe('rotate');
    expect(result.current.isSelectionMode).toBe(false);
    expect(result.current.isPanMode).toBe(false);
  });

  it('debería activar/desactivar el modo selección con la tecla V', () => {
    const { result } = renderHook(() => useToolManager());

    // Simular presionar 'v'
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'v' });
      window.dispatchEvent(event);
    });

    expect(result.current.isSelectionMode).toBe(true);

    // Simular soltar 'v'
    act(() => {
      const event = new KeyboardEvent('keyup', { key: 'v' });
      window.dispatchEvent(event);
    });

    // En modo toggle, al soltar debería mantenerse activo (esperamos que el hook maneje el toggle en keydown)
    // Para este test, asumimos que la tecla V es un toggle en keydown.
    // Verificamos que al presionar de nuevo se desactive.
    act(() => {
      const event = new KeyboardEvent('keydown', { key: 'v' });
      window.dispatchEvent(event);
    });

    expect(result.current.isSelectionMode).toBe(false);
  });

  it('debería activar modo pan temporal con la barra espaciadora', () => {
    const { result } = renderHook(() => useToolManager());

    // Simular presionar Espacio
    act(() => {
      const event = new KeyboardEvent('keydown', { key: ' ' });
      window.dispatchEvent(event);
    });

    expect(result.current.isPanMode).toBe(true);
    expect(result.current.mode).toBe('hand');

    // Simular soltar Espacio
    act(() => {
      const event = new KeyboardEvent('keyup', { key: ' ' });
      window.dispatchEvent(event);
    });

    expect(result.current.isPanMode).toBe(false);
    expect(result.current.mode).toBe('rotate'); // Debería volver a rotate
  });

  it('debería limpiar event listeners al desmontar', () => {
    const { unmount } = renderHook(() => useToolManager());

    unmount();

    // Verificar que se agregaron y removieron listeners (count calls)
    // El mock de vi.spyOn nos permite contar las llamadas, pero aquí solo validamos que se llamó a removeEventListener
    if (removeEventListenerSpy) {
      expect(removeEventListenerSpy).toHaveBeenCalled();
    }
  });
});