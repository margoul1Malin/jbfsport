import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// PUT - Marquer un contact comme lu
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { read } = body;

    const contact = await prisma.contactRequest.update({
      where: { id },
      data: { read }
    });

    return NextResponse.json(contact);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour du contact' },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un contact
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.contactRequest.delete({
      where: { id }
    });

    return NextResponse.json({ message: 'Contact supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du contact:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la suppression du contact' },
      { status: 500 }
    );
  }
} 