import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer toutes les catégories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isActive = searchParams.get('isActive');
    const withProducts = searchParams.get('withProducts');

    const whereClause: {
      isActive?: boolean;
      slug?: string;
    } = {};
    
    if (isActive !== null) {
      whereClause.isActive = isActive === 'true';
    }

    const includeProducts = withProducts === 'true' ? {
      products: {
        where: { isActive: true },
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
          price: true
        }
      }
    } : undefined;

    const categories = await prisma.category.findMany({
      where: whereClause,
      include: includeProducts,
      orderBy: {
        name: 'asc'
      }
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Erreur lors de la récupération des catégories:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des catégories' },
      { status: 500 }
    );
  }
}

// POST - Créer une nouvelle catégorie
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, description, imageUrl } = body;

    // Vérifier que le nom et le slug sont uniques
    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { name },
          { slug }
        ]
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Une catégorie avec ce nom ou ce slug existe déjà' },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        imageUrl,
        isActive: true
      }
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création de la catégorie:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création de la catégorie' },
      { status: 500 }
    );
  }
} 