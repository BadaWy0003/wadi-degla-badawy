'use client';
// Header icon for the quote list: only shown once a stone has been added (the count comes from
// this browser, so it is never in the HTML built for Google).
import { useTranslation } from 'react-i18next';
import { FaClipboardList } from 'react-icons/fa';
import LangLink from '../LangLink';
import { useQuoteList } from '../../util/quote-list';

export default function QuoteLink({ onNavigate }) {
  const { t } = useTranslation();
  const [list] = useQuoteList();
  if (!list.length) return null;
  return (
    <LangLink
      href="/quote"
      onClick={onNavigate}
      className="wn-icon wn-quote"
      aria-label={`${t('quote.heading')} (${list.length})`}
      title={t('quote.heading')}
    >
      <FaClipboardList aria-hidden="true" />
      <span className="wn-quote-count" aria-hidden="true">
        {list.length}
      </span>
    </LangLink>
  );
}
