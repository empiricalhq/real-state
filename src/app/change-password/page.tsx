import type { Metadata } from "next";

import Toaster from "@/components/shared/Toaster";
import { requireStaff } from "@/lib/dal";

import ChangePasswordForm from "./ChangePasswordForm";

export const metadata: Metadata = {
  title: "Change Password | Homely",
};

export default async function ChangePasswordPage() {
  const { user } = await requireStaff({ allowPasswordChange: true });

  return (
    <section className="pt-44">
      <div className="shadow-auth dark:shadow-dark-auth container mx-auto max-w-540 rounded-2xl p-16 py-8">
        <h1 className="text-dark mb-2 text-center text-3xl font-semibold dark:text-white">
          Change your password
        </h1>
        {user.mustChangePassword && (
          <p className="text-dark/70 mb-8 text-center text-base dark:text-white/70">
            You signed in with a temporary password. Choose a new one to continue.
          </p>
        )}
        <ChangePasswordForm />
      </div>
      <Toaster />
    </section>
  );
}
