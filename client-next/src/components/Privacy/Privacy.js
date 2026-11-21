// Privacy & cookies page (server component: the text is in the HTML and never in the browser
// bundles). Texts in privacyTexts.js.
import { PRIVACY, PRIVACY_UPDATED } from './privacyTexts';
import { COMPANY } from '../../util/company';
import './PrivacyPage.css';

export default function Privacy({ lang }) {
  const x = PRIVACY[lang] || PRIVACY.en;
  const dir = PRIVACY[lang] ? undefined : 'ltr';
  const date = new Intl.DateTimeFormat(PRIVACY[lang] ? lang : 'en', { dateStyle: 'long' }).format(
    new Date(PRIVACY_UPDATED),
  );
  const fill = (s) => s.split('{email}');
  return (
    <div className="pv" dir={dir}>
      <div className="pv-wrap">
        <h1>{x.title}</h1>
        <p className="pv-lead">{x.intro}</p>
        <p className="pv-date">
          {x.updated}: {date}
        </p>
        {x.sections.map((sec) => (
          <section key={sec.h}>
            <h2>{sec.h}</h2>
            {sec.p.map((para) => {
              const [before, after] = fill(para);
              return (
                <p key={para.slice(0, 40)}>
                  {before}
                  {after !== undefined && (
                    <>
                      <a href={`mailto:${COMPANY.emailInfo}`}>{COMPANY.emailInfo}</a>
                      {after}
                    </>
                  )}
                </p>
              );
            })}
          </section>
        ))}
      </div>
    </div>
  );
}
