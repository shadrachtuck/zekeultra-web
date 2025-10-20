import { NextResponse } from 'next/server';

export async function GET() {
  return new NextResponse('acct_1OFoX4AmL1rpru9E', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
