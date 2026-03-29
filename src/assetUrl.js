/**
 * Añade ?v=... a rutas de public/ para forzar recarga al cambiar vídeo/imagen/audio.
 * En client/.env: VITE_ASSET_VERSION=2 (sube el número cada vez que reemplaces archivos en public/assets).
 */
export function assetUrl(path) {
  const v = import.meta.env.VITE_ASSET_VERSION;
  if (!v) return path;
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}v=${encodeURIComponent(v)}`;
}
