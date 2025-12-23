import { Client } from '@notionhq/client';
import { Project, Issue } from '@/types/project';

// Initialize Notion client
const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.DATABASE_ID || '';

export async function getNotionData(): Promise<Issue[]> {
    if (!process.env.NOTION_TOKEN || !DATABASE_ID) {
        console.warn("Notion credentials not found");
        return [];
    }

    try {
        let allResults: any[] = [];
        let hasMore = true;
        let startCursor: string | undefined = undefined;

        while (hasMore) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const response: any = await (notion.databases as any).query({
                database_id: DATABASE_ID,
                start_cursor: startCursor,
                page_size: 100, // Max allowed by Notion API
                sorts: [
                    {
                        property: 'Last edited time',
                        direction: 'descending',
                    },
                ],
            });

            allResults = [...allResults, ...response.results];
            hasMore = response.has_more;
            startCursor = response.next_cursor;
        }

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
                status,
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
