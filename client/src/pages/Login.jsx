import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, ArrowRight } from "lucide-react";
import AuthShell from "./AuthShell";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { await login(form.email, form.password); navigate("/"); }
    catch (err) { setError(err.response?.data?.message || "Unable to sign in."); }
    finally { setBusy(false); }
  }

  return (
    <AuthShell title="WELCOME BACK" subtitle="Sign in to your control center">
      <form className="auth-form" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <label>Email</label>
        <div className="input-wrap"><Mail /><input type="email" required placeholder="operator@example.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})} /></div>
        <label>Password</label>
        <div className="input-wrap"><LockKeyhole /><input type="password" required placeholder="••••••••" value={form.password} onChange={e => setForm({...form,password:e.target.value})} /></div>
        <button className="primary-btn" disabled={busy}>{busy ? "Authenticating..." : <>Enter Command Center <ArrowRight size={18}/></>}</button>
      </form>
      <p className="auth-switch">New operator? <Link to="/register">Create an account</Link></p>
    </AuthShell>
  );
}
