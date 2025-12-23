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
    st.session_state.filtro_status = None
if 'filtro_projeto' not in st.session_state:
    st.session_state.filtro_projeto = None
if 'filtro_prioridade' not in st.session_state:
    st.session_state.filtro_prioridade = None

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
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 16px;
    }
    
    .main-header .logo-img { width: 50px; height: 50px; border-radius: 10px; }
    
    .main-header h1 {
        font-size: 24px;
        font-weight: 700;
        margin: 0;
        background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .main-header p { font-size: 12px; color: var(--muted); margin: 2px 0 0 0; }
    
    .section-title { font-size: 15px; font-weight: 600; color: var(--foreground); margin: 20px 0 10px 0; }
    
    .project-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 14px;
        margin-bottom: 10px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .project-card:hover { border-color: var(--primary); transform: translateY(-2px); }
    .project-card .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
    .project-card .name { font-size: 14px; font-weight: 600; color: var(--foreground); }
    .project-card .count { background: var(--primary); color: var(--background); padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; }
    .project-card .stats { display: flex; gap: 10px; font-size: 11px; color: var(--muted); }
    
    .closed-issue {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 10px 14px;
        margin-bottom: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .closed-issue .icon { color: var(--success); font-size: 16px; }
    .closed-issue .title { color: var(--foreground); font-size: 13px; flex: 1; }
    .closed-issue .project { color: var(--muted); font-size: 11px; background: var(--border); padding: 2px 8px; border-radius: 10px; }
    
    .filter-box {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 12px 16px;
        margin-bottom: 16px;
    }
    
    .footer { border-top: 1px solid var(--border); padding: 12px 0; margin-top: 24px; display: flex; justify-content: space-between; color: var(--muted); font-size: 12px; }
    
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
            'Nome': ['Demo 1', 'Demo 2', 'Demo 3', 'Demo 4', 'Demo 5'],
            'Projeto': ['Projeto A', 'Projeto A', 'Projeto B', 'Projeto B', 'Projeto C'],
            'Status': ['Aberto', 'Em Andamento', 'Concluído', 'Concluído', 'Aberto'],
            'Prioridade': ['🟠 Alta', '🟡 Média', '🔵 Baixa', '🟠 Alta', '🟡 Média'],
            'Categoria': ['WEB', 'WEB', 'Mobile', 'Mobile', 'WEB']
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
        except:
            row['Categoria'] = 'N/A'

        # Extrair data de atualização para ordenar issues recentes
        # Usar last_edited_time do registro para ordenar
        try:
            row['Atualizado'] = page.get('last_edited_time', '')
        except:
            row['Atualizado'] = ''

        rows.append(row)

    return pd.DataFrame(rows)

def project_card(name, total, aberto, em_prog, concl, alta, urgente):
    return f"""
    <div class="project-card">
        <div class="header">
            <span class="name">📁 {name}</span>
            <span class="count">{total}</span>
        </div>
        <div class="stats">
            <span>🟡 {aberto}</span>
            <span>🔵 {em_prog}</span>
            <span>🟢 {concl}</span>
            <span>🟠 {alta}</span>
            <span>🔴 {urgente}</span>
        </div>
    </div>
    """

def closed_issue_card(nome, projeto):
    return f"""
    <div class="closed-issue">
        <span class="icon">✅</span>
        <span class="title">{nome[:50]}{'...' if len(nome) > 50 else ''}</span>
        <span class="project">{projeto}</span>
    </div>
    """

def get_status_color(s):
    """Retorna cor baseada no status (case-insensitive)"""
    s_lower = s.lower()
    if 'aberto' in s_lower: return '#f59e0b'
    elif 'andamento' in s_lower: return '#0ea5e9'
    elif 'conclu' in s_lower: return '#22c55e'
    else: return '#64748b'

# === HEADER ===
logo_b64 = get_base64_image("public/logo.png")
if logo_b64:
    st.markdown(f"""<div class="main-header"><img src="data:image/png;base64,{logo_b64}" class="logo-img"><div><h1>Click Projects</h1><p>Dashboard Executivo • Integração Notion</p></div></div>""", unsafe_allow_html=True)
else:
    st.markdown("""<div class="main-header"><div style="font-size:36px">🚀</div><div><h1>Click Projects</h1><p>Dashboard Executivo</p></div></div>""", unsafe_allow_html=True)

# === CARREGAR DADOS ===
df_original = get_notion_data()

if df_original.empty:
    st.warning("⚠️ Nenhum dado encontrado.")
    st.stop()

# === FILTROS SUPERIORES ===
st.markdown('<div class="filter-box">', unsafe_allow_html=True)
fc1, fc2, fc3, fc4 = st.columns([2.5, 2.5, 2.5, 0.5])

with fc1:
    projeto_selecionado = st.selectbox(
        "📁 Projeto",
        options=["Todos"] + list(df_original['Projeto'].unique()),
        index=0
    )

with fc2:
    status_selecionado = st.selectbox(
        "📊 Status",
        options=["Todos"] + list(df_original['Status'].unique()),
        index=0
    )

with fc3:
    prioridade_selecionada = st.selectbox(
        "🎯 Prioridade",
        options=["Todos"] + list(df_original['Prioridade'].unique()),
        index=0
    )

with fc4:
    # Usar selectbox invísivel para alinhar com outros campos
    st.selectbox("​", options=["🔄"], key="btn_refresh", label_visibility="hidden", on_change=lambda: (st.cache_data.clear(), st.rerun()))

st.markdown('</div>', unsafe_allow_html=True)

# === APLICAR FILTROS ===
df = df_original.copy()
if projeto_selecionado != "Todos":
    df = df[df['Projeto'] == projeto_selecionado]
if status_selecionado != "Todos":
    df = df[df['Status'] == status_selecionado]
if prioridade_selecionada != "Todos":
    df = df[df['Prioridade'] == prioridade_selecionada]

# === MÉTRICAS (usando str.contains para case-insensitive) ===
total_issues = len(df)
total_projetos = df['Projeto'].nunique()
abertos = len(df[df['Status'].str.contains('Aberto', case=False, na=False)])
em_andamento = len(df[df['Status'].str.contains('andamento', case=False, na=False)])
concluidos = len(df[df['Status'].str.contains('Conclu', case=False, na=False)])
alta_prio = len(df[df['Prioridade'].str.contains('Alta', case=False, na=False)])
urgente_prio = len(df[df['Prioridade'].str.contains('Urgente', case=False, na=False)])

st.markdown('<p class="section-title">📈 Métricas</p>', unsafe_allow_html=True)
m1, m2, m3, m4, m5, m6, m7 = st.columns(7)
m1.metric("📁 Projetos", total_projetos)
m2.metric("📋 Total", total_issues)
m3.metric("🟡 Abertas", abertos)
m4.metric("🔵 Andamento", em_andamento)
m5.metric("✅ Concluídas", concluidos)
m6.metric("🟠 Alta", alta_prio)
m7.metric("🔴 Urgente", urgente_prio)

# === LAYOUT PRINCIPAL ===
col_left, col_right = st.columns([2, 1])

with col_left:
    # === GRÁFICOS ===
    st.markdown('<p class="section-title">📊 Analytics</p>', unsafe_allow_html=True)
    
    g1, g2 = st.columns(2)
    
    with g1:
        st.caption("Issues por Projeto")
        proj_counts = df['Projeto'].value_counts()
        max_val = proj_counts.max() if len(proj_counts) > 0 else 1
        fig = go.Figure(data=[go.Bar(
            x=proj_counts.index,
            y=proj_counts.values,
            marker_color=['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'][:len(proj_counts)],
            text=proj_counts.values,
            textposition='outside',
            textfont=dict(color='#f1f5f9', size=12),
        )])
        fig.update_layout(
            paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='#f1f5f9'),
            xaxis=dict(showgrid=False, tickfont=dict(color='#94a3b8', size=10)),
            yaxis=dict(showgrid=True, gridcolor='#2a3140', tickfont=dict(color='#94a3b8'), range=[0, max_val * 1.25]),
            margin=dict(t=30, b=30, l=30, r=10), height=280
        )
        st.plotly_chart(fig, use_container_width=True)
    
    with g2:
        st.caption("Distribuição por Status")
        status_counts = df['Status'].value_counts()
        
        fig2 = go.Figure(data=[go.Pie(
            labels=status_counts.index,
            values=status_counts.values,
            hole=0.5,
            marker_colors=[get_status_color(s) for s in status_counts.index],
            textinfo='label+value',
            textfont=dict(color='#f1f5f9', size=10),
        )])
        fig2.update_layout(
            paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='#f1f5f9'),
            showlegend=False,
            margin=dict(t=20, b=20, l=20, r=20), height=250
        )
        st.plotly_chart(fig2, use_container_width=True)
    
    # === GRÁFICO DE PROGRESSO POR PROJETO ===
    st.caption("Progresso por Projeto")
    
    # Calcular % de conclusão por projeto
    proj_progress = df_original.groupby('Projeto').apply(
        lambda x: round(len(x[x['Status'].str.contains('Conclu', case=False, na=False)]) / len(x) * 100, 1) if len(x) > 0 else 0
    ).sort_values(ascending=True)
    
    fig3 = go.Figure(data=[go.Bar(
        y=proj_progress.index,
        x=proj_progress.values,
        orientation='h',
        marker_color=['#22c55e' if v >= 70 else '#0ea5e9' if v >= 40 else '#f59e0b' for v in proj_progress.values],
        text=[f'{v}%' for v in proj_progress.values],
        textposition='outside',
        textfont=dict(color='#f1f5f9', size=11),
    )])
    fig3.update_layout(
        paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
        font=dict(color='#f1f5f9'),
        xaxis=dict(showgrid=True, gridcolor='#2a3140', tickfont=dict(color='#94a3b8'), range=[0, 110]),
        yaxis=dict(showgrid=False, tickfont=dict(color='#94a3b8', size=10)),
        margin=dict(t=10, b=20, l=10, r=30), height=180
    )
    st.plotly_chart(fig3, use_container_width=True)

    # === PROJETOS ===
    st.markdown('<p class="section-title">📁 Projetos (clique para detalhes)</p>', unsafe_allow_html=True)
    
    # Calcular stats por projeto com case-insensitive
    for proj in df_original['Projeto'].unique():
        subset = df_original[df_original['Projeto'] == proj]
        total = len(subset)
        abertos = len(subset[subset['Status'].str.contains('Aberto', case=False, na=False)])
        em_andamento = len(subset[subset['Status'].str.contains('andamento', case=False, na=False)])
        concluidos = len(subset[subset['Status'].str.contains('Conclu', case=False, na=False)])
        alta = len(subset[subset['Prioridade'].str.contains('Alta', case=False, na=False)])
        urgente = len(subset[subset['Prioridade'].str.contains('Urgente', case=False, na=False)])
        pct_concluido = round(concluidos / total * 100, 1) if total > 0 else 0
        
        with st.expander(f"📁 **{proj}** — {total} issues ({pct_concluido}% concluído)"):
            # Métricas do projeto
            m1, m2, m3, m4, m5 = st.columns(5)
            m1.metric("🟡 Abertas", abertos)
            m2.metric("🔵 Andamento", em_andamento)
            m3.metric("🟢 Concluídas", concluidos)
            m4.metric("🟠 Alta", alta)
            m5.metric("🔴 Urgente", urgente)
            
            # Gráficos do projeto
            g1, g2 = st.columns(2)
            
            with g1:
                # Gráfico de pizza - Status do projeto
                status_proj = subset['Status'].value_counts()
                fig_proj = go.Figure(data=[go.Pie(
                    labels=status_proj.index,
                    values=status_proj.values,
                    hole=0.4,
                    marker_colors=[get_status_color(s) for s in status_proj.index],
                    textinfo='label+value',
                    textfont=dict(size=10)
                )])
                fig_proj.update_layout(
                    title=dict(text="Status", font=dict(size=12, color='#f1f5f9')),
                    paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
                    font=dict(color='#f1f5f9'),
                    showlegend=False,
                    margin=dict(t=30, b=10, l=10, r=10), height=200
                )
                st.plotly_chart(fig_proj, use_container_width=True)
            
            with g2:
                # Gráfico de barras - Prioridade do projeto
                prio_proj = subset['Prioridade'].value_counts()
                fig_prio = go.Figure(data=[go.Bar(
                    x=prio_proj.index,
                    y=prio_proj.values,
                    marker_color=['#ef4444' if 'Urgente' in p else '#f59e0b' if 'Alta' in p else '#0ea5e9' if 'Média' in p else '#22c55e' for p in prio_proj.index],
                    text=prio_proj.values,
                    textposition='outside',
                    textfont=dict(size=10)
                )])
                fig_prio.update_layout(
                    title=dict(text="Prioridade", font=dict(size=12, color='#f1f5f9')),
                    paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
                    font=dict(color='#f1f5f9'),
                    xaxis=dict(showgrid=False, tickfont=dict(size=9, color='#94a3b8')),
                    yaxis=dict(showgrid=True, gridcolor='#2a3140', tickfont=dict(color='#94a3b8')),
                    margin=dict(t=30, b=30, l=30, r=10), height=200
                )
                st.plotly_chart(fig_prio, use_container_width=True)
            
            # Lista das últimas 5 issues do projeto
            st.caption("📋 Últimas issues do projeto:")
            df_proj = subset.sort_values('Atualizado', ascending=False).head(5)
            st.dataframe(
                df_proj[['Nome', 'Status', 'Prioridade', 'Atualizado']],
                use_container_width=True,
                hide_index=True,
                column_config={
                    "Nome": st.column_config.TextColumn("Issue", width="large"),
                    "Status": st.column_config.TextColumn("Status"),
                    "Prioridade": st.column_config.TextColumn("Prioridade"),
                    "Atualizado": st.column_config.TextColumn("Atualizado"),
                }
            )

with col_right:
    # === ISSUES FECHADAS RECENTEMENTE ===
    st.markdown('<p class="section-title">✅ Recém Concluídas</p>', unsafe_allow_html=True)
    
    # Filtrar concluídas e ordenar por data mais recente
    df_closed = df_original[df_original['Status'].str.contains('Conclu', case=False, na=False)].copy()
    if 'Atualizado' in df_closed.columns:
        df_closed = df_closed.sort_values('Atualizado', ascending=False)
    df_closed = df_closed.head(6)
    
    if len(df_closed) > 0:
        for _, row in df_closed.iterrows():
            st.markdown(closed_issue_card(row['Nome'], row['Projeto']), unsafe_allow_html=True)
    else:
        st.info("Nenhuma issue concluída ainda.")

# === TABELA COMPLETA ===
st.markdown('<p class="section-title">📋 Todas as Issues</p>', unsafe_allow_html=True)

# Ordenar por data de atualização (mais recentes primeiro)
df_sorted = df.sort_values('Atualizado', ascending=False)

st.dataframe(
    df_sorted,
    use_container_width=True,
    hide_index=True,
    column_config={
        "Nome": st.column_config.TextColumn("📝 Issue", width="large"),
        "Projeto": st.column_config.TextColumn("📁 Projeto"),
        "Status": st.column_config.TextColumn("📊 Status"),
        "Prioridade": st.column_config.TextColumn("🎯 Prioridade"),
        "Categoria": st.column_config.TextColumn("🏷️ Categoria"),
        "Atualizado": st.column_config.TextColumn("📅 Atualizado"),
    }
)

# === FOOTER ===
st.markdown('<div class="footer"><span>© 2025 Click Projects</span><span>Notion + Streamlit</span></div>', unsafe_allow_html=True)

# === SIDEBAR ===
with st.sidebar:
    st.markdown("### ⚙️ Configurações")
    if USE_MOCK_DATA:
        st.info("🔧 Modo Demo")
    else:
        st.success("✅ Conectado ao Notion")
    
    st.markdown("---")
    st.caption("Filtros ativos:")
    if projeto_selecionado != "Todos":
        st.write(f"📁 {projeto_selecionado}")
    if status_selecionado != "Todos":
        st.write(f"📊 {status_selecionado}")
    if prioridade_selecionada != "Todos":
        st.write(f"🎯 {prioridade_selecionada}")
