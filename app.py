import streamlit as st
import requests
import pandas as pd
import plotly.graph_objects as go
import base64

# --- Funções auxiliares ---
def get_base64_image(image_path):
    try:
        with open(image_path, "rb") as f:
            return base64.b64encode(f.read()).decode()
    except:
        return None

# --- Configuração da Página ---
st.set_page_config(
    page_title="Click Projects | Dashboard",
    page_icon="public/logo.png",
    layout="wide",
    initial_sidebar_state="collapsed"
)

# --- Estado para filtros ---
if 'filtro_status' not in st.session_state:
    st.session_state.filtro_status = None  # None = sem filtro

# --- CSS Premium ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    :root {
        --background: #151a23;
        --card: #1e242e;
        --primary: #0ea5e9;
        --accent: #8b5cf6;
        --success: #22c55e;
        --warning: #f59e0b;
        --destructive: #ef4444;
        --muted: #64748b;
        --border: #2a3140;
        --foreground: #f1f5f9;
    }
    
    html, body, [class*="css"] { font-family: 'Inter', sans-serif !important; }
    
    .stApp > header { display: none !important; }
    .block-container { padding-top: 1rem !important; padding-bottom: 1rem !important; }
    
    .main-header {
        background: linear-gradient(135deg, var(--card) 0%, var(--background) 100%);
        border: 1px solid var(--border);
        border-radius: 16px;
        padding: 16px 24px;
        margin-bottom: 24px;
        display: flex;
        align-items: center;
        gap: 16px;
    }
    
    .main-header .logo-img { width: 56px; height: 56px; border-radius: 12px; }
    
    .main-header h1 {
        font-size: 26px;
        font-weight: 700;
        margin: 0;
        background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .main-header p { font-size: 13px; color: var(--muted); margin: 2px 0 0 0; }
    
    .section-title { font-size: 16px; font-weight: 600; color: var(--foreground); margin: 24px 0 12px 0; }
    
    .project-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 16px;
        margin-bottom: 12px;
    }
    
    .project-card:hover { border-color: var(--primary); }
    .project-card .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
    .project-card .name { font-size: 15px; font-weight: 600; color: var(--foreground); }
    .project-card .count { background: var(--primary); color: var(--background); padding: 3px 10px; border-radius: 16px; font-size: 13px; font-weight: 600; }
    .project-card .stats { display: flex; gap: 12px; font-size: 12px; color: var(--muted); }
    
    .footer { border-top: 1px solid var(--border); padding: 16px 0; margin-top: 32px; display: flex; justify-content: space-between; color: var(--muted); font-size: 13px; }
    
    #MainMenu, footer, header { visibility: hidden; }
</style>
""", unsafe_allow_html=True)

# --- Credenciais ---
USE_MOCK_DATA = True
try:
    NOTION_TOKEN = st.secrets.get("NOTION_TOKEN", None)
    DATABASE_ID = st.secrets.get("DATABASE_ID", None)
    if NOTION_TOKEN and DATABASE_ID:
        USE_MOCK_DATA = False
except:
    pass

HEADERS = {
    "Authorization": f"Bearer {NOTION_TOKEN}" if not USE_MOCK_DATA else "",
    "Content-Type": "application/json",
    "Notion-Version": "2022-06-28"
}

# --- Função para buscar dados no Notion ---
@st.cache_data(ttl=600)
def get_notion_data():
    if USE_MOCK_DATA:
        return pd.DataFrame({
            'Nome': ['Demo 1', 'Demo 2', 'Demo 3'],
            'Projeto': ['Demo', 'Demo', 'Demo'],
            'Status': ['Aberto', 'Em Andamento', 'Concluído'],
            'Prioridade': ['🟠 Alta', '🟡 Média', '🔵 Baixa'],
            'Categoria': ['WEB', 'WEB', 'WEB']
        })
    
    url = f"https://api.notion.com/v1/databases/{DATABASE_ID}/query"
    results = []
    has_more = True
    start_cursor = None

    while has_more:
        payload = {"start_cursor": start_cursor} if start_cursor else {}
        response = requests.post(url, headers=HEADERS, json=payload)
        if response.status_code != 200:
            st.error(f"Erro na API: {response.status_code}")
            return pd.DataFrame()
        data = response.json()
        results.extend(data["results"])
        has_more = data["has_more"]
        start_cursor = data["next_cursor"]

    rows = []
    for page in results:
        props = page["properties"]
        row = {}
        
        try:
            if 'Nome' in props and props['Nome']['type'] == 'title':
                arr = props['Nome']['title']
                row['Nome'] = arr[0]['text']['content'].strip() if arr else "Sem Título"
            else:
                row['Nome'] = "Sem Título"
        except:
            row['Nome'] = "Sem Título"

        try:
            if 'Projeto' in props:
                p = props['Projeto']
                if p['type'] == 'multi_select' and p['multi_select']:
                    row['Projeto'] = p['multi_select'][0]['name'].strip()
                elif p['type'] == 'select' and p['select']:
                    row['Projeto'] = p['select']['name'].strip()
                else:
                    row['Projeto'] = 'N/A'
            else:
                row['Projeto'] = 'N/A'
        except:
            row['Projeto'] = 'N/A'

        try:
            if 'Status' in props and props['Status']['select']:
                row['Status'] = props['Status']['select']['name'].strip()
            else:
                row['Status'] = 'N/A'
        except:
            row['Status'] = 'N/A'
            
        try:
            if 'Prioridade' in props and props['Prioridade']['select']:
                row['Prioridade'] = props['Prioridade']['select']['name'].strip()
            else:
                row['Prioridade'] = 'N/A'
        except:
            row['Prioridade'] = 'N/A'
            
        try:
            if 'Tipo de Projeto' in props:
                p = props['Tipo de Projeto']
                if p['type'] == 'multi_select' and p['multi_select']:
                    row['Categoria'] = p['multi_select'][0]['name'].strip()
                elif p['type'] == 'select' and p['select']:
                    row['Categoria'] = p['select']['name'].strip()
                else:
                    row['Categoria'] = 'N/A'
            else:
                row['Categoria'] = 'N/A'
        except:
            row['Categoria'] = 'N/A'

        rows.append(row)

    return pd.DataFrame(rows)

def project_card(name, total, aberto, em_prog, concl):
    return f"""
    <div class="project-card">
        <div class="header">
            <span class="name">📁 {name}</span>
            <span class="count">{total}</span>
        </div>
        <div class="stats">
            <span>🟡 Aberto: {aberto}</span>
            <span>🔵 Progresso: {em_prog}</span>
            <span>🟢 Concluído: {concl}</span>
        </div>
    </div>
    """

# === HEADER ===
logo_b64 = get_base64_image("public/logo.png")
if logo_b64:
    st.markdown(f"""<div class="main-header"><img src="data:image/png;base64,{logo_b64}" class="logo-img"><div><h1>Click Projects</h1><p>Dashboard Executivo • Integração Notion</p></div></div>""", unsafe_allow_html=True)
else:
    st.markdown("""<div class="main-header"><div style="font-size:40px">🚀</div><div><h1>Click Projects</h1><p>Dashboard Executivo</p></div></div>""", unsafe_allow_html=True)

# === CARREGAR DADOS ===
df_original = get_notion_data()

if df_original.empty:
    st.warning("⚠️ Nenhum dado encontrado.")
    st.stop()

# === MÉTRICAS GLOBAIS (sempre do df original) ===
total_issues = len(df_original)
total_projetos = df_original['Projeto'].nunique()
abertos = len(df_original[df_original['Status'] == 'Aberto'])
em_andamento = len(df_original[df_original['Status'] == 'Em Andamento'])
concluidos = len(df_original[df_original['Status'] == 'Concluído'])
alta_prio = len(df_original[df_original['Prioridade'].str.contains('Alta', case=False, na=False)])

# === VISÃO GERAL ===
st.markdown('<p class="section-title">📈 Visão Geral</p>', unsafe_allow_html=True)

# Filtro ativo
filtro = st.session_state.filtro_status
if filtro:
    c1, c2 = st.columns([5, 1])
    with c1:
        st.info(f"🔍 **Filtro:** {filtro} | Dados filtrados abaixo")
    with c2:
        if st.button("❌ Limpar", use_container_width=True):
            st.session_state.filtro_status = None
            st.rerun()

# Cards clicáveis
c = st.columns(6)
with c[0]:
    st.metric("📁 Projetos", total_projetos)
with c[1]:
    st.metric("📋 Total", total_issues)
with c[2]:
    if st.button(f"🟡 Abertas: {abertos}", use_container_width=True):
        st.session_state.filtro_status = "Aberto"
        st.rerun()
with c[3]:
    if st.button(f"🔵 Andamento: {em_andamento}", use_container_width=True):
        st.session_state.filtro_status = "Em Andamento"
        st.rerun()
with c[4]:
    if st.button(f"✅ Concluídas: {concluidos}", use_container_width=True):
        st.session_state.filtro_status = "Concluído"
        st.rerun()
with c[5]:
    if st.button(f"🔥 Alta: {alta_prio}", use_container_width=True):
        st.session_state.filtro_status = "Alta"
        st.rerun()

# === APLICAR FILTRO ===
if filtro:
    if filtro == "Alta":
        df = df_original[df_original['Prioridade'].str.contains('Alta', case=False, na=False)]
    else:
        df = df_original[df_original['Status'] == filtro]
else:
    df = df_original

# === GRÁFICOS ===
st.markdown('<p class="section-title">📊 Analytics</p>', unsafe_allow_html=True)
col1, col2 = st.columns(2)

with col1:
    st.caption("Issues por Projeto")
    proj_counts = df['Projeto'].value_counts()
    max_val = proj_counts.max() if len(proj_counts) > 0 else 1
    fig = go.Figure(data=[go.Bar(
        x=proj_counts.index,
        y=proj_counts.values,
        marker_color=['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'][:len(proj_counts)],
        text=proj_counts.values,
        textposition='outside',
        textfont=dict(color='#f1f5f9', size=13),
    )])
    fig.update_layout(
        paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='#f1f5f9'),
        xaxis=dict(showgrid=False, tickfont=dict(color='#94a3b8')),
        yaxis=dict(showgrid=True, gridcolor='#2a3140', tickfont=dict(color='#94a3b8'), range=[0, max_val * 1.2]),
        margin=dict(t=30, b=40, l=40, r=20), height=360
    )
    st.plotly_chart(fig, use_container_width=True)

with col2:
    st.caption("Distribuição por Status")
    status_counts = df['Status'].value_counts()
    colors = {'Aberto': '#f59e0b', 'Em Andamento': '#0ea5e9', 'Concluído': '#22c55e', 'N/A': '#64748b'}
    fig2 = go.Figure(data=[go.Pie(
        labels=status_counts.index,
        values=status_counts.values,
        hole=0.5,
        marker_colors=[colors.get(s, '#64748b') for s in status_counts.index],
        textinfo='label+value',
        textfont=dict(color='#f1f5f9', size=11),
    )])
    fig2.update_layout(
        paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='#f1f5f9'),
        showlegend=True,
        legend=dict(orientation='h', y=-0.1, x=0.5, xanchor='center', font=dict(color='#94a3b8')),
        margin=dict(t=20, b=60, l=20, r=20), height=340
    )
    st.plotly_chart(fig2, use_container_width=True)

# === PROJETOS ===
st.markdown('<p class="section-title">📁 Projetos</p>', unsafe_allow_html=True)
projetos = df.groupby('Projeto').agg({
    'Nome': 'count',
    'Status': lambda x: x.value_counts().to_dict()
}).reset_index()

cols = st.columns(2)
for idx, (_, row) in enumerate(projetos.iterrows()):
    sc = row['Status'] if isinstance(row['Status'], dict) else {}
    with cols[idx % 2]:
        st.markdown(project_card(row['Projeto'], row['Nome'], sc.get('Aberto', 0), sc.get('Em Andamento', 0), sc.get('Concluído', 0)), unsafe_allow_html=True)

# === TABELA ===
st.markdown('<p class="section-title">📋 Detalhes</p>', unsafe_allow_html=True)

# Filtros manuais
c1, c2, c3 = st.columns(3)
with c1:
    fp = st.multiselect("Projeto", options=df["Projeto"].unique())
with c2:
    fs = st.multiselect("Status", options=df["Status"].unique())
with c3:
    fpr = st.multiselect("Prioridade", options=df["Prioridade"].unique())

df_table = df.copy()
if fp: df_table = df_table[df_table["Projeto"].isin(fp)]
if fs: df_table = df_table[df_table["Status"].isin(fs)]
if fpr: df_table = df_table[df_table["Prioridade"].isin(fpr)]

st.dataframe(df_table, use_container_width=True, hide_index=True)

# === FOOTER ===
st.markdown('<div class="footer"><span>© 2025 Click Projects</span><span>Notion + Streamlit</span></div>', unsafe_allow_html=True)

# === SIDEBAR ===
with st.sidebar:
    st.markdown("### ⚙️")
    if USE_MOCK_DATA:
        st.info("Modo Demo")
    else:
        st.success("✅ Conectado")
    if st.button("🔄 Atualizar"):
        st.cache_data.clear()
        st.rerun()
