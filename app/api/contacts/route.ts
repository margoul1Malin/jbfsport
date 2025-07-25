import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer toutes les demandes de contact
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const read = searchParams.get('read');

    const whereClause: {
      read?: boolean;
    } = {};
    
    if (read !== null) {
      whereClause.read = read === 'true';
    }

    const contacts = await prisma.contactRequest.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(contacts);
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des contacts' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle demande de contact
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message } = body;

    const contact = await prisma.contactRequest.create({
      data: {
        name,
        email,
        phone,
        message,
        read: false
      }
    });

    return NextResponse.json(contact, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du contact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du contact' },
      { status: 500 }
    );
  }
} 