import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <p className="text-8xl font-bold text-brand-100 mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Page introuvable
        </h1>
        <p className="text-slate-500 mb-8">
          La page que vous recherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link href="/fr" className="btn-primary">
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
