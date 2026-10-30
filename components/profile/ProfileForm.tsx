"use client";

import { useState, useActionState } from "react";
import {
  MapPin,
  Phone,
  User,
  Mail,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Save,
  Lock,
} from "lucide-react";
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
    emailVerified: boolean;
    phone: string;
    wilaya: string;
    city: string;
  };
}

const initialState: ProfileState = { status: null };

const baseInputClasses =
  "w-full rounded-lg border bg-slate-950/70 px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none transition duration-150";

const defaultBorderClasses =
  "border-slate-700/80 hover:border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const errorBorderClasses =
  "border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

export default function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    updateProfile,
    initialState
  );

  // Controlled form values initialized from props
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [wilaya, setWilaya] = useState(user.wilaya);
  const [city, setCity] = useState(user.city);

  const [clientErrors, setClientErrors] = useState<ProfileFieldErrors>({});
  const [editedFields, setEditedFields] = useState<Set<keyof ProfileInput>>(
    new Set()
  );
  const [dismissNotice, setDismissNotice] = useState(false);

  const isDirty =
    name !== user.name ||
    phone !== user.phone ||
    wilaya !== user.wilaya ||
    city !== user.city;

  // Resolve field error: client errors take precedence, followed by active server errors
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

  const handleFieldChange =
    (field: keyof ProfileInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const val = e.target.value;
      if (field === "name") setName(val);
      if (field === "phone") setPhone(val);
      if (field === "wilaya") setWilaya(val);
      if (field === "city") setCity(val);

      setClientErrors((prev) => {
        if (!(field in prev)) return prev;
        const next = { ...prev };
        delete next[field];
        return next;
      });
      setEditedFields((prev) => new Set(prev).add(field));
    };

  const handleReset = () => {
    setName(user.name);
    setPhone(user.phone);
    setWilaya(user.wilaya);
    setCity(user.city);
    setClientErrors({});
    setEditedFields(new Set());
    setDismissNotice(false);
  };

  const handleSubmit = () => {
    setEditedFields(new Set());
    setDismissNotice(false);
  };

  const hasBlockingErrors = Object.keys(clientErrors).length > 0;

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-8 backdrop-blur-sm">
      <form action={formAction} onSubmit={handleSubmit} className="space-y-8">
        {/* Global Notifications */}
        {!dismissNotice && state.status === "error" && state.message && (
          <div
            role="alert"
            className="flex items-start justify-between gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="font-semibold text-red-200">Unable to save profile</p>
                <p className="mt-0.5 text-xs text-red-300/90">{state.message}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDismissNotice(true)}
              className="text-xs text-red-400 hover:text-red-200 transition-colors"
              aria-label="Dismiss alert"
            >
              ✕
            </button>
          </div>
        )}

        {!dismissNotice && state.status === "success" && state.message && (
          <div
            role="status"
            className="flex items-start justify-between gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-300"
          >
            <div className="flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-200">Profile Updated</p>
                <p className="mt-0.5 text-xs text-emerald-300/90">
                  {state.message}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setDismissNotice(true)}
              className="text-xs text-emerald-400 hover:text-emerald-200 transition-colors"
              aria-label="Dismiss message"
            >
              ✕
            </button>
          </div>
        )}

        {/* Section 1: Personal Information */}
        <section aria-labelledby="personal-info-heading">
          <div className="border-b border-slate-800 pb-3">
            <h2
              id="personal-info-heading"
              className="text-base font-semibold text-white tracking-tight"
            >
              Personal Information
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Your primary customer identity for orders, invoices, and communication.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {/* Full Name */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="name"
                  className="flex items-center gap-1.5 text-xs font-medium text-slate-200"
                >
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  Full name <span className="text-blue-400">*</span>
                </label>
              </div>
              <input
                id="name"
                name="name"
                type="text"
                value={name}
                required
                autoComplete="name"
                onBlur={handleBlur("name")}
                onChange={handleFieldChange("name")}
                aria-invalid={Boolean(fieldError("name"))}
                aria-describedby={fieldError("name") ? "name-error" : "name-desc"}
                className={`${baseInputClasses} ${
                  fieldError("name") ? errorBorderClasses : defaultBorderClasses
                }`}
                placeholder="e.g. Amina Benali"
              />
              {fieldError("name") ? (
                <p id="name-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {fieldError("name")}
                </p>
              ) : (
                <p id="name-desc" className="mt-1 text-[11px] text-slate-500">
                  Appears on invoices and delivery package labels.
                </p>
              )}
            </div>

            {/* Account Email (Protected Identity Credential) */}
            <div className="rounded-lg border border-slate-800/90 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-300">
                    Account Email
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Lock className="h-3 w-3 text-slate-500" />
                  <span>Protected</span>
                </div>
              </div>
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="font-mono text-sm text-slate-200">
                  {user.email}
                </span>
                <span
                  className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium border w-fit ${
                    user.emailVerified
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                      : "border-amber-500/30 bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {user.emailVerified ? "Verified Email" : "Pending Verification"}
                </span>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
                To update your primary login credentials or security email, please
                reach out to ModernStore customer support.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Default Shipping & Delivery Address */}
        <section aria-labelledby="delivery-info-heading">
          <div className="border-b border-slate-800 pb-3">
            <h2
              id="delivery-info-heading"
              className="text-base font-semibold text-white tracking-tight"
            >
              Default Delivery Address
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Pre-filled during checkout for swift order fulfillment across Algeria.
            </p>
          </div>

          <div className="mt-6 space-y-5">
            {/* Wilaya & City Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Wilaya Selection */}
              <div>
                <label
                  htmlFor="wilaya"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-200"
                >
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  Wilaya (Province)
                </label>
                <select
                  id="wilaya"
                  name="wilaya"
                  value={wilaya}
                  onBlur={handleBlur("wilaya")}
                  onChange={handleFieldChange("wilaya")}
                  aria-invalid={Boolean(fieldError("wilaya"))}
                  aria-describedby={
                    fieldError("wilaya") ? "wilaya-error" : "wilaya-desc"
                  }
                  className={`${baseInputClasses} ${
                    fieldError("wilaya") ? errorBorderClasses : defaultBorderClasses
                  } cursor-pointer`}
                >
                  <option value="" className="bg-slate-900 text-slate-400">
                    Select a wilaya...
                  </option>
                  {WILAYAS.map((item) => (
                    <option
                      key={item.code}
                      value={item.code}
                      className="bg-slate-900 text-white"
                    >
                      {item.code} — {item.name}
                    </option>
                  ))}
                </select>
                {fieldError("wilaya") ? (
                  <p id="wilaya-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {fieldError("wilaya")}
                  </p>
                ) : (
                  <p id="wilaya-desc" className="mt-1 text-[11px] text-slate-500">
                    Determines local courier routing and fees.
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label
                  htmlFor="city"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-200"
                >
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  City / Municipality
                </label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={city}
                  placeholder="e.g. Bab Ezzouar, Hydra"
                  autoComplete="address-level2"
                  onBlur={handleBlur("city")}
                  onChange={handleFieldChange("city")}
                  aria-invalid={Boolean(fieldError("city"))}
                  aria-describedby={
                    fieldError("city") ? "city-error" : "city-desc"
                  }
                  className={`${baseInputClasses} ${
                    fieldError("city") ? errorBorderClasses : defaultBorderClasses
                  }`}
                />
                {fieldError("city") ? (
                  <p id="city-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                    <AlertCircle className="h-3.5 w-3.5" />
                    {fieldError("city")}
                  </p>
                ) : (
                  <p id="city-desc" className="mt-1 text-[11px] text-slate-500">
                    Specific commune or postal locality.
                  </p>
                )}
              </div>
            </div>

            {/* Delivery Phone Number */}
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-200"
              >
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                Delivery Contact Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={phone}
                placeholder="0555123456"
                autoComplete="tel"
                onBlur={handleBlur("phone")}
                onChange={handleFieldChange("phone")}
                aria-invalid={Boolean(fieldError("phone"))}
                aria-describedby={
                  fieldError("phone") ? "phone-error" : "phone-desc"
                }
                className={`${baseInputClasses} ${
                  fieldError("phone") ? errorBorderClasses : defaultBorderClasses
                }`}
              />
              {fieldError("phone") ? (
                <p id="phone-error" className="mt-1.5 flex items-center gap-1 text-xs text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" />
                  {fieldError("phone")}
                </p>
              ) : (
                <p id="phone-desc" className="mt-1 text-[11px] text-slate-500">
                  Algerian phone (05, 06, 07 or +213). Delivery drivers call this number before arrival.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Action Controls & Feedback */}
        <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-4 pt-6 border-t border-slate-800">
          <div className="text-xs">
            {isDirty ? (
              <span className="flex items-center gap-2 text-amber-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                You have unsaved changes
              </span>
            ) : (
              <span className="text-slate-500">All profile details are up to date.</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={!isDirty || isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-medium text-slate-300 transition-colors hover:border-slate-700 hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Discard
            </button>

            <button
              type="submit"
              disabled={isPending || !isDirty || hasBlockingErrors}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2 text-xs font-semibold text-white shadow-sm shadow-blue-500/20 transition-all hover:bg-blue-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isPending ? (
                <>
                  <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
