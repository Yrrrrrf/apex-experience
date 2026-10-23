import { getContext } from 'svelte';

export function useResolver(explicitBase?: string) {
  let contextResolve: ((target: string) => string) | undefined;
  let contextBase: string | (() => string) | undefined;

  try {
    contextResolve = getContext<(target: string) => string>('apex.resolve');
    contextBase = getContext<string | (() => string) | undefined>('apex.base');
  } catch {
    // getContext may throw if invoked outside Svelte component initialization
  }

  return function resolve(target: string): string {
    if (contextResolve && !explicitBase) {
      return contextResolve(target);
    }
    if (
      !target ||
      target.startsWith('http://') ||
      target.startsWith('https://') ||
      target.startsWith('mailto:') ||
      target.startsWith('tel:') ||
      target.startsWith('//')
    ) {
      return target;
    }
    const resolvedContextBase = typeof contextBase === 'function' ? contextBase() : contextBase;
    let base = (explicitBase ?? resolvedContextBase ?? '').replace(/\/+$/, '');
    if (!base && typeof location !== 'undefined' && location.pathname.startsWith('/apex-experience')) {
      base = '/apex-experience';
    }
    if (target.startsWith('#')) {
      return `${base}/${target}`;
    }
    const cleanTarget = target.startsWith('/') ? target : `/${target}`;
    return `${base}${cleanTarget}`;
  };
}
