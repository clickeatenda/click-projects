import requests

import os

HEADERS = {'Authorization': f"Bearer {os.environ.get('NOTION_TOKEN', '')}", 
           'Content-Type': 'application/json', 
           'Notion-Version': '2022-06-28'}

url = 'https://api.notion.com/v1/databases/2cfb6301b3ab8003bbcbf3bf88a33078/query'
results = []
has_more = True
start_cursor = None

while has_more:
    payload = {'start_cursor': start_cursor} if start_cursor else {}
    r = requests.post(url, headers=HEADERS, json=payload)
    data = r.json()
    results.extend(data['results'])
    has_more = data['has_more']
    start_cursor = data.get('next_cursor')

# Filtrar concluídas e ordenar por last_edited_time
concluidas = []
for p in results:
    try:
        status = p['properties']['Status']['select']['name']
        if 'conclu' in status.lower():
            nome = p['properties']['Nome']['title'][0]['text']['content'][:40]
            edit_time = p['last_edited_time']
            concluidas.append({'nome': nome, 'data': edit_time})
    except: pass

# Ordenar por data mais recente
concluidas.sort(key=lambda x: x['data'], reverse=True)

print('6 MAIS RECENTES CONCLUÍDAS:')
for c in concluidas[:6]:
    print(f"{c['data'][:16]} - {c['nome']}")
