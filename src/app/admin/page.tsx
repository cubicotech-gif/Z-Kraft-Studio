import { Suspense } from "react";
import { isAdmin } from "@/lib/admin-auth";
import { loadGallery } from "@/lib/gallery-data";
import { loadFeedbackAdmin } from "@/lib/feedback-data";
import { FeedbackAdmin } from "@/components/admin/feedback-admin";
import { LoginForm } from "@/components/admin/login-form";
import { AdminManager } from "@/components/admin/admin-manager";

async function Gate() {
  if (!(await isAdmin())) return <LoginForm />;
  const [gallery, feedback] = await Promise.all([loadGallery(), loadFeedbackAdmin()]);
  return (
    <>
      <AdminManager gallery={gallery} />
      <h2 className="mt-16 border-t border-void-700 pt-10 font-display text-3xl font-extrabold tracking-tight">Feedback &amp; Discord</h2>
      <div className="mt-6">
        <FeedbackAdmin reviews={feedback.reviews} discord={feedback.discord} />
      </div>
    </>
  );
}

export default function AdminPage() {
  return (
    <main className="px-4 pb-24 pt-24 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <p className="font-hud text-xs font-semibold tracking-[0.3em] text-neon-lime">ADMIN</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Portfolio manager</h1>
        <Suspense fallback={<div className="mt-8 h-64 border border-void-700 bg-void-900" aria-hidden />}>
          <Gate />
        </Suspense>
      </div>
    </main>
  );
}
