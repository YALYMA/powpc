'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input, Label, FieldError } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { loginAction, registerAction, requestPasswordResetAction, resetPasswordAction } from '@/actions/auth.actions';

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    startTransition(async () => {
      const result = await loginAction(payload);
      if (!result.ok) {
        setError(result.error ?? 'Erreur');
        return;
      }
      router.push(params.get('next') ?? '/compte');
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>
      <div>
        <Label htmlFor="password">Mot de passe</Label>
        <Input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>

      <p className="-mt-2 text-right text-sm">
        <Link href="/mot-de-passe-oublie" className="text-slate-500 hover:text-brand-600">
          Mot de passe oublie ?
        </Link>
      </p>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Connexion...' : 'Se connecter'}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Pas encore de compte ?{' '}
        <Link href="/inscription" className="font-medium text-brand-600 hover:underline">
          Creer un compte
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    startTransition(async () => {
      const result = await registerAction(payload);
      if (!result.ok) {
        setError(result.error ?? 'Erreur');
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        return;
      }
      router.push('/compte');
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="firstName">Prenom</Label>
          <Input id="firstName" name="firstName" required />
          <FieldError message={fieldErrors.firstName?.[0]} />
        </div>
        <div>
          <Label htmlFor="lastName">Nom</Label>
          <Input id="lastName" name="lastName" required />
          <FieldError message={fieldErrors.lastName?.[0]} />
        </div>
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
        <FieldError message={fieldErrors.email?.[0]} />
      </div>
      <div>
        <Label htmlFor="phone">Telephone</Label>
        <Input id="phone" name="phone" placeholder="77 000 00 00" required />
        <FieldError message={fieldErrors.phone?.[0]} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="password">Mot de passe</Label>
          <Input id="password" name="password" type="password" autoComplete="new-password" required />
          <FieldError message={fieldErrors.password?.[0]} />
        </div>
        <div>
          <Label htmlFor="confirmPassword">Confirmation</Label>
          <Input id="confirmPassword" name="confirmPassword" type="password" required />
          <FieldError message={fieldErrors.confirmPassword?.[0]} />
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Creation...' : 'Creer mon compte'}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Deja inscrit ?{' '}
        <Link href="/connexion" className="font-medium text-brand-600 hover:underline">
          Se connecter
        </Link>
      </p>
    </form>
  );
}

export function LogoutButton({ action }: { action: () => Promise<void> }) {
  return (
    <form action={action}>
      <Button variant="outline" size="sm" type="submit">
        Se deconnecter
      </Button>
    </form>
  );
}

export function ForgotPasswordForm() {
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [done, setDone] = React.useState(false);

  if (done) {
    return (
      <div className="text-center">
        <p className="text-sm text-slate-700">
          Si un compte existe avec cet email, un lien de reinitialisation vient d'etre envoye.
          Le lien expire dans 30 minutes.
        </p>
      </div>
    );
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries());

    startTransition(async () => {
      const result = await requestPasswordResetAction(payload);
      if (!result.ok) {
        setError(result.error ?? 'Erreur');
        return;
      }
      setDone(true);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" autoComplete="email" required />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Envoi...' : 'Envoyer le lien de reinitialisation'}
      </Button>

      <p className="text-center text-sm text-slate-600">
        <Link href="/connexion" className="font-medium text-brand-600 hover:underline">
          Retour a la connexion
        </Link>
      </p>
    </form>
  );
}

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [pending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = React.useState<Record<string, string[]>>({});

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    const payload = { ...Object.fromEntries(new FormData(event.currentTarget).entries()), token };

    startTransition(async () => {
      const result = await resetPasswordAction(payload);
      if (!result.ok) {
        setError(result.error ?? 'Erreur');
        if (result.fieldErrors) setFieldErrors(result.fieldErrors);
        return;
      }
      router.push('/connexion?reset=ok');
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="password">Nouveau mot de passe</Label>
        <Input id="password" name="password" type="password" autoComplete="new-password" required />
        <FieldError message={fieldErrors.password?.[0]} />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirmation</Label>
        <Input id="confirmPassword" name="confirmPassword" type="password" required />
        <FieldError message={fieldErrors.confirmPassword?.[0]} />
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{error}</p>}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Enregistrement...' : 'Changer mon mot de passe'}
      </Button>
    </form>
  );
}
