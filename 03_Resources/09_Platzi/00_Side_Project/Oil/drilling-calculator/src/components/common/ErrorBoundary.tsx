import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            minHeight: "200px",
            padding: "2rem",
            background: "rgba(255, 59, 48, 0.05)",
            backdropFilter: "blur(10px)",
            borderRadius: "16px",
            border: "1px solid rgba(255, 59, 48, 0.2)",
            color: "rgba(255, 255, 255, 0.9)",
            fontFamily: "Inter, system-ui, sans-serif",
            textAlign: "center",
          }}
        >
          <AlertTriangle
            size={32}
            style={{ color: "#ff3b30", marginBottom: "1rem" }}
          />
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>
            Algo salió mal
          </h3>
          <p
            style={{
              margin: "0 0 1.5rem 0",
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.6)",
              maxWidth: "300px",
            }}
          >
            Ha ocurrido un error en este componente.
          </p>

          {this.state.error && (
            <pre
              style={{
                background: "rgba(0, 0, 0, 0.2)",
                padding: "0.75rem",
                borderRadius: "8px",
                fontSize: "0.75rem",
                color: "#ff3b30",
                maxWidth: "100%",
                overflow: "auto",
                marginBottom: "1.5rem",
                textAlign: "left",
              }}
            >
              {this.state.error.message}
            </pre>
          )}

          <button
            onClick={() => window.location.reload()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              background: "rgba(255, 255, 255, 0.1)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)")
            }
          >
            <RefreshCw size={14} />
            Recargar Aplicación
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
