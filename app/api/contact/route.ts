import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { sendContactNotification } from '../../../lib/email';

const prisma = new PrismaClient();

// Schéma de validation pour les données de contact
const contactSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  email: z.string().email('Email invalide').max(100, 'Email trop long'),
  phone: z.string().optional(),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(1000, 'Message trop long'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Validation des données
    const validatedData = contactSchema.parse(body);
    
    // Sauvegarde en base de données
    const contactRequest = await prisma.contactRequest.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        phone: validatedData.phone || null,
        message: validatedData.message,
      },
    });

    // Envoyer les emails de notification
    try {
      const emailResults = await sendContactNotification({
        id: contactRequest.id,
        name: contactRequest.name,
        email: contactRequest.email,
        phone: contactRequest.phone || undefined,
        message: contactRequest.message,
        createdAt: contactRequest.createdAt,
      });

      console.log('Résultats envoi email:', emailResults);
      
      // Même si l'email échoue, on retourne un succès car la demande est sauvegardée
      return NextResponse.json(
        { 
          success: true, 
          message: 'Votre message a été envoyé avec succès',
          id: contactRequest.id,
          emailStatus: emailResults
        },
        { status: 201 }
      );

    } catch (emailError) {
      console.error('Erreur lors de l\'envoi des emails:', emailError);
      
      // Retourner un succès avec avertissement sur l'email
      return NextResponse.json(
        { 
          success: true, 
          message: 'Votre message a été enregistré avec succès',
          id: contactRequest.id,
          emailWarning: 'Notification email en cours de traitement'
        },
        { status: 201 }
      );
    }

  } catch (error) {
    console.error('Erreur lors du traitement de la demande de contact:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Données invalides',
          details: error.errors 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: 'Erreur interne du serveur' 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Méthode non autorisée' },
    { status: 405 }
  );
} 