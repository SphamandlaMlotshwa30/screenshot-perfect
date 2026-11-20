import { useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { areasOfInterest, signupSchema } from './domain';

const roleFields: Record<string, string[]> = {
  Student: ['student_no', 'year_of_study'],
  Supervisor: ['staff_no', 'position'],
  Representative: ['org_name', 'sector'],
};

export function DccRegistrationPage() {
  const [allowed, setAllowed] = useState(false);
  const [role, setRole] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [photoName, setPhotoName] = useState('No file chosen');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const password = useRef<HTMLInputElement>(null);
  const confirm = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem('popiaAccepted') !== '1') {
        window.location.replace('/privacy?next=register');
        return;
      }
    } catch {
      // If storage is unavailable, let the member continue without the gate.
    }
    setAllowed(true);
  }, []);

  if (!allowed) return null;

  const syncAreas = (value: string) => {
    setSelected((current) => {
      if (current.includes(value)) return current.filter((area) => area !== value);
      return current.length < 3 ? [...current, value] : current;
    });
  };

  const syncPw = () => {
    const second = confirm.current;
    if (!second || !password.current) return;
    second.setCustomValidity(second.value && password.current.value !== second.value ? 'The two passwords do not match.' : '');
  };

  const shown = (name: string) => (role ? roleFields[role]?.includes(name) ?? false : false);

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
        <form
          className="dcc-sheet"
          id="registerForm"
          onSubmit={async (event) => {
            event.preventDefault();
            setBusy(true);
            setError('');
            setSuccess('');

            const data = new FormData(event.currentTarget);
            const text = (name: string) => String(data.get(name) ?? '').trim();
            const fullname = `${text('first_name')} ${text('surname')}`.trim();
            const memberNumber = text('student_no') || text('staff_no') || text('id_number');
            const requestedRole = role.toLowerCase() as 'student' | 'supervisor' | 'representative';

            const parsed = signupSchema.safeParse({
              fullname,
              member_number: memberNumber,
              email: text('email'),
              password: String(data.get('password') ?? ''),
              confirm: String(data.get('confirm_password') ?? ''),
              requested_role: requestedRole,
            });

            if (!parsed.success) {
              setError(parsed.error.issues[0]?.message ?? 'Please check your details.');
              setBusy(false);
              return;
            }

            try {
              const { fullname: name, member_number, email, password: secret, requested_role } = parsed.data;
              const { error: signUpError } = await supabase.auth.signUp({
                email,
                password: secret,
                options: {
                  emailRedirectTo: window.location.origin,
                  data: {
                    fullname: name,
                    member_number,
                    requested_role,
                    area_of_interest: selected[0] ?? '',
                    title: text('title'),
                    first_name: text('first_name'),
                    surname: text('surname'),
                    id_number: text('id_number'),
                    gender: text('gender'),
                    phone: text('phone'),
                    highest_qualification: text('highest_qualification'),
                    address: text('address'),
                    photo_name: photoName === 'No file chosen' ? null : photoName,
                    year_of_study: text('year_of_study') || null,
                    position: text('position') || null,
                    organisation: text('org_name') || null,
                    sector: text('sector') || null,
                    areas_of_interest: selected,
                  },
                },
              });

              if (signUpError) throw signUpError;
              setSuccess('Check your email to confirm your account. Supervisor and representative requests need administrator approval.');
            } catch (caught) {
              setError(caught instanceof Error ? caught.message : 'Unable to complete registration.');
            } finally {
              setBusy(false);
            }
          }}
        >
          <h1 className="dcc-sheet-title">Personal Details</h1>

          <div className="reg-grid">
            <div className="field">
              <label htmlFor="role">Role</label>
              <select id="role" name="role" required value={role} onChange={(event) => setRole(event.target.value)}>
                <option value="" disabled>Select role</option>
                <option value="Student">Student</option>
                <option value="Representative">Representative</option>
                <option value="Supervisor">Supervisor</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="title">Title</label>
              <select id="title" name="title" required defaultValue="">
                <option value="" disabled>Select title</option>
                <option>Mr</option><option>Ms</option><option>Mrs</option><option>Dr</option><option>Prof</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="first_name">First name</label>
              <input id="first_name" type="text" name="first_name" autoComplete="given-name" required />
            </div>

            <div className="field">
              <label htmlFor="surname">Surname</label>
              <input id="surname" type="text" name="surname" autoComplete="family-name" required />
            </div>

            <div className="field">
              <label htmlFor="id_number">ID number</label>
              <input id="id_number" type="text" name="id_number" inputMode="numeric" pattern="\d{13}" maxLength={13} title="13 digits" required />
            </div>

            <div className="field">
              <label htmlFor="gender">Gender</label>
              <select id="gender" name="gender" required defaultValue="">
                <option value="" disabled>Select gender</option>
                <option>Female</option><option>Male</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="tel" name="phone" autoComplete="tel" required />
            </div>

            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" type="email" name="email" autoComplete="email" required />
            </div>

            <div className="field">
              <label htmlFor="highest_qualification">Highest qualification</label>
              <select id="highest_qualification" name="highest_qualification" required defaultValue="">
                <option value="" disabled>Select qualification</option>
                <option>Grade 12 / Matric</option>
                <option>Higher Certificate</option>
                <option>Diploma</option>
                <option>Bachelor&#39;s degree</option>
                <option>Honours / Postgraduate diploma</option>
                <option>Master&#39;s degree</option>
                <option>Doctorate</option>
                <option>Other</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="address">Physical address</label>
              <input id="address" type="text" name="address" autoComplete="street-address" required />
            </div>

            <div className="field">
              <label htmlFor="photo">Profile photo</label>
              <div className="reg-file">
                <label className="reg-file-btn" htmlFor="photo">Choose File</label>
                <input id="photo" type="file" name="photo" accept="image/*" hidden onChange={(event) => setPhotoName(event.target.files?.[0]?.name ?? 'No file chosen')} />
                <span className="reg-file-name" id="photoName">{photoName}</span>
              </div>
            </div>

            <div className="field field--half">
              <label htmlFor="password">Password</label>
              <input id="password" ref={password} type="password" name="password" minLength={8} autoComplete="new-password" onInput={syncPw} required />
            </div>

            <div className="field field--half">
              <label htmlFor="confirm_password">Confirm password</label>
              <input id="confirm_password" ref={confirm} type="password" name="confirm_password" minLength={8} autoComplete="new-password" onInput={syncPw} required />
            </div>

            <div className="role-block" hidden={!role}>
              <div className="role-inner">
                <div className="field" data-roles="Student" hidden={!shown('student_no')}>
                  <label htmlFor="student_no">Student number</label>
                  <input id="student_no" type="text" name="student_no" maxLength={20} disabled={!shown('student_no')} />
                </div>
                <div className="field" data-roles="Student" hidden={!shown('year_of_study')}>
                  <label htmlFor="year_of_study">Year of study</label>
                  <select id="year_of_study" name="year_of_study" defaultValue="" disabled={!shown('year_of_study')}>
                    <option value="" disabled>Select year</option>
                    <option value="1">Year 1</option><option value="2">Year 2</option><option value="3">Year 3</option>
                    <option value="4">Year 4</option><option value="5">Year 5</option><option value="6">Year 6</option>
                  </select>
                </div>
                <div className="field" data-roles="Supervisor" hidden={!shown('staff_no')}>
                  <label htmlFor="staff_no">Staff number</label>
                  <input id="staff_no" type="text" name="staff_no" maxLength={20} disabled={!shown('staff_no')} />
                </div>
                <div className="field" data-roles="Supervisor" hidden={!shown('position')}>
                  <label htmlFor="position">Position</label>
                  <input id="position" type="text" name="position" maxLength={80} disabled={!shown('position')} />
                </div>
                <div className="field" data-roles="Representative" hidden={!shown('org_name')}>
                  <label htmlFor="org_name">Organisation or community</label>
                  <input id="org_name" type="text" name="org_name" maxLength={160} list="org-list" disabled={!shown('org_name')} />
                  <datalist id="org-list">
                    <option value="BET Media" /><option value="Ubuntu Care Centre" />
                    <option value="Umgeni Community Trust" /><option value="eThekwini Water Services" />
                  </datalist>
                </div>
                <div className="field" data-roles="Representative" hidden={!shown('sector')}>
                  <label htmlFor="sector">Sector</label>
                  <input id="sector" type="text" name="sector" maxLength={80} disabled={!shown('sector')} />
                </div>
              </div>
            </div>
          </div>

          <p className="areas-label" id="areasLabel">Areas of interest (up to 3 &ndash; <span id="areaCount">{selected.length}/3</span>)</p>

          <div className="chips" role="group" aria-labelledby="areasLabel">
            {areasOfInterest.map((area) => (
              <label className="chip" key={area}>
                <input
                  type="checkbox"
                  name="areas"
                  value={area}
                  checked={selected.includes(area)}
                  disabled={selected.length >= 3 && !selected.includes(area)}
                  onChange={() => syncAreas(area)}
                />
                {area}
              </label>
            ))}
          </div>

          {error && <p role="alert" className="dcc-form-message">{error}</p>}
          {success && <p role="status" className="dcc-form-message">{success}</p>}

          <div className="reg-actions">
            <Link className="dcc-btn dcc-btn--ghost" to="/auth">Back</Link>
            <button className="dcc-btn dcc-btn--sky" type="submit" disabled={busy}>{busy ? 'Registering...' : 'Register'}</button>
          </div>
        </form>
      </main>
    </div>
  );
}
