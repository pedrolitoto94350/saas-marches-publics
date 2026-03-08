'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertCircle, Mail, Lock, Building } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    const { error } = await signUp(email, password);

    if (error) {
      setError(error.message);
    } else {
      setSuccess('Compte créé avec succès ! Vous pouvez maintenant vous connecter.');
      // Redirection automatique après 2 secondes
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-bold text-gray-900">Créer un compte</h1>
        <p className="mt-2 text-center text-sm text-gray-600">
          Commencez à analyser vos appels d'offres
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="card">
          <h2 className="mb-6 text-2xl font-bold text-gray-900">Inscription</h2>

          {error && (
            <div className="mb-4 flex items-center rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
              <AlertCircle className="mr-2 h-5 w-5" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 flex items-center rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
              <AlertCircle className="mr-2 h-5 w-5" />
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nom de l'entreprise
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="input pl-10"
                  placeholder="Votre entreprise"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email professionnel
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="vous@entreprise.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10"
                  placeholder="Minimum 8 caractères"
                  required
                  minLength={8}
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Utilisez au moins 8 caractères avec des lettres et des chiffres
              </p>
            </div>

            <div className="text-sm text-gray-600">
              <p className="mb-2">En vous inscrivant, vous acceptez :</p>
              <ul className="list-inside list-disc space-y-1 text-gray-500">
                <li>Les conditions d'utilisation</li>
                <li>La politique de confidentialité</li>
                <li>L'utilisation de l'IA pour l'analyse des documents</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Création du compte...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-center text-sm text-gray-600">
              Déjà un compte ?{' '}
              <Link href="/login" className="font-medium text-primary-600 hover:text-primary-500">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Essai gratuit • 3 analyses offertes</p>
        </div>
      </div>
    </div>
  );
}
