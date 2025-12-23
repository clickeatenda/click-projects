import { NextResponse } from 'next/server';
import { getNotionData } from '@/lib/notion';

export const revalidate = 60; // Cache for 60 seconds

export async function GET() {
    console.log("API: Handling /api/notion/issues request");

    const tokenExists = !!process.env.NOTION_TOKEN;
    const dbIdExists = !!process.env.DATABASE_ID;

    console.log(`API: Environment Check - Token: ${tokenExists}, DB_ID: ${dbIdExists}`);

    try {
        const issues = await getNotionData();
        console.log(`API: Fetched ${issues.length} issues`);

        const response = NextResponse.json(issues);

        // Add debug headers to help diagnose in browser
        response.headers.set('X-Debug-Token-Exists', String(tokenExists));
        response.headers.set('X-Debug-DB-ID-Exists', String(dbIdExists));
        response.headers.set('X-Debug-Count', String(issues.length));

        return response;
    } catch (error) {
        console.error("API: Error fetching issues:", error);
        return NextResponse.json(
            { error: 'Failed to fetch issues' },
            { status: 500 }
        );
    }
}
