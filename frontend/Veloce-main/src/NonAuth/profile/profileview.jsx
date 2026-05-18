import { useEffect, useState } from "react";
import { Mail, PencilLine, Phone, UserRound, X } from "lucide-react";
import ProfileForm from "./profileform";

const ProfileModal = ({ open, onClose, user }) => {
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (!open) {
      setEdit(false);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setEdit(false);
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const handleClose = () => {
    setEdit(false);
    onClose();
  };

  const profileRows = [
    {
      label: "Name",
      value: user?.username || "Not added yet",
      icon: UserRound,
    },
    {
      label: "Email",
      value: user?.email || "Not added yet",
      icon: Mail,
    },
    {
      label: "Phone",
      value: user?.phone_number || "Not added yet",
      icon: Phone,
    },
  ];

  const profileInitial = (user?.username || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <button
        type="button"
        onClick={handleClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label="Close profile modal"
      />

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-2xl">
        <div className="relative overflow-hidden bg-gradient-to-r from-zinc-900 via-zinc-800 to-red-800 px-5 pb-8 pt-5 text-white">
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 rounded-full bg-white/15 p-1.5 text-white transition-colors hover:bg-white/25"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">
            My Account
          </p>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-lg font-bold uppercase ring-1 ring-white/30">
              {profileInitial}
            </div>
            <div>
              <h2 className="text-2xl font-bold leading-tight">My Profile</h2>
              <p className="text-sm text-zinc-200">
                Manage your account details.
              </p>
            </div>
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="-mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm">
            {!edit ? (
              <>
                <div className="space-y-2.5">
                  {profileRows.map((row) => {
                    const Icon = row.icon;

                    return (
                      <div
                        key={row.label}
                        className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5"
                      >
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-zinc-700 ring-1 ring-zinc-200">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
                            {row.label}
                          </p>
                          <p className="truncate text-sm font-semibold text-zinc-900">
                            {row.value}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    onClick={() => setEdit(true)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black"
                  >
                    <PencilLine className="h-4 w-4" />
                    Edit Profile
                  </button>

                  <button
                    onClick={handleClose}
                    className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100"
                  >
                    Close
                  </button>
                </div>
              </>
            ) : (
              <ProfileForm user={user} setEdit={setEdit} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
