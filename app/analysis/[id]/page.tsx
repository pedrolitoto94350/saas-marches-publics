'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  FileText,
  AlertCircle,
  CheckCircle,
  Clock,
  Euro,
  Calendar,
  Building,
  Target,
  Shield,
  TrendingUp,
} from 'lucide-react';

export default function AnalysisPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const analysisId = params.id as string;

  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const fetchAnalysis = useCallback(async () => {
    try {
      // Simuler des données d'analyse pour la démo
      // Dans une vraie implémentation, on appellerait l'API
      setTimeout(() => {
        setAnalysis({
          id: analysisId,
          filename: 'Appel-offres-mairie-paris-2026.pdf',
          date: '2026-03-06',
          status: 'completed',
          summary: 'Analyse complète des critères techniques et financiers.',
          recommendations: [
            'Focus sur les critères environnementaux (30% de la note)',
            'Prévoir une marge de 15-20% sur le budget',
            "Souligner l'expérience dans les marchés publics similaires",
          ],
          score: 78,
          risk: 'medium',
        });
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      console.error('Error fetching analysis:', error);
      setIsLoading(false);
    }
  }, [analysisId]);

  useEffect(() => {
    if (user && analysisId) {
      fetchAnalysis();
    }
  }, [user, analysisId, fetchAnalysis]);


  if (loading || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Chargement de l'analyse...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-red-600" />
          <p className="text-lg font-medium text-gray-900">{error}</p>
          <Link href="/dashboard" className="btn-primary mt-4 inline-block">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-yellow-600" />
          <p className="text-lg font-medium text-gray-900">Analyse non trouvée</p>
          <Link href="/dashboard" className="btn-primary mt-4 inline-block">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link
              href="/dashboard"
              className="mr-6 flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Retour
            </Link>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Rapport d'analyse</h1>
                <p className="text-sm text-gray-600">{analysis.filename}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Score Card */}
        <div className="card mb-8">
          <div className="flex flex-col justify-between md:flex-row md:items-center">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-gray-900">{analysis.metadata.titre}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Building className="mr-1 h-4 w-4" />
                  {analysis.metadata.organisme_acheteur}
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-1 h-4 w-4" />
                  Date limite : {analysis.metadata.date_limite}
                </div>
                <div className="flex items-center">
                  <Euro className="mr-1 h-4 w-4" />
                  Budget : {analysis.metadata.budget_estime_min.toLocaleString()} -{' '}
                  {analysis.metadata.budget_estime_max.toLocaleString()} €
                </div>
              </div>
            </div>

            <div className="mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600">
                  {analysis.analyse_pertinence.score_global}%
                </div>
                <div
                  className={`mt-2 inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                    analysis.analyse_pertinence.priorite === 'haute'
                      ? 'bg-red-100 text-red-800'
                      : analysis.analyse_pertinence.priorite === 'moyenne'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {analysis.analyse_pertinence.priorite === 'haute'
                    ? 'Haute priorité'
                    : analysis.analyse_pertinence.priorite === 'moyenne'
                      ? 'Priorité moyenne'
                      : 'Basse priorité'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Critères d'attribution */}
            <div className="card">
              <div className="mb-6 flex items-center">
                <Target className="mr-2 h-6 w-6 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">Critères d'attribution</h3>
              </div>

              <div className="space-y-4">
                {analysis.criteres_attribution.map((criter: any, index: number) => (
                  <div key={index} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-gray-900">{criter.nom}</span>
                      <span className="font-bold text-primary-600">{criter.ponderation}%</span>
                    </div>
                    <p className="mb-2 text-sm text-gray-600">{criter.description}</p>
                    <p className="text-xs text-gray-500">Page {criter.citation_page}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exigences techniques */}
            <div className="card">
              <div className="mb-6 flex items-center">
                <Shield className="mr-2 h-6 w-6 text-primary-600" />
                <h3 className="text-xl font-bold text-gray-900">Exigences techniques</h3>
              </div>

              <div className="space-y-3">
                {analysis.exigences_techniques.map((exigence: any, index: number) => (
                  <div key={index} className="flex items-start">
                    <div
                      className={`mr-3 mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full ${
                        exigence.obligatoire ? 'bg-red-100' : 'bg-gray-100'
                      }`}
                    >
                      {exigence.obligatoire ? (
                        <span className="font-bold text-red-600">!</span>
                      ) : (
                        <span className="text-gray-600">○</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{exigence.exigence}</p>
                      <p className="text-sm text-gray-600">
                        {exigence.obligatoire ? 'Obligatoire' : 'Recommandé'} • Page{' '}
                        {exigence.citation_page}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risques */}
            <div className="card">
              <div className="mb-6 flex items-center">
                <AlertCircle className="mr-2 h-6 w-6 text-red-600" />
                <h3 className="text-xl font-bold text-gray-900">Risques contractuels identifiés</h3>
              </div>

              <div className="space-y-4">
                {analysis.risques_contractuels.map((risque: any, index: number) => (
                  <div key={index} className="rounded-lg border border-red-100 bg-red-50 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-red-900">{risque.risque}</span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          risque.gravite === 'eleve'
                            ? 'bg-red-200 text-red-800'
                            : risque.gravite === 'moyen'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-green-200 text-green-800'
                        }`}
                      >
                        {risque.gravite === 'eleve'
                          ? 'Élevé'
                          : risque.gravite === 'moyen'
                            ? 'Moyen'
                            : 'Faible'}
                      </span>
                    </div>
                    <p className="text-sm text-red-700">{risque.impact}</p>
                    <p className="mt-2 text-xs text-red-600">Page {risque.citation_page}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Points forts/faibles */}
            <div className="card">
              <h3 className="mb-4 font-bold text-gray-900">Analyse de pertinence</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="mb-2 flex items-center font-medium text-green-700">
                    <CheckCircle className="mr-1 h-4 w-4" />
                    Points forts
                  </h4>
                  <ul className="space-y-2">
                    {analysis.analyse_pertinence.points_forts.map(
                      (point: string, index: number) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <div className="mr-2 mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-green-500"></div>
                          {point}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="mb-2 flex items-center font-medium text-red-700">
                    <AlertCircle className="mr-1 h-4 w-4" />
                    Points faibles
                  </h4>
                  <ul className="space-y-2">
                    {analysis.analyse_pertinence.points_faibles.map(
                      (point: string, index: number) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <div className="mr-2 mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                          {point}
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="mr-2 h-4 w-4" />
                    Temps de préparation estimé :{' '}
                    <span className="ml-1 font-medium">
                      {analysis.analyse_pertinence.temps_preparation_estime_heures} heures
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommandations */}
            <div className="card">
              <h3 className="mb-4 font-bold text-gray-900">Recommandations</h3>

              <div className="space-y-4">
                {analysis.recommandations.map((reco: any, index: number) => (
                  <div key={index} className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium text-gray-900">{reco.action}</span>
                      <span
                        className={`rounded px-2 py-1 text-xs font-medium ${
                          reco.urgence === 'immediate'
                            ? 'bg-red-100 text-red-800'
                            : reco.urgence === 'court_terme'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {reco.urgence === 'immediate'
                          ? 'Immédiat'
                          : reco.urgence === 'court_terme'
                            ? 'Court terme'
                            : 'Long terme'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{reco.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <h3 className="mb-4 font-bold text-gray-900">Actions suivantes</h3>

              <div className="space-y-3">
                <button className="btn-primary w-full">Générer le rapport complet (PDF)</button>
                <button className="btn-secondary w-full">Planifier un rappel</button>
                <Link
                  href="/upload"
                  className="btn-secondary inline-flex w-full items-center justify-center"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analyser un autre document
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Analyse générée le {analysis.date} • Document ID: {analysis.id}
          </p>
          <p className="mt-1">
            Cette analyse est générée par IA et doit être vérifiée par un expert
          </p>
        </div>
      </main>
    </div>
  );
}
