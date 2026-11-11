'use client';
// The four stations of the signup, drawn as the trip of an order: quarry block -> company ->
// stones -> port. `step` is 0-3; stations before it are done.
import { useTranslation } from 'react-i18next';
import { FaRegUser, FaRegBuilding, FaAnchor } from 'react-icons/fa';
import { GiStoneBlock } from 'react-icons/gi';

export const STEPS = [
  ['stepAccount', FaRegUser],
  ['stepCompany', FaRegBuilding],
  ['stepStones', GiStoneBlock],
  ['stepPort', FaAnchor],
];

export default function Journey({ step }) {
  const { t } = useTranslation();
  return (
    <ol className="au-journey" style={{ '--au-progress': step / (STEPS.length - 1) }}>
      {STEPS.map(([key, Icon], i) => (
        <li
          key={key}
          className={i < step ? 'is-done' : i === step ? 'is-now' : ''}
          aria-current={i === step ? 'step' : undefined}
        >
          <span className="au-journey-ic" aria-hidden="true">
            <Icon />
          </span>
          {t(`auth.${key}`)}
        </li>
      ))}
    </ol>
  );
}
