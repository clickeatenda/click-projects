import streamlit as st
import requests
import pandas as pd
import plotly.express as px

# --- Configuração da Página ---
st.set_page_config(page_title="Dashboard Notion", layout="wide")

# --- Credenciais (Pegamos dos Secrets para segurança) ---
# Se rodar local, crie uma pasta .streamlit e um arquivo secrets.toml dentro
NOTION_TOKEN = st.secrets["NOTION_TOKEN"]
DATABASE_ID = st.secrets["DATABASE_ID"]

HEADERS = {
    "Authorization": "Bearer " + NOTION_TOKEN,
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28"
}

# --- Função para buscar dados no Notion ---
@st.cache_data(ttl=600) # Cache por 10 min para não estourar limite da API
def get_notion_data():
    url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"
    results = []
    has_more = True
    start_cursor = None

    # Paginação (caso tenha mais de 100 itens)
    while has_more:
        payload = {"start_cursor": start_cursor} if start_cursor else {}
        response = requests.post(url, headers=HEADERS, json=payload)
        
        if response.status_code != 200:
            st.error(f"Erro na API: {response.status_code} - {response.text}")
            return pd.DataFrame()

        data = response.json()
        results.extend(data["results"])
        has_more = data["has_more"]
        start_cursor = data["next_cursor"]

    # --- Processamento dos Dados (A Parte Chata do Notion) ---
    # O Notion retorna um JSON aninhado complexo. Aqui simplificamos.
    processed_rows = []
    for page in results:
        props = page["properties"]
        row = {}
        
        # ADAPTAR AQUI: Use os nomes EXATOS das colunas do seu Notion
        # Exemplo para 'Name' (Title), 'Status' (Select) e 'Prioridade' (Select)
        
        # 1. Título (Geralmente chama 'Name' ou 'Nome')
        try:
            title_key = [k for k, v in props.items() if v['type'] == 'title'][0]
            row['Nome'] = props[title_key]['title'][0]['text']['content']
        except:
            row['Nome'] = "Sem Título"

        # 2. Status (Select)
        # Substitua 'Status' pelo nome exato da sua coluna no Notion
        if 'Status' in props and props['Status']['select']:
            row['Status'] = props['Status']['select']['name']
        else:
            row['Status'] = 'N/A'
            
        # 3. Prioridade (Select)
        if 'Prioridade' in props and props['Prioridade']['select']:
            row['Prioridade'] = props['Prioridade']['select']['name']
        else:
            row['Prioridade'] = 'N/A'

        processed_rows.append(row)

    return pd.DataFrame(processed_rows)

# --- Interface do Dashboard ---
st.title("📊 Dashboard Notion em Tempo Real")

df = get_notion_data()

if not df.empty:
    # Métricas no topo
    col1, col2 = st.columns(2)
    col1.metric("Total de Projetos", len(df))
    
    # Gráfico 1: Status (Pizza/Donut)
    fig_status = px.pie(df, names='Status', title='Distribuição por Status', hole=0.4)
    
    # Gráfico 2: Prioridade (Barras)
    fig_prio = px.bar(df, x='Prioridade', title='Contagem por Prioridade', color='Prioridade')

    col1, col2 = st.columns(2)
    col1.plotly_chart(fig_status, use_container_width=True)
    col2.plotly_chart(fig_prio, use_container_width=True)
    
    # Tabela de Dados Brutos (Opcional)
    with st.expander("Ver dados brutos"):
        st.dataframe(df)
else:
    st.warning("Nenhum dado encontrado ou erro na conexão.")
    
    st.divider()
st.subheader("📋 Detalhes dos Projetos")

# Filtros rápidos
filtro_status = st.multiselect("Filtrar por Status", options=df["Status"].unique())
if filtro_status:
    df_view = df[df["Status"].isin(filtro_status)]
else:
    df_view = df

# Exibe a tabela interativa (dá para ordenar e buscar)
st.dataframe(
    df_view,
    use_container_width=True,
    hide_index=True,
    column_config={
        "Nome": st.column_config.TextColumn("Projeto", width="medium"),
        "Status": st.column_config.SelectboxColumn("Status", width="small"),
        "Prioridade": st.column_config.TextColumn("Prioridade", width="small"),
    }
)