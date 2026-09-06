import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Storefront crash", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#f7f5f0] px-6 text-center text-zinc-900">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.2em]">Apuuli Enterprises</p>
          <h1 className="font-display text-4xl uppercase">Something went wrong</h1>
          <button
            type="button"
            className="h-12 rounded-full bg-zinc-900 px-6 text-sm font-semibold uppercase tracking-wide text-[#c8f54a] cursor-pointer"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
