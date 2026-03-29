import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";

const STORAGE_KEY = "sara_jwt";

const api = (path, opts = {}) => {
  const base = import.meta.env.VITE_API_URL || "";
  return fetch(`${base}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
  });
};

export function SaraPage() {
  const [token, setToken] = useState(() => sessionStorage.getItem(STORAGE_KEY) || "");
  const [username, setUsername] = useState("SaraValentina");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);

  const loadRows = useCallback(async (t) => {
    setLoading(true);
    setError("");
    try {
      const res = await api("/api/sara/rsvps", {
        headers: { Authorization: `Bearer ${t}` },
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          sessionStorage.removeItem(STORAGE_KEY);
          setToken("");
          setError("Sesión expirada. Vuelve a iniciar sesión.");
          return;
        }
        setError(data.error || "No se pudieron cargar los datos.");
        return;
      }
      setRows(Array.isArray(data.rows) ? data.rows : []);
    } catch {
      setError("Error de red. ¿Está el servidor en marcha?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadRows(token);
  }, [token, loadRows]);

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api("/api/sara/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Credenciales incorrectas.");
        return;
      }
      if (!data.token) {
        setError("Respuesta inválida del servidor.");
        return;
      }
      sessionStorage.setItem(STORAGE_KEY, data.token);
      setToken(data.token);
      setPassword("");
    } catch {
      setError("Error de red.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    setToken("");
    setRows([]);
  };

  if (!token) {
    return (
      <div className="sara-page">
        <div className="sara-card">
          <h1 className="sara-title font-display">Acceso Sara</h1>
          <p className="sara-sub">Panel de respuestas RSVP</p>
          <form onSubmit={login} className="sara-form">
            <label className="sara-label">
              Usuario
              <input
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="sara-input"
              />
            </label>
            <label className="sara-label">
              Contraseña
              <input
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="sara-input"
              />
            </label>
            {error && <p className="sara-error">{error}</p>}
            <button type="submit" className="sara-btn" disabled={loading}>
              {loading ? "Entrando…" : "Entrar"}
            </button>
          </form>
          <Link to="/" className="sara-back">
            ← Volver a la invitación
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sara-page sara-page-wide">
      <header className="sara-toolbar">
        <h1 className="sara-title font-display">Respuestas RSVP</h1>
        <div className="sara-toolbar-actions">
          <button type="button" className="sara-btn-ghost" onClick={() => loadRows(token)} disabled={loading}>
            Actualizar
          </button>
          <button type="button" className="sara-btn-outline" onClick={logout}>
            Salir
          </button>
        </div>
      </header>

      {error && <p className="sara-banner-error">{error}</p>}

      <div className="sara-table-wrap">
        {loading && rows.length === 0 ? (
          <p className="sara-muted">Cargando…</p>
        ) : rows.length === 0 ? (
          <p className="sara-muted">Aún no hay registros.</p>
        ) : (
          <table className="sara-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Fecha</th>
                <th>Invitado principal</th>
                <th>Acompañantes</th>
                <th>Niños (nombres)</th>
                <th>Niños (edades)</th>
                <th>Mensaje</th>
                <th>Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{formatDate(r.created_at)}</td>
                  <td>{formatCell(r.nombre_principal)}</td>
                  <td className="sara-cell-msg">{formatCell(r.acompanantes)}</td>
                  <td className="sara-cell-msg">{formatCell(r.ninos_nombres)}</td>
                  <td>{formatCell(r.ninos_edades)}</td>
                  <td className="sara-cell-msg">{formatCell(r.mensaje)}</td>
                  <td>{formatCell(r.asistencia)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <footer className="sara-footer">
        <Link to="/">← Invitación</Link>
      </footer>
    </div>
  );
}

function formatCell(v) {
  if (v == null || v === "") return "—";
  return String(v);
}

function formatDate(iso) {
  if (iso == null || iso === "") return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return String(iso);
    return d.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" });
  } catch {
    return String(iso);
  }
}
