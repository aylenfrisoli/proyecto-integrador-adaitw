// copia sin cambios de @trecear/mobile-menu 1.0.0 (repo utilities-js); si se instala el paquete, se borra este archivo y se importa de "@trecear/mobile-menu"
const STYLE_ID = 'trecear-mobile-menu-styles';

const CSS = `
.tmm-toggle{position:relative;display:flex;align-items:center;justify-content:center;width:var(--tmm-toggle-size,64px);height:var(--tmm-toggle-size,64px);padding:0;border:0;background:var(--tmm-toggle-bg,transparent);color:var(--tmm-toggle-color,#fff);cursor:pointer}
.tmm-toggle[data-floating]{position:fixed;top:0;right:0;z-index:calc(var(--tmm-z,40) + 1)}
.tmm-toggle:focus-visible{outline:2px solid currentColor;outline-offset:-4px}
.tmm-icon{position:relative;display:block;width:24px;height:12px}
.tmm-icon span{position:absolute;left:0;width:100%;height:1px;background:currentColor;transition:transform .5s cubic-bezier(.16,1,.3,1)}
.tmm-icon span:first-child{top:0}
.tmm-icon span:last-child{bottom:0}
.tmm-toggle.is-open .tmm-icon span:first-child{transform:translateY(5.5px) rotate(45deg)}
.tmm-toggle.is-open .tmm-icon span:last-child{transform:translateY(-5.5px) rotate(-45deg)}
.tmm-sr{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}

.tmm-panel{position:fixed;inset:0;z-index:var(--tmm-z,40);display:flex;flex-direction:column;box-sizing:border-box;padding-top:var(--tmm-top,64px);background:var(--tmm-bg,#111827);color:var(--tmm-color,#fff);font-family:var(--tmm-font,inherit);transform:translateY(-100%);visibility:hidden;transition:transform .5s cubic-bezier(.65,0,.35,1) .15s,visibility 0s linear .65s}
.tmm-panel.is-open{transform:none;visibility:visible;transition:transform .7s cubic-bezier(.16,1,.3,1),visibility 0s}
.tmm-nav{display:flex;flex:1;flex-direction:column;justify-content:center;overflow-y:auto;border-top:1px solid var(--tmm-border,rgba(255,255,255,.12))}
.tmm-link{display:block;padding:20px 24px;border-bottom:1px solid var(--tmm-border,rgba(255,255,255,.12));color:inherit;font-size:var(--tmm-link-size,clamp(2.25rem,8vw,3.75rem));font-weight:var(--tmm-link-weight,700);line-height:1.1;text-decoration:none;opacity:0;translate:0 1.5rem;transition:opacity .15s linear,translate 0s linear .15s,background-color .2s,color .2s}
.tmm-panel.is-open .tmm-link{opacity:1;translate:0 0;transition:opacity .6s var(--tmm-stagger,0s),translate .8s cubic-bezier(.16,1,.3,1) var(--tmm-stagger,0s),background-color .2s,color .2s}
.tmm-link:hover,.tmm-link:focus-visible{background:rgba(255,255,255,.04);color:var(--tmm-accent,#3b82f6)}
.tmm-actions{display:grid;grid-template-columns:repeat(var(--tmm-cols,1),1fr);border-top:1px solid var(--tmm-border,rgba(255,255,255,.12))}
.tmm-action{display:flex;align-items:center;justify-content:space-between;padding:20px 24px;background:var(--tmm-accent,#3b82f6);color:var(--tmm-accent-color,#fff);font-weight:600;text-decoration:none}
.tmm-action+.tmm-action{border-left:1px solid var(--tmm-border,rgba(255,255,255,.12))}
.tmm-action:focus-visible{outline:2px solid currentColor;outline-offset:-4px}
.tmm-root-hidden{display:none!important}
@media (prefers-reduced-motion:reduce){.tmm-panel,.tmm-panel.is-open,.tmm-link,.tmm-panel.is-open .tmm-link,.tmm-icon span{transition:none}}
`;

const hasDOM = typeof document !== 'undefined';

function ensureStyles() {
  if (!hasDOM || document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  document.head.appendChild(style);
}

function resolve(target) {
  return typeof target === 'string' ? document.querySelector(target) : target || null;
}

const FOCUSABLE = 'a[href],button:not([disabled]),[tabindex]:not([tabindex="-1"])';

/**
 * Full-screen hamburger menu: an animated toggle plus a panel that slides down from the top,
 * with staggered links and optional action buttons at the bottom. Plain DOM, no dependencies.
 *
 * Without `toggle` it creates a button fixed at the top-right. With `toggle` it wires your own
 * button instead (and fills it with the animated icon if it is empty).
 *
 * @param {Object}  options
 * @param {{ label: string, href: string, onClick?: (event: MouseEvent) => void }[]} options.items  Menu links, in order.
 * @param {{ label: string, href: string, newTab?: boolean, icon?: string }[]} [options.actions=[]]  Buttons at the bottom of the panel (e.g. WhatsApp, Email). Side by side.
 * @param {string|HTMLElement} [options.toggle]    Your own toggle button (element or selector).
 * @param {string}  [options.toggleLabel='Abrir menú principal']  Accessible name of the built-in toggle.
 * @param {string}  [options.panelLabel='Menú mobile']            aria-label of the nav.
 * @param {number|null} [options.breakpoint=1024]  From this viewport width up the menu hides and closes itself. `null` = always available.
 * @param {number}  [options.topOffset=64]         Height reserved at the top of the panel (your header), in px.
 * @param {boolean} [options.smoothScroll=true]    Hash links (`#section`) close the menu and scroll smoothly to the section.
 * @param {boolean} [options.lockScroll=true]      Block page scroll while open.
 * @param {(locked: boolean) => void} [options.onScrollLock]  Fired when scroll is locked/unlocked (e.g. to stop/start Lenis).
 * @param {() => void} [options.onOpen]
 * @param {() => void} [options.onClose]
 * @param {number}  [options.zIndex=40]            Panel layer. The built-in toggle sits one above. If you bring your own toggle, keep it above this.
 * @param {string}  [options.background]           Panel color (default #111827).
 * @param {string}  [options.color]                Text color (default #ffffff).
 * @param {string}  [options.accent]               Hover color and action buttons (default #3b82f6).
 * @param {string}  [options.accentColor]          Text on action buttons (default #ffffff).
 * @param {string}  [options.borderColor]          Divider lines.
 * @param {string}  [options.fontFamily]           Defaults to the page font.
 * @param {string}  [options.linkSize]             CSS font-size of the links.
 * @param {string}  [options.toggleColor]          Icon color of the built-in toggle (default #ffffff).
 * @param {string}  [options.toggleBackground]     Built-in toggle background (default transparent).
 * @param {number}  [options.toggleSize]           Built-in toggle side, in px (default 64).
 * @param {string}  [options.className]            Extra classes for the panel.
 * @param {HTMLElement} [options.container=document.body]  Where the panel (and built-in toggle) are added.
 * @returns {{ element: HTMLElement|null, toggleElement: HTMLElement|null, open: () => void, close: () => void, toggle: () => void, isOpen: () => boolean, destroy: () => void }}
 */
export function initMobileMenu(options = {}) {
  const noop = () => {};
  if (!hasDOM) {
    return { element: null, toggleElement: null, open: noop, close: noop, toggle: noop, isOpen: () => false, destroy: noop };
  }

  const {
    items = [],
    actions = [],
    toggleLabel = 'Abrir menú principal',
    panelLabel = 'Menú mobile',
    breakpoint = 1024,
    topOffset = 64,
    smoothScroll = true,
    lockScroll = true,
    onScrollLock,
    onOpen,
    onClose,
    zIndex,
    background,
    color,
    accent,
    accentColor,
    borderColor,
    fontFamily,
    linkSize,
    toggleColor,
    toggleBackground,
    toggleSize,
    className = '',
    container = document.body,
  } = options;

  ensureStyles();

  const setVars = (el, vars) => {
    for (const [name, value] of Object.entries(vars)) {
      if (value !== undefined && value !== null) el.style.setProperty(name, typeof value === 'number' ? value + 'px' : value);
    }
  };

  // Panel
  const panel = document.createElement('div');
  panel.className = `tmm-panel ${className}`.trim();
  panel.id = `tmm-${Math.random().toString(36).slice(2, 8)}`;
  setVars(panel, {
    '--tmm-z': zIndex,
    '--tmm-top': topOffset,
    '--tmm-bg': background,
    '--tmm-color': color,
    '--tmm-accent': accent,
    '--tmm-accent-color': accentColor,
    '--tmm-border': borderColor,
    '--tmm-font': fontFamily,
    '--tmm-link-size': linkSize,
  });

  const nav = document.createElement('nav');
  nav.className = 'tmm-nav';
  nav.setAttribute('aria-label', panelLabel);

  const linkEls = items.map((item, i) => {
    const a = document.createElement('a');
    a.className = 'tmm-link';
    a.href = item.href;
    a.textContent = item.label; // user text never goes through innerHTML
    a.style.setProperty('--tmm-stagger', `${0.15 + i * 0.07}s`);
    nav.appendChild(a);
    return a;
  });
  panel.appendChild(nav);

  if (actions.length) {
    const bar = document.createElement('div');
    bar.className = 'tmm-actions';
    bar.style.setProperty('--tmm-cols', String(actions.length));
    for (const action of actions) {
      const a = document.createElement('a');
      a.className = 'tmm-action';
      a.href = action.href;
      if (action.newTab) {
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
      }
      const label = document.createElement('span');
      label.textContent = action.label;
      const icon = document.createElement('span');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = action.icon ?? '→';
      a.append(label, icon);
      bar.appendChild(a);
    }
    panel.appendChild(bar);
  }
  container.appendChild(panel);

  // Toggle: yours, or a built-in one fixed at the top-right.
  let toggleEl = resolve(options.toggle);
  const ownsToggle = !toggleEl;
  if (ownsToggle) {
    toggleEl = document.createElement('button');
    toggleEl.type = 'button';
    toggleEl.className = 'tmm-toggle';
    toggleEl.dataset.floating = '';
    setVars(toggleEl, {
      '--tmm-z': zIndex,
      '--tmm-toggle-color': toggleColor,
      '--tmm-toggle-bg': toggleBackground,
      '--tmm-toggle-size': toggleSize,
    });
    container.appendChild(toggleEl);
  }
  const hadContent = toggleEl.childElementCount > 0 || toggleEl.textContent.trim() !== '';
  if (!hadContent) {
    toggleEl.innerHTML = '<span class="tmm-sr"></span><span class="tmm-icon" aria-hidden="true"><span></span><span></span></span>';
    toggleEl.querySelector('.tmm-sr').textContent = toggleLabel;
    toggleEl.classList.add('tmm-toggle');
  }
  toggleEl.setAttribute('aria-expanded', 'false');
  toggleEl.setAttribute('aria-controls', panel.id);

  // State
  let isOpen = false;
  let prevOverflow = '';
  let prevPadding = '';

  const lock = (locked) => {
    if (!lockScroll) return;
    const body = document.body;
    if (locked) {
      prevOverflow = body.style.overflow;
      prevPadding = body.style.paddingRight;
      const bar = window.innerWidth - document.documentElement.clientWidth;
      body.style.overflow = 'hidden';
      if (bar > 0) body.style.paddingRight = `${bar}px`;
    } else {
      body.style.overflow = prevOverflow;
      body.style.paddingRight = prevPadding;
    }
    onScrollLock?.(locked);
  };

  const setOpen = (value) => {
    if (value === isOpen) return;
    isOpen = value;
    panel.classList.toggle('is-open', isOpen);
    toggleEl.classList.toggle('is-open', isOpen);
    toggleEl.setAttribute('aria-expanded', String(isOpen));
    lock(isOpen);
    if (isOpen) linkEls[0]?.focus({ preventScroll: true });
    (isOpen ? onOpen : onClose)?.();
  };
  const open = () => setOpen(true);
  const close = () => setOpen(false);
  const toggle = () => setOpen(!isOpen);

  // Events
  const onKey = (e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') {
      close();
      toggleEl.focus();
      return;
    }
    if (e.key !== 'Tab') return;
    // Keep Tab inside the panel and the toggle.
    const focusables = [...panel.querySelectorAll(FOCUSABLE), toggleEl].filter((el) => !el.hidden);
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const onPanelClick = (e) => {
    const link = e.target.closest('a');
    if (!link) return;
    const item = items[linkEls.indexOf(link)];
    item?.onClick?.(e);
    if (e.defaultPrevented) return;
    close();
    const href = link.getAttribute('href') || '';
    if (smoothScroll && href.startsWith('#') && href.length > 1) {
      const target = document.getElementById(decodeURIComponent(href.slice(1)));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
        history.pushState(null, '', href);
      }
    }
  };

  toggleEl.addEventListener('click', toggle);
  panel.addEventListener('click', onPanelClick);
  document.addEventListener('keydown', onKey);

  // Hide + close from the breakpoint up (desktop shows its own nav).
  let mql = null;
  const onMedia = () => {
    const desktop = mql.matches;
    panel.classList.toggle('tmm-root-hidden', desktop);
    if (ownsToggle) toggleEl.classList.toggle('tmm-root-hidden', desktop);
    if (desktop) close();
  };
  if (breakpoint !== null) {
    mql = window.matchMedia(`(min-width: ${breakpoint}px)`);
    mql.addEventListener('change', onMedia);
    onMedia();
  }

  return {
    element: panel,
    toggleElement: toggleEl,
    open,
    close,
    toggle,
    isOpen: () => isOpen,
    destroy() {
      close();
      toggleEl.removeEventListener('click', toggle);
      panel.removeEventListener('click', onPanelClick);
      document.removeEventListener('keydown', onKey);
      mql?.removeEventListener('change', onMedia);
      panel.remove();
      if (ownsToggle) toggleEl.remove();
      else {
        toggleEl.classList.remove('is-open');
        toggleEl.removeAttribute('aria-expanded');
        toggleEl.removeAttribute('aria-controls');
        if (!hadContent) toggleEl.innerHTML = '';
      }
    },
  };
}
