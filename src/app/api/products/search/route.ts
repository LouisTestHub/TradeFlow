import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    const type = searchParams.get('type');
    const limit = parseInt(searchParams.get('limit') || '20');

    if (q.length < 1) {
      // Return recently used / popular products
      const products = await prisma.pppProduct.findMany({
        take: limit,
        orderBy: { name: 'asc' },
      });
      return NextResponse.json({ products });
    }

    const where: Record<string, unknown> = {
      OR: [
        { name: { contains: q } },
        { activeIngredient: { contains: q } },
        { mapp: { contains: q } },
        { manufacturer: { contains: q } },
      ],
    };

    if (type) {
      // Filter by product type based on common naming conventions
      const typeMap: Record<string, string[]> = {
        herbicide: ['Glyphosate', 'Fluroxypyr', 'Pendimethalin', 'Mesosulfuron', 'Pinoxaden', 'Propyzamide', 'Clodinafop', 'Diflufenican', 'Flufenacet', 'Prosulfocarb', 'Chlorotoluron', 'Metribuzin', 'Nicosulfuron', 'Clomazone', 'Clethodim', 'Thifensulfuron', 'Metsulfuron', 'Aminopyralid', 'Halauxifen', 'Florasulam', 'Isoproturon', 'Tri-allate', 'Carfentrazone', 'Picolinafen'],
        fungicide: ['Prothioconazole', 'Azoxystrobin', 'Mefentrifluconazole', 'Fluxapyroxad', 'Tebuconazole', 'Chlorothalonil', 'Epoxiconazole', 'Bixafen', 'Benzovindiflupyr', 'Boscalid', 'Pyraclostrobin', 'Mancozeb', 'Dimethomorph', 'Fluazinam', 'Fluopyram'],
        insecticide: ['Lambda-cyhalothrin', 'Pymetrozine', 'Flonicamid', 'Spirotetramat'],
        'growth regulator': ['Trinexapac-ethyl'],
        molluscicide: ['Metaldehyde'],
      };

      if (typeMap[type]) {
        where.activeIngredient = {
          contains: typeMap[type][0],
        };
      }
    }

    const products = await prisma.pppProduct.findMany({
      where,
      take: limit,
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error('Product search error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
