'use client';
// "Add to quote list" on the stone page: saves this stone + the finish shown, then turns into
// a link to the quote page (/quote) with the number of stones in the list.
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FaCheck, FaPlus } from 'react-icons/fa';
import LangLink from '../LangLink';
import { addToQuote, useQuoteList } from '../../util/quote-list';
import { trackEvent } from '../../util/analytics';

export default function AddToQuote({ name, slug, finish, finishes, photo, sizes, slabs, thicknesses }) {
  const { t } = useTranslation();
  const [list, ready] = useQuoteList();
  const [full, setFull] = useState(false);
  const inList = ready && list.some((i) => i.slug === slug && i.finish === (finish || ''));

  if (inList) {
    return (
      <div className="qt-added" role="status">
        <span>
          <FaCheck aria-hidden="true" /> {t('quote.added')}
        </span>
        <LangLink href="/quote" className="qt-added-link">
          {t('quote.viewList')} ({list.length}) <span className="qt-arrow" aria-hidden="true">→</span>
        </LangLink>
      </div>
    );
  }
  return (
    <>
      <button
        type="button"
        className="spd-btn spd-btn-line qt-add"
        onClick={() => {
          const ok = addToQuote({ name, slug, finish: finish || '', finishes, photo, sizes, slabs, thicknesses });
          setFull(!ok);
          if (ok) trackEvent('quote_list_add', { product_name: name, finish: finish || '' });
        }}
      >
        <FaPlus aria-hidden="true" /> {t('quote.add')}
      </button>
      {full && <p className="qt-full">{t('quote.full')}</p>}
    </>
  );
}
