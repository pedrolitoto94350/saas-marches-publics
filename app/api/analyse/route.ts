import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'utilisateur via les cookies (Supabase gère les cookies automatiquement)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Récupérer le fichier
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validation des types de fichiers
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain',
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.oasis.opendocument.text',
    ];

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx', 'txt', 'csv', 'xls', 'xlsx', 'odt'];

    if (!allowedTypes.includes(file.type) && !allowedExtensions.includes(fileExtension || '')) {
      return NextResponse.json(
        { error: 'Unsupported file format. Allowed: PDF, DOC, DOCX, TXT, CSV, XLS, XLSX, ODT' },
        { status: 400 }
      );
    }

    if (file.size > 20 * 1024 * 1024) {
      // 20MB
      return NextResponse.json({ error: 'File too large (max 20MB)' }, { status: 400 });
    }

    console.log(`Processing document: ${file.name} (${file.type}) for user ${user.id}`);

    // Traiter le document (simulation)
    // Dans une vraie implémentation, on importerait et utiliserait processDocument
    const documentInfo = {
      filename: file.name,
      type: file.type,
      size: file.size,
      extracted: true,
    };

    console.log(`Document info:`, documentInfo);
    const mockAnalysis = {
      metadata: {
        titre: `Analyse de ${file.name}`,
        organisme_acheteur: 'Organisme public',
        date_limite: '2026-04-15',
        budget_estime_min: 50000,
        budget_estime_max: 150000,
        type_marche: 'Fournitures',
      },
      criteres_attribution: [
        { nom: 'Prix', ponderation: 60, description: 'Offre la plus basse', citation_page: 1 },
        {
          nom: 'Valeur technique',
          ponderation: 25,
          description: 'Qualité des équipements',
          citation_page: 2,
        },
        {
          nom: 'Délai de livraison',
          ponderation: 15,
          description: 'Respect des délais',
          citation_page: 2,
        },
      ],
      exigences_techniques: [
        { exigence: 'Certification ISO 9001', obligatoire: true, citation_page: 3 },
        { exigence: 'Garantie 3 ans minimum', obligatoire: true, citation_page: 3 },
      ],
      risques_contractuels: [
        {
          risque: 'Pénalités de retard',
          gravite: 'eleve',
          impact: '500€/jour de retard',
          citation_page: 5,
        },
      ],
      analyse_pertinence: {
        score_global: Math.floor(Math.random() * 30) + 70, // 70-100
        points_forts: ['Budget adapté', 'Exigences techniques maîtrisées'],
        points_faibles: ['Concurrence importante', 'Délais serrés'],
        temps_preparation_estime_heures: 20,
        priorite: Math.random() > 0.5 ? 'haute' : 'moyenne',
      },
      recommandations: [
        {
          action: "Préparer l'offre technique",
          urgence: 'immediate',
          details: 'Mettre en avant vos certifications',
        },
        {
          action: 'Négocier les délais',
          urgence: 'court_terme',
          details: 'Vérifier la faisabilité du planning',
        },
      ],
    };

    // Sauvegarder dans Supabase
    const { data: savedAnalysis, error: saveError } = await supabase
      .from('analyses')
      .insert({
        user_id: user.id,
        filename: file.name,
        file_size: file.size,
        analysis_result: mockAnalysis,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (saveError) {
      console.error('Save error:', saveError);
      return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      analysis_id: savedAnalysis.id,
      analysis: mockAnalysis,
      metadata: {
        filename: file.name,
        file_size: file.size,
        processing_time: 'completed',
      },
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token d'authentification
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');

    // Vérifier l'utilisateur
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: 'Invalid authentication' }, { status: 401 });
    }

    // Récupérer les analyses de l'utilisateur
    const { data: analyses, error: fetchError } = await supabase
      .from('analyses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    if (fetchError) {
      return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      count: analyses.length,
      analyses: analyses.map((a: any) => ({
        id: a.id,
        filename: a.filename,
        created_at: a.created_at,
        analysis_result: a.analysis_result,
      })),
    });
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
}
