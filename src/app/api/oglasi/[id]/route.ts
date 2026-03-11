import { NextRequest, NextResponse } from 'next/server';
import { oglasController } from '@/app/controllers/oglasController';
import { requireAuth } from '@/lib/authMiddleware';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = req.cookies.get('auth')?.value;
    const user = requireAuth(token, ['TUTOR', 'ADMIN']);
    if ('error' in user) return NextResponse.json(user, { status: 401 });

    const { id: idStr } = await params;
    const id = Number(idStr);
    if (!id) return NextResponse.json({ error: 'ID nije validan' }, { status: 400 });

    const isAdmin = user.uloga === 'ADMIN';
    console.log('DELETE oglas - user.id:', user.id, 'oglasId:', id, 'isAdmin:', isAdmin);
    const result = await oglasController.delete(id, user.id, isAdmin);
    console.log('DELETE oglas - result:', result);
    return NextResponse.json(result, { status: 200 });
  } catch (err: any) {
    console.error('DELETE oglas - error:', err.message);
    return NextResponse.json(
      { error: err.message || 'Greška pri brisanju oglasa' },
      { status: 500 }
    );
  }
}
