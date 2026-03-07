'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Upload, FileText, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function UploadPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [analysisId, setAnalysisId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    // Validation
    if (selectedFile.type !== 'application/pdf') {
      setError('Seuls les fichiers PDF sont acceptés')
      return
    }

    if (selectedFile.size > 10 * 1024 * 1024) { // 10MB
      setError('Le fichier est trop volumineux (max 10MB)')
      return
    }

    setFile(selectedFile)
    setError('')
    setSuccess('')
  }

  const handleUpload = async () => {
    if (!file || !user) return

    setIsUploading(true)
    setUploadProgress(0)
    setError('')
    setSuccess('')

    try {
      // Simulation de progression
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      // Préparer le FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('userId', user.id)

      // Envoyer à l'API
      const response = await fetch('/api/analyse', {
        method: 'POST',
        body: formData,
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erreur lors de l\'analyse')
      }

      const data = await response.json()
      
      setSuccess('Analyse terminée avec succès !')
      setAnalysisId(data.analysis_id)
      
      // Redirection automatique après 3 secondes
      setTimeout(() => {
        if (data.analysis_id) {
          router.push(`/analysis/${data.analysis_id}`)
        } else {
          router.push('/dashboard')
        }
      }, 3000)

    } catch (err: any) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      // Créer un faux événement pour handleFileSelect
      const fakeEvent = {
        target: {
          files: [droppedFile]
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>
      handleFileSelect(fakeEvent)
    }
  }

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
              <h1 className="ml-3 text-xl font-bold text-gray-900">
                Analyser un appel d'offres
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="card">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Télécharger votre document
            </h2>
            <p className="text-gray-600">
              Importez l'appel d'offres que vous souhaitez analyser. Notre IA examinera le document et vous fournira un rapport détaillé.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
              <CheckCircle className="w-5 h-5 mr-2" />
              {success}
              {analysisId && (
                <Link 
                  href={`/analysis/${analysisId}`}
                  className="ml-2 text-green-800 underline"
                >
                  Voir le rapport
                </Link>
              )}
            </div>
          )}

          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              file 
                ? 'border-primary-500 bg-primary-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            {file ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center">
                  <FileText className="h-12 w-12 text-primary-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{file.name}</p>
                  <p className="text-sm text-gray-600">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Changer de fichier
                </button>
              </div>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  Déposez votre PDF ici
                </p>
                <p className="text-gray-600 mb-6">
                  ou cliquez pour sélectionner
                </p>
                <label className="inline-flex items-center btn-primary cursor-pointer">
                  <Upload className="w-5 h-5 mr-2" />
                  Sélectionner un fichier
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </label>
              </>
            )}
          </div>

          <div className="mt-6 text-sm text-gray-500">
            <p className="mb-2">
              <span className="font-medium">Recommandations :</span>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>Utilisez des PDF de bonne qualité (texte sélectionnable)</li>
              <li>Vérifiez que le document est complet</li>
              <li>Évitez les fichiers scannés de mauvaise qualité</li>
              <li>Taille maximale : 10 MB</li>
            </ul>
          </div>

          {isUploading && (
            <div className="mt-8">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Analyse en cours...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                L'analyse prend généralement 1-2 minutes
              </p>
            </div>
          )}

          <div className="mt-8 flex justify-end space-x-4">
            <Link
              href="/dashboard"
              className="btn-secondary"
            >
              Annuler
            </Link>
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? 'Analyse en cours...' : 'Lancer l\'analyse'}
            </button>
          </div>
        </div>

        <div className="mt-8 card">
          <h3 className="font-bold text-gray-900 mb-4">
            Ce que notre IA analyse
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Critères d'attribution</p>
                <p className="text-sm text-gray-600">Pondérations et modalités d'évaluation</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Exigences techniques</p>
                <p className="text-sm text-gray-600">Spécifications et certifications requises</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Délais et budget</p>
                <p className="text-sm text-gray-600">Dates limites et montants estimés</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-primary-600 font-bold">✓</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Risques contractuels</p>
                <p className="text-sm text-gray-600">Pénalités, garanties et clauses critiques</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}