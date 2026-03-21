import { OnboardingForm } from "@/components/onboarding/OnboardingForm";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-neutral-900 dark:to-neutral-950 p-6">
      <div className="max-w-2xl w-full">
         <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 mb-2">
              Welcome to TeamForge AI
            </h1>
            <p className="text-neutral-500 dark:text-neutral-400">
              Let's set up your profile to personalize your AI experience.
            </p>
         </div>
         <OnboardingForm />
      </div>
    </div>
  );
}