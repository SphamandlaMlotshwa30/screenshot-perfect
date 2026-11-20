import { useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';

const statements = [
  'I have read and understood the Privacy Notice, which explains how my personal information is collected, used and protected in terms of the Protection of Personal Information Act (POPIA).',
  'I consent to the collection, processing and storage of my personal information for the purpose of registering and managing my membership.',
  'I confirm that the information I provide is true, accurate and complete, and I understand I may access, correct or request deletion of my information at any time.',
] as const;

export function DccConsentPage({ next }: { next: string | null }) {
  const [checked, setChecked] = useState<boolean[]>(() => statements.map(() => false));
  const [showNote, setShowNote] = useState(false);
  const boxes = useRef<Array<HTMLInputElement | null>>([]);

  const sync = (index: number) => {
    setChecked((current) => {
      const updated = current.map((value, position) => (position === index ? !value : value));
      if (updated.every(Boolean)) setShowNote(false);
      return updated;
    });
  };

  return (
    <div className="dcc-sheet-page">
      <header className="dcc-navbar dcc-navbar--sheet">
        <Link to="/" className="dcc-brand-text">Membership Registration</Link>
        <nav className="dcc-nav-actions" aria-label="Main navigation">
          <Link to="/">Home</Link>
          <Link to="/auth">Log in</Link>
        </nav>
      </header>

      <main className="dcc-sheet-wrap">
        <section className="dcc-sheet dcc-sheet--narrow" aria-labelledby="consentTitle">
          <h1 className="dcc-sheet-title dcc-sheet-title--lg" id="consentTitle">Consent</h1>

          <form
            className="dcc-consent"
            id="popiaForm"
            noValidate
            onSubmit={(event) => {
              event.preventDefault();
              const missing = checked.findIndex((value) => !value);
              if (missing !== -1) {
                setShowNote(true);
                boxes.current[missing]?.focus();
                return;
              }
              try {
                localStorage.setItem('popiaAccepted', '1');
              } catch {
                // Consent still allows this browser session to continue.
              }
              window.location.href = next === 'login' ? '/auth' : '/register';
            }}
          >
            {statements.map((statement, index) => (
              <label className={`dcc-check${showNote && !checked[index] ? ' is-missing' : ''}`} key={statement}>
                <input
                  type="checkbox"
                  className="popia-check"
                  checked={checked[index]}
                  ref={(element) => { boxes.current[index] = element; }}
                  onChange={() => sync(index)}
                />
                <span className="dcc-check-box" aria-hidden="true" />
                <span>{statement}</span>
              </label>
            ))}

            <button type="submit" className="dcc-btn dcc-btn--soft dcc-btn--block dcc-consent-submit" id="accept">Continue</button>
            <p className="dcc-consent-note" id="consentNote" role="alert" hidden={!showNote}>Please accept all three statements to continue.</p>

            <p className="dcc-sheet-foot">Already registered? <Link to="/auth">Log in</Link></p>
          </form>
        </section>
      </main>
    </div>
  );
}
