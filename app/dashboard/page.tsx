'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Upload, FileText, BarChart, LogOut, User, Clock, AlertCircle } from 'lucide-react'

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()
  const [analyses, setAnalyses] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    thisMonth: 0,
    highPriority: 0
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

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
          budget: '85 000 - 120 000 €'
        },
        {
          id: 2,
          filename: 'Marche-fournitures-hopital.pdf',
          date: '2026-03-05',
          status: 'completed',
          score: 72,
          priority: 'medium',
          budget: '45 000 €'
        },
        {
          id: 3,
          filename: 'AO-collectivite-territoriale.pdf',
          date: '2026-03-04',
          status: 'processing',
          score: null,
          priority: null,
          budget: null
        }
      ])

      setStats({
        total: 12,
        thisMonth: 3,
        highPriority: 2
      })
    }
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-primary-600" />
              <h1 className="ml-3 text-xl font-bold text-gray-900">
                Analyseur d'Appels d'Offres
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="w-4 h-4 mr-1" />
                {user.email}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center text-sm text-gray-600 hover:text-gray-900"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center">
              <div className="p-3 bg-primary-50 rounded-lg">
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
              <div className="p-3 bg-green-50 rounded-lg">
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
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Haute priorité</p>
                <p className="text-2xl font-bold">{stats.highPriority}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            <div className="card mb-8">
              <div className="flex items-center mb-6">
                <Upload className="h-6 w-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">
                  Analyser un nouvel appel d'offres
                </h2>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Déposez votre PDF ici
                </p>
                <p className="text-gray-600 mb-6">
                  Formats acceptés : PDF uniquement (max 10MB)
                </p>
                
                <Link
                  href="/upload"
                  className="inline-flex items-center btn-primary"
                >
                  <Upload className="w-5 h-5 mr-2" />
                  Sélectionner un fichier
                </Link>
                
                <p className="mt-4 text-sm text-gray-500">
                  L'analyse prend environ 1-2 minutes
                </p>
              </div>
            </div>

            {/* Recent Analyses */}
            <div className="card">
              <div className="flex items-center mb-6">
                <BarChart className="h-6 w-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-bold text-gray-900">
                  Analyses récentes
                </h2>
              </div>

              <div className="space-y-4">
                {analyses.length === 0 ? (
                  <p className="text-gray-600 text-center py-8">
                    Aucune analyse pour le moment
                  </p>
                ) : (
                  analyses.map((analysis) => (
                    <div
                      key={analysis.id}
                      className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-3" />
                          <div>
                            <p className="font-medium text-gray-900">
                              {analysis.filename}
                            </p>
                            <p className="text-sm text-gray-600">
                              Analysé le {analysis.date}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                          {analysis.status === 'completed' ? (
                            <>
                              <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                analysis.priority === 'high' 
                                  ? 'bg-red-100 text-red-800'
                                  : analysis.priority === 'medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}>
                                {analysis.priority === 'high' ? 'Haute' : 
                                 analysis.priority === 'medium' ? 'Moyenne' : 'Basse'} priorité
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-lg">{analysis.score}%</p>
                                <p className="text-sm text-gray-600">Score</p>
                              </div>
                            </>
                          ) : (
                            <div className="flex items-center text-yellow-600">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                              En cours d'analyse...
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {analysis.budget && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
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
              <h3 className="font-bold text-gray-900 mb-4">
                Comment ça marche
              </h3>
              <div className="space-y-3">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-bold">1</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Téléchargez votre appel d'offres (PDF)
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-bold">2</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Notre IA analyse le document en détail
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-primary-600 font-bold">3</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Recevez un rapport détaillé avec recommandations
                  </p>
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-bold text-gray-900 mb-4">
                Votre abonnement
              </h3>
              <div className="bg-primary-50 rounded-lg p-4 mb-4">
                <p className="font-bold text-primary-900">Essai gratuit</p>
                <p className="text-sm text-primary-700">
                  {3 - stats.thisMonth} analyses restantes ce mois-ci
                </p>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Profitez de l'analyse IA des marchés publics pour votre PME/TPE.
              </p>
              <button className="w-full btn-secondary">
                Voir les offres premium
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}