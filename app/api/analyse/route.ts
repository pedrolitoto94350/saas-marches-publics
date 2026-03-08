import { NextRequest, NextResponse } from 'next/server';

// Version ULTRA-MINIMALISTE pour identifier l'erreur
export async function POST(request: NextRequest) {
  try {
    console.log('🔧 API DEBUG - Début ultra-minimaliste');
    
    // Étape 1: Vérifier que la requête arrive
    console.log('✅ Étape 1: Requête reçue');
    
    // Étape 2: Vérifier l'authentification (simplifié)
    const authHeader = request.headers.get('Authorization');
    console.log('🔐 Auth Header présent:', !!authHeader);
    
    if (!authHeader) {
      console.log('❌ Pas de header Authorization');
      return NextResponse.json(
        { error: 'Authentication required', step: 'auth_header_check' },
        { status: 401 }
      );
    }
    
    console.log('✅ Étape 2: Auth header présent');
    
    // Étape 3: Essayer de parser le FormData
    try {
      const formData = await request.formData();
      console.log('✅ Étape 3: FormData parsé');
      
      const file = formData.get('file') as File;
      console.log('📁 Fichier reçu:', file ? `${file.name} (${file.size} bytes)` : 'AUCUN');
      
    } catch (formError: any) {
      console.log('❌ Erreur parsing FormData:', formError.message);
      return NextResponse.json(
        { error: 'Invalid form data', details: formError.message, step: 'formdata_parse' },
        { status: 400 }
      );
    }
    
    // Étape 4: Retourner une réponse de test SUCCÈS
    console.log('🎉 TOUTES LES ÉTAPES PASSÉES - Retour succès test');
    
    return NextResponse.json({
      success: true,
      message: 'API debug - toutes les étapes passées',
      step: 'complete',
      timestamp: new Date().toISOString(),
      next_action: 'Maintenant tester avec Supabase',
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': 'https://saas-marches-publics.vercel.app',
        'Access-Control-Allow-Credentials': 'true',
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error: any) {
    // Catch ULTRA-GLOBAL
    console.error('💥 ERREUR FATALE NON CATCHÉE:', error);
    console.error('💥 Stack:', error.stack);
    console.error('💥 Error name:', error.name);
    console.error('💥 Error message:', error.message);
    
    // FORCER le retour JSON même en cas d'erreur catastrophique
    const errorResponse = {
      error: 'CRITICAL_SERVER_ERROR',
      message: error.message || 'Unknown catastrophic error',
      type: error.name || 'Error',
      step: 'global_catch',
      timestamp: new Date().toISOString(),
      note: 'This should always be valid JSON',
    };
    
    return new NextResponse(JSON.stringify(errorResponse), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://saas-marches-publics.vercel.app',
      },
    });
  }
}

// Handler OPTIONS minimal
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://saas-marches-publics.vercel.app',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}