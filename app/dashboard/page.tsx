'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Upload, FileText, BarChart, LogOut, User, Clock, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    highPriority: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Données simulées pour la démo
  useEffect(() => {
    if (user) {
      // Simuler des données d'analyse
      setAnalyses([
        {
          id: 1,
          filename: 'Appel-offres-mairie-paris-2026.pdf',
          date: '2026-03-06',
          status: 'completed',
          score: 85,
          priority: 'high',
          budget: '85 000 - 120 000 €',
        },
        {
          id: 2,
          filename: 'Marche-fournitures-hopital.pdf',
          date: '2026-03-05',
          status: 'completed',
          score: 72,
          priority: 'medium',
          budget: '45 000 €',
        },
        {
          id: 3,
          filename: 'AO-collectivite-territoriale.pdf',
          date: '2026-03-04',
          status: 'processing',
          score: null,
          priority: null,
          budget: null,
        },
      ]);

      setStats({
        total: 12,
        thisMonth: 3,
        highPriority: 2,
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">Analyseur d'Appels d'Offres</h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="mr-1 h-4 w-4" />
                {user.email}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="mr-1 h-4 w-4" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card">
            <div className="flex items-center">
              <div className="rounded-lg bg-primary-50 p-3">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Analyses totales</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="rounded-lg bg-green-50 p-3">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ce mois-ci</p>
                <p className="text-2xl font-bold">{stats.thisMonth}</p>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="rounded-lg bg-red-50 p-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Haute priorité</p>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <div className="mb-6 flex items-center">
                <Upload className="mr-2 h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Analyser un nouvel appel d'offres
                </h2>
              </div>

              <div className="rounded-xl border-2 border-dashed border-gray-300 p-8 text-center">
                <Upload className="mx-auto mb-4 h-12 w-12 text-gray-400" />
                <p className="mb-2 text-lg font-medium text-gray-900">Déposez votre PDF ici</p>
                <p className="mb-6 text-gray-600">Formats acceptés : PDF uniquement (max 10MB)</p>

                <Link href="/upload" className="btn-primary inline-flex items-center">
                  <Upload className="mr-2 h-5 w-5" />
                  Sélectionner un fichier
                </Link>

                <p className="mt-4 text-sm text-gray-500">L'analyse prend environ 1-2 minutes</p>
              </div>
            </div>

            {/* Recent Analyses */}
            <div className="card">
              <div className="mb-6 flex items-center">
                <BarChart className="mr-2 h-6 w-6 text-primary-600" />
                <h2 className="text-xl font-bold text-gray-900">Analyses récentes</h2>
              </div>

              <div className="space-y-4">
                {analyses.length === 0 ? (
                  <p className="py-8 text-center text-gray-600">Aucune analyse pour le moment</p>
                ) : (
                  analyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="mr-3 h-5 w-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{analysis.filename}</p>
                            <p className="text-sm text-gray-600">Analysé le {analysis.date}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4">
                          {analysis.status === 'completed' ? (
                            <>
                              <div
                                className={`rounded-full px-3 py-1 text-sm font-medium ${
                                  analysis.priority === 'high'
                                    ? 'bg-red-100 text-red-800'
                                    : analysis.priority === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                }`}
                              >
                                {analysis.priority === 'high'
                                  ? 'Haute'
                                  : analysis.priority === 'medium'
                                    ? 'Moyenne'
                                    : 'Basse'}{' '}
                                priorité
                              </div>
                              <div className="text-right">
                                <p className="text-lg font-bold">{analysis.score}%</p>
                                <p className="text-sm text-gray-600">Score</p>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center text-yellow-600">
                              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-yellow-600"></div>
                              En cours d'analyse...
                            </div>
                          )}
                        </div>
                      </div>

                      {analysis.budget && (
                        <div className="mt-3 border-t border-gray-100 pt-3">
                          <p className="text-sm text-gray-600">
                            Budget estimé : <span className="font-medium">{analysis.budget}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div>
            <div className="card mb-6">
              <h3 className="mb-4 font-bold text-gray-900">Comment ça marche</h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <span className="font-bold text-primary-600">1</span>
                  </div>
                  <p className="text-sm text-gray-600">Téléchargez votre appel d'offres (PDF)</p>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <span className="font-bold text-primary-600">2</span>
                  </div>
                  <p className="text-sm text-gray-600">Notre IA analyse le document en détail</p>
                </div>
                <div className="flex items-start">
                  <div className="mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary-100">
                    <span className="font-bold text-primary-600">3</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Recevez un rapport détaillé avec recommandations
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="mb-4 font-bold text-gray-900">Votre abonnement</h3>
              <div className="mb-4 rounded-lg bg-primary-50 p-4">
                <p className="font-bold text-primary-900">Essai gratuit</p>
                <p className="text-sm text-primary-700">
                  {3 - stats.thisMonth} analyses restantes ce mois-ci
                </p>
              </div>
              <p className="mb-4 text-sm text-gray-600">
                Profitez de l'analyse IA des marchés publics pour votre PME/TPE.
              </p>
              <button className="btn-secondary w-full">Voir les offres premium</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
