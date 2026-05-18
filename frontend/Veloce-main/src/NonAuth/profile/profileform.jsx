import { useContext, useState } from "react";
import { Loader2, Phone, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import { api } from "../../service/api";
import { Authcontext } from "../../Context/Authcontext";

const ProfileForm = ({ user, setEdit }) => {
  const { setuser } = useContext(Authcontext);
  const [form, setForm] = useState({
    username: user?.username || "",
    phone_number: user?.phone_number || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setForm((previousForm) => ({
      ...previousForm,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.username.trim()) {
      toast.error("Username is required");
      return;
    }

    setLoading(true);

    try {
      const res = await api.patch("profileupdate/", {
        username: form.username.trim(),
        phone_number: form.phone_number.trim(),
      });

      setuser(res.data);
      setEdit(false);
      toast.success("Profile updated");
    } catch (err) {
      console.log(err);
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500"
        >
          Username
        </label>
        <div className="relative mt-1">
          <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 outline-none transition-all focus:border-zinc-400 focus:bg-white"
            placeholder="Enter username"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phone_number"
          className="text-xs font-semibold uppercase tracking-[0.14em] text-zinc-500"
        >
          Phone Number
        </label>
        <div className="relative mt-1">
          <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
          <input
            id="phone_number"
            name="phone_number"
            value={form.phone_number}
            onChange={handleChange}
            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm text-zinc-900 outline-none transition-all focus:border-zinc-400 focus:bg-white"
            placeholder="Enter phone number"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Save Changes
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => setEdit(false)}
          className="rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;
