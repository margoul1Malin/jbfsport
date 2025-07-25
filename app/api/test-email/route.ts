import { NextResponse } from 'next/server';
import { testEmailConnection, sendContactNotification } from '../../../lib/email';

export async function GET() {
  try {
    // Test de la connexion
    const connectionTest = await testEmailConnection();
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        message: 'Échec de la connexion email',
        error: connectionTest.message,
        config: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER ? '***' + process.env.SMTP_USER.slice(-10) : 'non défini',
          hasPassword: !!process.env.SMTP_PASS,
        }
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Configuration email valide',
      connection: connectionTest.message,
      config: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        user: process.env.SMTP_USER ? '***' + process.env.SMTP_USER.slice(-10) : 'non défini',
        hasPassword: !!process.env.SMTP_PASS,
        adminEmail: process.env.ADMIN_EMAIL ? '***' + process.env.ADMIN_EMAIL.slice(-10) : 'non défini',
      }
    });

  } catch (error) {
    console.error('Erreur test email:', error);
    return NextResponse.json({
      success: false,
      message: 'Erreur lors du test de la configuration email',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
}

export async function POST() {
  try {
    // Test d'envoi d'email
    const testEmailData = {
      id: 'test-' + Date.now(),
      name: 'Test Contact',
      email: process.env.SMTP_USER || 'test@example.com',
      message: 'Ceci est un test d\'envoi d\'email depuis JBF Sport.',
      createdAt: new Date(),
    };

    const emailResults = await sendContactNotification(testEmailData);

    return NextResponse.json({
      success: true,
      message: 'Email de test envoyé',
      results: emailResults
    });

  } catch (error) {
    console.error('Erreur envoi test email:', error);
    return NextResponse.json({
      success: false,
      message: 'Échec de l\'envoi du test email',
      error: error instanceof Error ? error.message : 'Erreur inconnue'
    }, { status: 500 });
  }
} 