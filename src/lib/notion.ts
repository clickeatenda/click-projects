// Replace Client import with fetch implementation
// import { Client } from '@notionhq/client';
import { Issue } from '@/types/project';

const DATABASE_ID = process.env.DATABASE_ID || '';
const NOTION_TOKEN = process.env.NOTION_TOKEN || '';

export async function getNotionData(): Promise<Issue[]> {
    if (!NOTION_TOKEN || !DATABASE_ID) {
        console.warn("Notion credentials not found");
        return [];
    }

    try {
        let allResults: any[] = [];
        let hasMore = true;
        let startCursor: string | undefined = undefined;

        console.log(`Notion Fetch: Starting for DB ${DATABASE_ID}`);

        while (hasMore) {
            const payload: any = {
                page_size: 100,
                sorts: [
                    {
                        property: 'Last edited time',
                        direction: 'descending',
                    },
                ],
            };

            if (startCursor) {
                payload.start_cursor = startCursor;
            }

            const response = await fetch(`https://api.notion.com/v1/databases/${DATABASE_ID}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${NOTION_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28',
                },
                body: JSON.stringify(payload),
                next: { revalidate: 60 } // Native Next.js cache
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Notion API Error: ${response.status} ${response.statusText} - ${errorText}`);
            }

            const data = await response.json();

            allResults = [...allResults, ...data.results];
            hasMore = data.has_more;
            startCursor = data.next_cursor;
        }

        console.log(`Notion Fetch: Success, ${allResults.length} items found.`);

        const issues: Issue[] = allResults.map((page: any) => {
            const props = page.properties;

            // Extract properties safely
            const name = props['Nome']?.title?.[0]?.text?.content || 'Sem Título';
            const project = props['Projeto']?.select?.name || props['Projeto']?.multi_select?.[0]?.name || 'Sem Projeto';
            const status = props['Status']?.select?.name || 'Aberto';
            const priority = props['Prioridade']?.select?.name || 'Média';
            const type = props['Tipo']?.select?.name || props['Tipo de Projeto']?.select?.name || props['Tipo de Projeto']?.multi_select?.[0]?.name || 'Tarefa';
            const createdAt = page.created_time;
            const updatedAt = page.last_edited_time;

            const tags = props['Tags']?.multi_select?.map((t: any) => t.name) || [];

            return {
                id: page.id,
                title: name,
                project,
                status: mapStatus(status),
                priority: mapPriority(priority),
                type,
                tags,
                createdAt,
                updatedAt
            };
        });

        return issues;

    } catch (error) {
        console.error("Error fetching Notion data:", error);
        return [];
    }
}

function mapPriority(p: string): 'Baixa' | 'Média' | 'Alta' | 'Urgente' {
    if (p.includes('Urgente')) return 'Urgente';
    if (p.includes('Alta')) return 'Alta';
    if (p.includes('Baixa')) return 'Baixa';
    return 'Média';
}

function mapStatus(s: string): 'Aberto' | 'Em Progresso' | 'Concluído' | 'Bloqueado' {
    const lower = s.toLowerCase();
    if (lower.includes('done') || lower.includes('conclu')) return 'Concluído';
    if (lower.includes('andamento') || lower.includes('progresso')) return 'Em Progresso';
    if (lower.includes('bloqueado')) return 'Bloqueado';
    return 'Aberto';
}
