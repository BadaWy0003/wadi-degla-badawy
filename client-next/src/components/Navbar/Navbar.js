'use client';
// Site header (redesigned 2026-11-17, owner chose design A "Clean list").
// Desktop (1231px+): the floating bar with the links across the top; Wadi Degla, Products and
// Resources open a dropdown on hover, click or keyboard (Products shows small stone photos);
// on the right the search, the language picker ("EN ▾") and a small person icon (login).
// Phone/tablet (up to 1230px): logo, search and ☰. The menu is a full-screen sheet with the same
// top bar (logo + ✕, nothing jumps), a search field, one section open at a time (the section of
// the current page opens first), and Language + Login at the bottom. The page behind doesn't
// scroll; Esc, ✕ or any link closes it.
// The page you are on is marked in gold. Menu lists: src/util/site-menu.js (also the footer).
import './Navbar.css';
import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { FaBars, FaTimes, FaSearch, FaUser, FaGlobe } from 'react-icons/fa';
import LangLink from '../LangLink';
import { useGlobalState } from '../GlobalStateContext.js';
import { useLang } from '../../context/LangContext';
import { getApiClient } from '../../util/api-lazy.js';
import SearchBar from '../SearchBar/SearchBar.js.js';
import SearchBarMobile from '../SearchBar/SearchBarMobile.js.js';
import LanguageSelector, { LanguageList, LANGUAGES } from '../LanguageSelector/LanguageSelector';
import { COMPANY_MENU, PRODUCTS_MENU, RESOURCES_MENU, menuOfPath } from '../../util/site-menu';

const LOGO_WHITE = '/Assets/Logo-Identity/wadi-degla-logo-white.svg';
const LOGO_COLOR = '/Assets/Logo-Identity/wadi-degla-logo-color.svg';

// The order of the top bar: dropdowns and plain links
const TOP = [
  { menu: COMPANY_MENU },
  { menu: PRODUCTS_MENU },
  { href: '/projects', label: 'navigation.projects' },
  { menu: RESOURCES_MENU },
  { href: '/fairs', label: 'navigation.fairs' }, // on its own (owner, 2026-11-17)
  { href: '/contact', label: 'navigation.contact' },
];

const pathWithoutLang = (pathname) =>
  `/${String(pathname || '')
    .split('/')
    .slice(2)
    .join('/')}`;

// The links of one dropdown (desktop panel and phone section share it). The small stone
// pictures are only added once the menu has been opened (showImg), so closed menus don't
// download them on every page.
function MenuLinks({ menu, t, current, onNavigate, compact, showImg }) {
  return (
    <>
      {menu.groups.map((group, gi) => (
        <div
          className={`wn-group${group.items.some((i) => i.img) ? ' has-img' : ''}${
            compact && !group.items.some((i) => i.img) && menu.wide ? ' is-chips' : ''
          }`}
          key={group.title || gi}
        >
          {group.title && <p className="wn-group-title">{t(group.title)}</p>}
          <ul>
            {group.items.map((item) => {
              const here = current === item.href || current.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <LangLink
                    href={item.href}
                    onClick={onNavigate}
                    className={here ? 'is-here' : undefined}
                    aria-current={here ? 'page' : undefined}
                  >
                    {item.img &&
                      (showImg ? (
                        <img src={item.img} alt="" width="32" height="32" />
                      ) : (
                        <span className="wn-img-slot" aria-hidden="true" />
                      ))}
                    <span>{t(item.label)}</span>
                  </LangLink>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
      {menu.all && (
        <LangLink href={menu.all.href} onClick={onNavigate} className="wn-all">
          {t(menu.all.label)} <span aria-hidden="true">→</span>
        </LangLink>
      )}
    </>
  );
}

// Desktop dropdown: opens on hover (with a short delay before closing), click or keyboard
function DeskMenu({ menu, t, active, current, onNavigate }) {
  const [open, setOpen] = useState(false);
  const timer = useRef(null);
  const ref = useRef(null);
  // becomes true the first time the menu opens (then its pictures load and stay)
  const [seen, setSeen] = useState(false);
  const show = () => {
    clearTimeout(timer.current);
    setOpen(true);
  };
  useEffect(() => {
    if (open) setSeen(true);
  }, [open]);
  const hide = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(false), 140);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (!open) return undefined;
    const esc = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        ref.current?.querySelector('button')?.focus();
      }
    };
    document.addEventListener('keydown', esc);
    return () => document.removeEventListener('keydown', esc);
  }, [open]);
  const id = `wn-menu-${menu.label.split('.').pop()}`;
  return (
    <li
      className={`wn-item${open ? ' is-open' : ''}`}
      ref={ref}
      onMouseEnter={show}
      onMouseLeave={hide}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <button
        type="button"
        className={`wn-top${active ? ' is-here' : ''}`}
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((o) => !o)}
      >
        {t(menu.label)}
        <i className="wn-chev" aria-hidden="true" />
      </button>
      <div className={`wn-panel${menu.wide ? ' is-wide' : ''}`} id={id}>
        <div className="wn-panel-in">
          <MenuLinks
            menu={menu}
            t={t}
            current={current}
            showImg={seen}
            onNavigate={() => {
              setOpen(false);
              onNavigate();
            }}
          />
        </div>
      </div>
    </li>
  );
}

export default function Navbar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const router = useRouter();
  const lang = useLang();
  const { globalState, setGlobalState } = useGlobalState();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false); // phone menu
  const [section, setSection] = useState(null); // open section in the phone menu
  const [langOpen, setLangOpen] = useState(false); // language list in the phone menu
  const burgerRef = useRef(null);
  const closeRef = useRef(null);

  const current = pathWithoutLang(pathname);
  const activeMenu = menuOfPath(current);
  const currentLangName = LANGUAGES.find((l) => l.code === lang)?.name || 'English';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // a new page closes the menu
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // while the menu is open: the page behind doesn't scroll, Esc closes it, focus goes inside
  useEffect(() => {
    if (!open) return undefined;
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = 'hidden';
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', esc);
    closeRef.current?.focus();
    const burger = burgerRef.current;
    return () => {
      root.style.overflow = before;
      document.removeEventListener('keydown', esc);
      burger?.focus({ preventScroll: true });
    };
  }, [open]);

  const openMenu = () => {
    // the section of the page you are on opens first
    const here = [COMPANY_MENU, PRODUCTS_MENU, RESOURCES_MENU].find((m) => m.label === activeMenu);
    setSection(here ? here.label : null);
    setLangOpen(false);
    setOpen(true);
  };

  const onNavigate = () => {
    setOpen(false);
    window.scrollTo(0, 0);
  };

  const openSearch = () => {
    setOpen(false);
    window.dispatchEvent(new Event('wd:open-search'));
  };

  const handleLogout = async () => {
    try {
      const apiClient = await getApiClient();
      await apiClient.post(`/api/auth/logout`);
    } finally {
      setGlobalState({
        isLoggedIn: false,
        token: null,
        fullName: '',
        companyName: '',
        rnc: '',
        email: '',
        phone: '',
        whatsapp: '',
        country: '',
        countryCode: '',
        address: '',
        port: '',
      });
      localStorage.removeItem('auth_token');
      setOpen(false);
      router.push(`/${lang}/login`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const logo = (light) => (
    <LangLink
      href="/"
      className="wn-logo"
      onClick={onNavigate}
      aria-label={t('navigation.wadiDegla')}
    >
      <img
        src={light ? LOGO_WHITE : LOGO_COLOR}
        alt={t('navigation.wadiDegla')}
        width="112"
        height="32"
      />
    </LangLink>
  );

  return (
    <header className={`wn${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="wn-bar">
        {logo(!scrolled)}

        {/* desktop links */}
        <nav className="wn-desk" aria-label={t('navigation.mainMenu')}>
          <ul>
            {TOP.map((entry) =>
              entry.menu ? (
                <DeskMenu
                  key={entry.menu.label}
                  menu={entry.menu}
                  t={t}
                  active={activeMenu === entry.menu.label}
                  current={current}
                  onNavigate={onNavigate}
                />
              ) : (
                <li className="wn-item" key={entry.href}>
                  <LangLink
                    href={entry.href}
                    onClick={onNavigate}
                    className={`wn-top${activeMenu === entry.label ? ' is-here' : ''}`}
                    aria-current={activeMenu === entry.label ? 'page' : undefined}
                  >
                    {t(entry.label)}
                  </LangLink>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="wn-tools">
          <div className="wn-desk-only wn-search">
            <SearchBar />
          </div>
          <div className="wn-desk-only">
            <LanguageSelector />
          </div>
          <div className="wn-desk-only wn-account">
            {globalState.isLoggedIn ? (
              <div className="wn-account-menu">
                <button type="button" className="wn-icon" aria-label={t('navigation.account')}>
                  <FaUser aria-hidden="true" />
                </button>
                <div className="wn-account-pop">
                  <LangLink href="/my-account" onClick={onNavigate}>
                    {t('navigation.myAccount')}
                  </LangLink>
                  <button type="button" onClick={handleLogout}>
                    {t('navigation.logout')}
                  </button>
                </div>
              </div>
            ) : (
              <LangLink
                href="/login"
                onClick={onNavigate}
                className="wn-icon"
                aria-label={t('navigation.login')}
                title={t('navigation.login')}
              >
                <FaUser aria-hidden="true" />
              </LangLink>
            )}
          </div>

          <div className="wn-phone-only wn-search-mob">
            <SearchBarMobile />
          </div>
          <button
            type="button"
            className="wn-phone-only wn-icon wn-burger"
            ref={burgerRef}
            aria-expanded={open}
            aria-controls="wn-sheet"
            aria-label={t('navigation.openMenu')}
            onClick={openMenu}
          >
            <FaBars aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* phone menu */}
      <div
        id="wn-sheet"
        className="wn-sheet"
        role="dialog"
        aria-modal="true"
        aria-label={t('navigation.mainMenu')}
        aria-hidden={!open}
        inert={open ? undefined : ''}
      >
        <div className="wn-sheet-top">
          {logo(false)}
          <button
            type="button"
            className="wn-icon wn-close"
            ref={closeRef}
            aria-label={t('navigation.closeMenu')}
            onClick={() => setOpen(false)}
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        <div className="wn-sheet-body">
          <button type="button" className="wn-sheet-search" onClick={openSearch}>
            <FaSearch aria-hidden="true" />
            <span>{t('navigation.searchPlaceholder')}</span>
          </button>

          <ul className="wn-acc">
            {TOP.map((entry) => {
              if (!entry.menu) {
                const here = activeMenu === entry.label;
                return (
                  <li key={entry.href}>
                    <LangLink
                      href={entry.href}
                      onClick={onNavigate}
                      className={`wn-row${here ? ' is-here' : ''}`}
                      aria-current={here ? 'page' : undefined}
                    >
                      {t(entry.label)}
                    </LangLink>
                  </li>
                );
              }
              const { menu } = entry;
              const isOpen = section === menu.label;
              const id = `wn-sec-${menu.label.split('.').pop()}`;
              return (
                <li key={menu.label} className={isOpen ? 'is-open' : undefined}>
                  <button
                    type="button"
                    className={`wn-row${activeMenu === menu.label ? ' is-here' : ''}`}
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setSection(isOpen ? null : menu.label)}
                  >
                    {t(menu.label)}
                    <i className="wn-chev" aria-hidden="true" />
                  </button>
                  <div className="wn-sec" id={id}>
                    <div className="wn-sec-in">
                      <MenuLinks
                        menu={menu}
                        t={t}
                        current={current}
                        onNavigate={onNavigate}
                        compact
                        showImg={isOpen}
                      />
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="wn-sheet-foot">
          <button
            type="button"
            className="wn-foot-lang"
            aria-expanded={langOpen}
            onClick={() => setLangOpen((o) => !o)}
          >
            <FaGlobe aria-hidden="true" />
            <span>{currentLangName}</span>
            <i className="wn-chev" aria-hidden="true" />
          </button>
          {globalState.isLoggedIn ? (
            <span className="wn-foot-account">
              <LangLink href="/my-account" onClick={onNavigate}>
                {t('navigation.myAccount')}
              </LangLink>
              <button type="button" onClick={handleLogout}>
                {t('navigation.logout')}
              </button>
            </span>
          ) : (
            <LangLink href="/login" onClick={onNavigate} className="wn-foot-login">
              {t('navigation.login')}
            </LangLink>
          )}
        </div>

        {langOpen && (
          <div className="wn-langs">
            <p className="wn-group-title">{t('navigation.language')}</p>
            <LanguageList onPick={() => setOpen(false)} />
          </div>
        )}
      </div>
    </header>
  );
}
