import { NextResponse } from 'next/server';
import { getNotionData } from '@/lib/notion';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
    try {
        const issues = await getNotionData();
        return NextResponse.json(issues);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch issues' },
            { status: 500 }
        );
    }
}
