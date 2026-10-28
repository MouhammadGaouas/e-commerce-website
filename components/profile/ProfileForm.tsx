"use client";

import { useState, useActionState } from "react";
import { MapPin, Phone, User, Mail, CheckCircle2 } from "lucide-react";
import { updateProfile, type ProfileState } from "@/app/profile/actions";
import {
  validateProfileField,
  type ProfileFieldErrors,
  type ProfileInput,
} from "@/lib/validation/profile";
import { WILAYAS } from "@/lib/wilayas";

interface ProfileFormProps {
  user: {
    name: string;
    email: string;
    phone: string;
    wilaya: string;
    city: string;
  };
}

const initialState: ProfileState = { status: null };

const inputClasses =
  "w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const errorInputClasses =
  "w-full rounded-lg border border-red-500 bg-slate-800 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  const first = parts[0] ?? "";
  const second = parts[1] ?? "";
  return `${first.charAt(0)}${second.charAt(0)}`.toUpperCase();
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState
  );
  const [clientErrors, setClientErrors] = useState<ProfileFieldErrors>({});
  const [editedFields, setEditedFields] = useState<
    Set<keyof ProfileInput>
  >(new Set());

  // Server field errors are authoritative until the user edits that field
  // again — editing marks it "edited", which hides the stale server error.
  const fieldError = (field: keyof ProfileInput): string | undefined =>
    clientErrors[field] ??
    (editedFields.has(field) ? undefined : state.errors?.[field]);

  const handleBlur =
    (field: keyof ProfileInput) =>
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const message = validateProfileField(field, e.target.value.trim());
      setClientErrors((prev) => {
        const next = { ...prev };
        if (message) {
          next[field] = message;
        } else {
          delete next[field];
        }
        return next;
      });
    };

  const handleChange = (field: keyof ProfileInput) => () => {
    setClientErrors((prev) => {
      if (!(field in prev)) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
    setEditedFields((prev) => new Set(prev).add(field));
  };

  // Each submit starts a fresh server round-trip: show its errors again.
  const handleSubmit = () => {
    setEditedFields(new Set());
  };

  return (
    <form action={formAction} onSubmit={handleSubmit} className="space-y-6">
      {state.status === "error" && state.message && (
        <div
          role="alert"
          className="rounded-lg bg-red-500/10 border border-red-500/50 p-3 text-sm text-red-400"
        >
          {state.message}
        </div>
      )}

      {state.status === "success" && state.message && (
        <div className="flex items-center gap-2 rounded-lg bg-green-500/10 border border-green-500/50 p-3 text-sm text-green-400">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          {state.message}
        </div>
      )}

      {/* Identity */}
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-lg font-bold text-slate-100">
          {getInitials(user.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate text-lg font-semibold text-white">{user.name}</p>
          <p className="mt-0.5 truncate text-sm text-slate-400">{user.email}</p>
        </div>
      </div>

      {/* Personal information */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Personal information
        </h2>
        <div className="mt-5 space-y-5">
          {/* Full name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200"
            >
              <User className="h-4 w-4 text-slate-400" />
              Full name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              defaultValue={user.name}
              required
              autoComplete="name"
              onBlur={handleBlur("name")}
              onChange={handleChange("name")}
              aria-invalid={Boolean(fieldError("name"))}
              className={fieldError("name") ? errorInputClasses : inputClasses}
            />
            {fieldError("name") && (
              <p className="mt-1.5 text-xs text-red-400">{fieldError("name")}</p>
            )}
          </div>

          {/* Email (read-only) */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200"
            >
              <Mail className="h-4 w-4 text-slate-400" />
              Email
            </label>
            <input
              id="email"
              type="email"
              value={user.email}
              disabled
              autoComplete="email"
              className={`${inputClasses} cursor-not-allowed opacity-60`}
            />
            <p className="mt-1.5 text-xs text-slate-500">
              Email cannot be changed here.
            </p>
          </div>
        </div>
      </section>

      <div className="h-px bg-slate-800" />

      {/* Delivery information */}
      <section>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Delivery information
        </h2>
        <div className="mt-5 space-y-5">
          {/* Wilaya */}
          <div>
            <label
              htmlFor="wilaya"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200"
            >
              <MapPin className="h-4 w-4 text-slate-400" />
              Wilaya
            </label>
            <select
              id="wilaya"
              name="wilaya"
              defaultValue={user.wilaya}
              onBlur={handleBlur("wilaya")}
              onChange={handleChange("wilaya")}
              aria-invalid={Boolean(fieldError("wilaya"))}
              className={fieldError("wilaya") ? errorInputClasses : inputClasses}
            >
              <option value="">Select a wilaya</option>
              {WILAYAS.map((wilaya) => (
                <option key={wilaya.code} value={wilaya.code}>
                  {wilaya.code} — {wilaya.name}
                </option>
              ))}
            </select>
            {fieldError("wilaya") && (
              <p className="mt-1.5 text-xs text-red-400">{fieldError("wilaya")}</p>
            )}
          </div>

          {/* City */}
          <div>
            <label
              htmlFor="city"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200"
            >
              <MapPin className="h-4 w-4 text-slate-400" />
              City
            </label>
            <input
              id="city"
              name="city"
              type="text"
              defaultValue={user.city}
              placeholder="e.g. Bab Ezzouar"
              autoComplete="address-level2"
              onBlur={handleBlur("city")}
              onChange={handleChange("city")}
              aria-invalid={Boolean(fieldError("city"))}
              className={fieldError("city") ? errorInputClasses : inputClasses}
            />
            {fieldError("city") && (
              <p className="mt-1.5 text-xs text-red-400">{fieldError("city")}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-200"
            >
              <Phone className="h-4 w-4 text-slate-400" />
              Phone number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={user.phone}
              placeholder="0555123456"
              autoComplete="tel"
              onBlur={handleBlur("phone")}
              onChange={handleChange("phone")}
              aria-invalid={Boolean(fieldError("phone"))}
              className={fieldError("phone") ? errorInputClasses : inputClasses}
            />
            {fieldError("phone") && (
              <p className="mt-1.5 text-xs text-red-400">{fieldError("phone")}</p>
            )}
          </div>
        </div>
      </section>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
