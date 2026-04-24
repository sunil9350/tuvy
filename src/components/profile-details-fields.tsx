import type { UserMeResponse } from "@/lib/user-me-types";

type Me = Extract<UserMeResponse, { authenticated: true }>;

type Props = {
  me: Me;
  name: string;
  setName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  dob: string;
  setDob: (v: string) => void;
  /** Avoid duplicate ids when modal + page could theoretically mount */
  idPrefix?: string;
};

export function ProfileDetailsFields({
  me,
  name,
  setName,
  email,
  setEmail,
  phone,
  setPhone,
  dob,
  setDob,
  idPrefix = "profile",
}: Props) {
  const p = idPrefix;
  return (
    <div className="space-y-3">
      <div>
        <label htmlFor={`${p}-name`} className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
          Name
        </label>
        <input
          id={`${p}-name`}
          className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm"
          value={name}
          onChange={(e) => setName(e.target.value)}
          autoComplete="name"
        />
      </div>
      <div>
        <label htmlFor={`${p}-email`} className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
          Email
        </label>
        <input
          id={`${p}-email`}
          type="email"
          className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm read-only:opacity-80"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          readOnly={me.emailReadOnly}
          autoComplete="email"
        />
        {me.emailReadOnly && (
          <p className="mt-1 text-xs text-muted">This email is from your Google account and can’t be changed here.</p>
        )}
      </div>
      <div>
        <label htmlFor={`${p}-phone`} className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
          {me.profileMode === "auth0" ? "Phone (recommended)" : "Phone number"}
        </label>
        <input
          id={`${p}-phone`}
          type="tel"
          className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm read-only:opacity-80"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          readOnly={me.phoneReadOnly}
          autoComplete="tel"
        />
        {me.phoneReadOnly && (
          <p className="mt-1 text-xs text-muted">This is the number you used to sign in and can’t be changed here.</p>
        )}
      </div>
      <div>
        <label htmlFor={`${p}-dob`} className="mb-1 block text-xs font-bold uppercase tracking-wide text-muted">
          Date of birth
        </label>
        <input
          id={`${p}-dob`}
          type="date"
          className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-sm"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
        />
      </div>
    </div>
  );
}
