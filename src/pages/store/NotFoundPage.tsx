import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-sm font-semibold uppercase tracking-[0.22em] text-muted-foreground">
        404
      </p>
      <h1 className="mt-3 text-5xl">Page not found</h1>
      <p className="mt-4 max-w-md text-muted-foreground">
        That pair is not on this aisle. Head back to the shop floor.
      </p>
      <Link
        to="/shop"
        className="mt-8 inline-flex h-12 items-center rounded-full bg-primary px-6 font-display text-sm font-semibold uppercase tracking-[0.16em] text-primary-foreground cursor-pointer"
      >
        Shop Apuuli
      </Link>
    </div>
  );
}
