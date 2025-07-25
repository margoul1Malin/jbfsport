import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Récupérer tous les produits
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isPromo = searchParams.get('isPromo');
    const isActive = searchParams.get('isActive');
    const category = searchParams.get('category');

    const whereClause: {
      isPromo?: boolean;
      isActive?: boolean;
      categoryId?: string;
    } = {};
    
    if (isPromo !== null) {
      whereClause.isPromo = isPromo === 'true';
    }
    
    if (isActive !== null) {
      whereClause.isActive = isActive === 'true';
    }
    
    if (category) {
      whereClause.categoryId = category;
    }

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Erreur lors de la récupération des produits:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des produits' },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau produit
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      content,
      price,
      imageUrl,
      cloudinaryId,
      isPromo,
      isActive,
      categoryId,
      slug
    } = body;

    // Vérifier que le slug est unique
    const existingProduct = await prisma.product.findUnique({
      where: { slug }
    });

    if (existingProduct) {
      return NextResponse.json(
        { error: 'Ce slug existe déjà' },
        { status: 400 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        content,
        price: parseFloat(price),
        imageUrl,
        cloudinaryId,
        isPromo: Boolean(isPromo),
        isActive: Boolean(isActive !== undefined ? isActive : true),
        categoryId: categoryId || null,
        slug
      },
      include: {
        category: true
      }
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Erreur lors de la création du produit:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la création du produit' },
      { status: 500 }
    );
  }
} 