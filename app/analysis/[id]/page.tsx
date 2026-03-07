'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, FileText, AlertCircle, CheckCircle, Clock, Euro, Calendar, Building, Target, Shield, TrendingUp } from 'lucide-react'

export default function AnalysisPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const analysisId = params.id as string
  
  const [analysis, setAnalysis] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && analysisId) {
      fetchAnalysis()
    }
  }, [user, analysisId])

  const fetchAnalysis = async () => {
    try {
      // Simuler des données d'analyse pour la démo
      // Dans une vraie implémentation, on appellerait l'API
      setTimeout(() => {
        setAnalysis({
          id: analysisId,
          filename: 'Appel-offres-mairie-paris-2026.pdf',
          date: '2026-03-06',
          status: 'completed',
          metadata: {
            titre: 'Fourniture de matériel informatique',
            organisme_acheteur: 'Mairie de Paris',
            date_limite: '2026-04-15',
            budget_estime_min: 85000,
            budget_estime_max: 120000,
            type_marche: 'Fournitures'
          },
          criteres_attribution: [
            { nom: 'Prix', ponderation: 60, description: 'Offre la plus basse', citation_page: 1 },
            { nom: 'Valeur technique', ponderation: 25, description: 'Qualité des équipements', citation_page: 2 },
            { nom: 'Délai de livraison', ponderation: 15, description: 'Respect des délais', citation_page: 2 }
          ],
          exigences_techniques: [
            { exigence: 'Certification ISO 9001', obligatoire: true, citation_page: 3 },
            { exigence: 'Garantie 3 ans minimum', obligatoire: true, citation_page: 3 },
            { exigence: 'Support technique 24/7', obligatoire: false, citation_page: 4 }
          ],
          risques_contractuels: [
            { risque: 'Pénalités de retard', gravite: 'eleve', impact: '500€/jour de retard', citation_page: 5 },
            { risque: 'Résiliation pour défaut', gravite: 'moyen', impact: 'Possibilité de résiliation', citation_page: 6 }
          ],
          analyse_pertinence: {
            score_global: 85,
            points_forts: ['Budget adapté à votre fourchette', 'Exigences techniques maîtrisées'],
            points_faibles: ['Concurrence importante sur ce marché', 'Délais serrés'],
            temps_preparation_estime_heures: 25,
            priorite: 'haute'
          },
          recommandations: [
            { action: 'Préparer l\'offre technique détaillée', urgence: 'immediate', details: 'Mettre en avant vos certifications' },
            { action: 'Négocier les délais', urgence: 'court_terme', details: 'Vérifier la faisabilité du planning' },
            { action: 'Étudier la concurrence', urgence: 'long_terme', details: 'Analyser les offres précédentes' }
          ]
        })
        setIsLoading(false)
      }, 1000)
    } catch (err: any) {
      setError(err.message || 'Erreur lors du chargement')
      setIsLoading(false)
    }
  }

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de l'analyse...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">{error}</p>
          <Link href="/dashboard" className="btn-primary mt-4 inline-block">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-900">Analyse non trouvée</p>
          <Link href="/dashboard" className="btn-primary mt-4 inline-block">
            Retour au tableau de bord
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link
              href="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 mr-6"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Retour
            </Link>
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">
                  Rapport d'analyse
                </h1>
                <p className="text-sm text-gray-600">{analysis.filename}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Score Card */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {analysis.metadata.titre}
              </h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  {analysis.metadata.organisme_acheteur}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Date limite : {analysis.metadata.date_limite}
                </div>
                <div className="flex items-center">
                  <Euro className="w-4 h-4 mr-1" />
                  Budget : {analysis.metadata.budget_estime_min.toLocaleString()} - {analysis.metadata.budget_estime_max.toLocaleString()} €
                </div>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <div className="text-center">
                <div className="text-5xl font-bold text-primary-600">
                  {analysis.analyse_pertinence.score_global}%
                </div>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mt-2 ${
                  analysis.analyse_pertinence.priorite === 'haute' 
                    ? 'bg-red-100 text-red-800'
                    : analysis.analyse_pertinence.priorite === 'moyenne'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {analysis.analyse_pertinence.priorite === 'haute' ? 'Haute priorité' : 
                   analysis.analyse_pertinence.priorite === 'moyenne' ? 'Priorité moyenne' : 'Basse priorité'}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Critères d'attribution */}
            <div className="card">
              <div className="flex items-center mb-6">
                <Target className="h-6 w-6 text-primary-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">
                  Critères d'attribution
                </h3>
              </div>
              
              <div className="space-y-4">
                {analysis.criteres_attribution.map((criter: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{criter.nom}</span>
                      <span className="font-bold text-primary-600">{criter.ponderation}%</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{criter.description}</p>
                    <p className="text-xs text-gray-500">Page {criter.citation_page}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Exigences techniques */}
            <div className="card">
              <div className="flex items-center mb-6">
                <Shield className="h-6 w-6 text-primary-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">
                  Exigences techniques
                </h3>
              </div>
              
              <div className="space-y-3">
                {analysis.exigences_techniques.map((exigence: any, index: number) => (
                  <div key={index} className="flex items-start">
                    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5 ${
                      exigence.obligatoire ? 'bg-red-100' : 'bg-gray-100'
                    }`}>
                      {exigence.obligatoire ? (
                        <span className="text-red-600 font-bold">!</span>
                      ) : (
                        <span className="text-gray-600">○</span>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{exigence.exigence}</p>
                      <p className="text-sm text-gray-600">
                        {exigence.obligatoire ? 'Obligatoire' : 'Recommandé'} • Page {exigence.citation_page}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Risques */}
            <div className="card">
              <div className="flex items-center mb-6">
                <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-xl font-bold text-gray-900">
                  Risques contractuels identifiés
                </h3>
              </div>
              
              <div className="space-y-4">
                {analysis.risques_contractuels.map((risque: any, index: number) => (
                  <div key={index} className="border border-red-100 bg-red-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-red-900">{risque.risque}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        risque.gravite === 'eleve' 
                          ? 'bg-red-200 text-red-800'
                          : risque.gravite === 'moyen'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-green-200 text-green-800'
                      }`}>
                        {risque.gravite === 'eleve' ? 'Élevé' : 
                         risque.gravite === 'moyen' ? 'Moyen' : 'Faible'}
                      </span>
                    </div>
                    <p className="text-red-700 text-sm">{risque.impact}</p>
                    <p className="text-xs text-red-600 mt-2">Page {risque.citation_page}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Points forts/faibles */}
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">
                Analyse de pertinence
              </h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-green-700 mb-2 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Points forts
                  </h4>
                  <ul className="space-y-2">
                    {analysis.analyse_pertinence.points_forts.map((point: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-red-700 mb-2 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    Points faibles
                  </h4>
                  <ul className="space-y-2">
                    {analysis.analyse_pertinence.points_faibles.map((point: string, index: number) => (
                      <li key={index} className="text-sm text-gray-600 flex items-start">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2" />
                    Temps de préparation estimé : <span className="font-medium ml-1">{analysis.analyse_pertinence.temps_preparation_estime_heures} heures</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommandations */}
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">
                Recommandations
              </h3>
              
              <div className="space-y-4">
                {analysis.recommandations.map((reco: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-900">{reco.action}</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        reco.urgence === 'immediate'
                          ? 'bg-red-100 text-red-800'
                          : reco.urgence === 'court_terme'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {reco.urgence === 'immediate' ? 'Immédiat' : 
                         reco.urgence === 'court_terme' ? 'Court terme' : 'Long terme'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{reco.details}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">
                Actions suivantes
              </h3>
              
              <div className="space-y-3">
                <button className="w-full btn-primary">
                  Générer le rapport complet (PDF)
                </button>
                <button className="w-full btn-secondary">
                  Planifier un rappel
                </button>
                <Link
                  href="/upload"
                  className="w-full inline-flex items-center justify-center btn-secondary"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Analyser un autre document
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Analyse générée le {analysis.date} • Document ID: {analysis.id}</p>
          <p className="mt-1">Cette analyse est générée par IA et doit être vérifiée par un expert</p>
        </div>
      </main>
    </div>
  )
}