import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
        gap: "1.5rem",
      }}
    >
      {/* Big 404 */}
      <div
        style={{
          fontSize: "clamp(80px, 18vw, 160px)",
          fontWeight: 500,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: "var(--muted-foreground, #d1d5db)",
          userSelect: "none",
        }}
      >
        404
      </div>

      {/* Text */}
      <div style={{ maxWidth: 360 }}>
        <h1
          style={{
            fontSize: 22,
            fontWeight: 500,
            margin: "0 0 0.5rem",
            color: "var(--foreground, #111827)",
          }}
        >
          Page not found
        </h1>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.6,
            margin: 0,
            color: "var(--muted-foreground, #6b7280)",
          }}
        >
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          gap: "0.75rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <button
          onClick={() => navigate(-1)}
          style={{
            fontSize: 14,
            padding: "0.5rem 1.25rem",
            borderRadius: 8,
            border: "1px solid var(--border, #e5e7eb)",
            background: "transparent",
            color: "var(--foreground, #111827)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          ← Go back
        </button>
        <button
          onClick={() => navigate("/")}
          style={{
            fontSize: 14,
            padding: "0.5rem 1.25rem",
            borderRadius: 8,
            border: "none",
            background: "var(--foreground, #111827)",
            color: "var(--background, #ffffff)",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          Go to dashboard
        </button>
      </div>
    </div>
  )
}
