import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, UserRound, ArrowRight } from "lucide-react";
import AuthShell from "./AuthShell";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name:"", email:"", password:"" });
  const [error, setError] = useState(""); const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault(); setError(""); setBusy(true);
    try { await register(form.name, form.email, form.password); navigate("/"); }
    catch (err) { setError(err.response?.data?.message || "Registration failed."); }
    finally { setBusy(false); }
  }

  return (
    <AuthShell title="NEW OPERATOR" subtitle="Create your control account">
      <form className="auth-form" onSubmit={submit}>
        {error && <div className="form-error">{error}</div>}
        <label>Full name</label>
        <div className="input-wrap"><UserRound /><input required placeholder="Your name" value={form.name} onChange={e => setForm({...form,name:e.target.value})}/></div>
        <label>Email</label>
        <div className="input-wrap"><Mail /><input type="email" required placeholder="operator@example.com" value={form.email} onChange={e => setForm({...form,email:e.target.value})}/></div>
        <label>Password</label>
        <div className="input-wrap"><LockKeyhole /><input type="password" minLength="6" required placeholder="Minimum 6 characters" value={form.password} onChange={e => setForm({...form,password:e.target.value})}/></div>
        <button className="primary-btn" disabled={busy}>{busy ? "Creating..." : <>Create Account <ArrowRight size={18}/></>}</button>
      </form>
      <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
    </AuthShell>
  );
}
