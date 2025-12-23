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

# --- CSS Premium (Design Lovable) ---
st.markdown("""
<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    :root {
        --background: #0f1419;
        --card: #1a1f2e;
        --card-hover: #242938;
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
    .block-container { padding-top: 0.5rem !important; padding-bottom: 1rem !important; max-width: 1400px; }
    
    .main-header {
        background: linear-gradient(135deg, var(--card) 0%, var(--background) 100%);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 12px 20px;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .header-left { display: flex; align-items: center; gap: 12px; }
    .logo-img { width: 40px; height: 40px; border-radius: 8px; }
    .header-title { font-size: 18px; font-weight: 700; color: var(--foreground); margin: 0; }
    .header-subtitle { font-size: 11px; color: var(--muted); margin: 0; }
    
    .section-title { font-size: 14px; font-weight: 600; color: var(--foreground); margin: 16px 0 8px 0; }
    
    /* Stats Cards */
    .stats-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 12px 16px;
        text-align: center;
    }
    .stats-card .value { font-size: 24px; font-weight: 700; color: var(--foreground); margin: 0; }
    .stats-card .label { font-size: 11px; color: var(--muted); margin-top: 2px; }
    
    /* Project Card - Lovable Style */
    .project-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 12px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.3s;
    }
    .project-card:hover { 
        border-color: rgba(14, 165, 233, 0.5); 
        box-shadow: 0 10px 25px -5px rgba(14, 165, 233, 0.1);
    }
    .project-card .header { display: flex; align-items: flex-start; justify-content: space-between; }
    .project-card .icon-box { 
        width: 40px; height: 40px; border-radius: 8px; 
        display: flex; align-items: center; justify-content: center;
        font-size: 18px;
    }
    .project-card .title-section { display: flex; align-items: center; gap: 12px; }
    .project-card .name { font-size: 15px; font-weight: 600; color: var(--foreground); }
    .project-card .count { font-size: 12px; color: var(--muted); }
    .project-card .chevron { color: var(--muted); transition: transform 0.2s; }
    .project-card:hover .chevron { transform: translateX(4px); color: var(--primary); }
    .project-card .progress-section { margin-top: 16px; }
    .project-card .progress-label { display: flex; justify-content: space-between; font-size: 12px; color: var(--muted); margin-bottom: 6px; }
    .project-card .progress-bar { height: 8px; background: var(--border); border-radius: 4px; overflow: hidden; }
    .project-card .progress-fill { height: 100%; background: linear-gradient(90deg, var(--primary), var(--accent)); border-radius: 4px; transition: width 0.5s; }
    .project-card .badges { display: flex; gap: 8px; margin-top: 12px; }
    .project-card .badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 500; }
    .badge-success { background: rgba(34, 197, 94, 0.15); color: #22c55e; }
    .badge-outline { background: transparent; border: 1px solid var(--border); color: var(--muted); }
    
    /* Issue Card (Micro View) */
    .issue-card {
        background: var(--card);
        border: 1px solid var(--border);
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 8px;
    }
    .issue-card .title { font-size: 13px; font-weight: 500; color: var(--foreground); margin-bottom: 6px; }
    .issue-card .meta { font-size: 10px; color: var(--muted); display: flex; gap: 8px; align-items: center; }
    .issue-card .label { font-size: 9px; padding: 2px 6px; border-radius: 4px; font-weight: 500; }
    .label-tarefa { background: #3b82f6; color: white; }
    .label-feature { background: #8b5cf6; color: white; }
    .label-bug { background: #ef4444; color: white; }
    .label-melhoria { background: #f59e0b; color: black; }
    
    .footer { border-top: 1px solid var(--border); padding: 12px 0; margin-top: 20px; text-align: center; color: var(--muted); font-size: 11px; }
    
    #MainMenu, footer, header { visibility: hidden; }
    
    /* Tab styling */
    .stTabs [data-baseweb="tab-list"] { gap: 4px; }
    .stTabs [data-baseweb="tab"] { 
        background: var(--card); 
        border: 1px solid var(--border); 
        border-radius: 6px; 
        padding: 8px 16px;
        color: var(--foreground);
    }
    .stTabs [aria-selected="true"] { 
        background: var(--primary) !important; 
        border-color: var(--primary) !important;
    }
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
@st.cache_data(ttl=60)
def get_notion_data():
    if USE_MOCK_DATA:
        return pd.DataFrame({
            'Nome': ['Issue Demo 1', 'Issue Demo 2', 'Issue Demo 3'],
            'Projeto': ['Projeto A', 'Projeto A', 'Projeto B'],
            'Status': ['Aberto', 'Em andamento', 'Concluído'],
            'Prioridade': ['🟠 Alta', '🟡 Média', '🔵 Baixa'],
            'Categoria': ['Tarefa', 'Feature', 'Bug'],
            'Criado': ['2025-12-20', '2025-12-21', '2025-12-22'],
            'Atualizado': ['2025-12-23', '2025-12-23', '2025-12-23']
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
        
        # Nome
        try:
            if 'Nome' in props and props['Nome']['type'] == 'title':
                arr = props['Nome']['title']
                row['Nome'] = arr[0]['text']['content'].strip() if arr else "Sem Título"
            else:
                row['Nome'] = "Sem Título"
        except:
            row['Nome'] = "Sem Título"

        # Projeto
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

        # Status
        try:
            if 'Status' in props and props['Status']['select']:
                row['Status'] = props['Status']['select']['name'].strip()
            else:
                row['Status'] = 'N/A'
        except:
            row['Status'] = 'N/A'
            
        # Prioridade
        try:
            if 'Prioridade' in props and props['Prioridade']['select']:
                row['Prioridade'] = props['Prioridade']['select']['name'].strip()
            else:
                row['Prioridade'] = 'N/A'
        except:
            row['Prioridade'] = 'N/A'
            
        # Categoria/Tipo
        try:
            if 'Tipo' in props and props['Tipo']['select']:
                row['Categoria'] = props['Tipo']['select']['name'].strip()
            elif 'Tipo de Projeto' in props:
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

        # Datas
        try:
            created = page.get('created_time', '')
            updated = page.get('last_edited_time', '')
            row['Criado'] = created[:10] if created else ''
            row['Atualizado'] = updated[:10] + ' ' + updated[11:16] if updated else ''
        except:
            row['Criado'] = ''
            row['Atualizado'] = ''

        rows.append(row)

    return pd.DataFrame(rows)

def get_status_color(s):
    s_lower = s.lower()
    if 'aberto' in s_lower: return '#f59e0b'
    elif 'andamento' in s_lower: return '#0ea5e9'
    elif 'conclu' in s_lower: return '#22c55e'
    elif 'bloqueado' in s_lower: return '#ef4444'
    else: return '#64748b'

def get_categoria_class(cat):
    cat_lower = cat.lower() if cat else ''
    if 'tarefa' in cat_lower: return 'label-tarefa'
    elif 'feature' in cat_lower or 'funcionalidade' in cat_lower: return 'label-feature'
    elif 'bug' in cat_lower: return 'label-bug'
    elif 'melhoria' in cat_lower: return 'label-melhoria'
    else: return 'label-tarefa'

# === HEADER ===
logo_b64 = get_base64_image("public/logo.png")
col_h1, col_h2, col_h3 = st.columns([3, 4, 2])

with col_h1:
    if logo_b64:
        st.markdown(f"""
        <div style="display: flex; align-items: center; gap: 12px;">
            <img src="data:image/png;base64,{logo_b64}" style="width: 40px; height: 40px; border-radius: 8px;">
            <div>
                <p style="font-size: 18px; font-weight: 700; color: #f1f5f9; margin: 0;">Dashboard Executivo</p>
                <p style="font-size: 11px; color: #64748b; margin: 0;">Projetos Click e Atenda</p>
            </div>
        </div>
        """, unsafe_allow_html=True)

with col_h2:
    busca = st.text_input("🔍", placeholder="Buscar issues...", label_visibility="collapsed")

with col_h3:
    col_b1, col_b2 = st.columns(2)
    with col_b1:
        if st.button("🔄", help="Atualizar dados"):
            st.cache_data.clear()
            st.rerun()

# === CARREGAR DADOS ===
df_original = get_notion_data()

if df_original.empty:
    st.warning("⚠️ Nenhum dado encontrado.")
    st.stop()

# Aplicar busca
if busca:
    df_original = df_original[df_original['Nome'].str.contains(busca, case=False, na=False)]

# === TABS MACRO / MICRO ===
tab_macro, tab_micro = st.tabs(["📊 Macro", "📋 Micro"])

# ============================================
# TAB MACRO - Visão Geral
# ============================================
with tab_macro:
    # Métricas
    total_projetos = df_original['Projeto'].nunique()
    total_issues = len(df_original)
    concluidas = len(df_original[df_original['Status'].str.contains('Conclu', case=False, na=False)])
    abertas = len(df_original[df_original['Status'].str.contains('Aberto', case=False, na=False)])
    em_progresso = len(df_original[df_original['Status'].str.contains('andamento', case=False, na=False)])
    bloqueadas = len(df_original[df_original['Status'].str.contains('Bloqueado', case=False, na=False)])
    
    st.markdown('<p class="section-title">📈 Visão Geral</p>', unsafe_allow_html=True)
    
    m1, m2, m3, m4, m5, m6 = st.columns(6)
    m1.metric("📁 Projetos", total_projetos)
    m2.metric("📋 Total Issues", total_issues)
    m3.metric("✅ Concluídas", concluidas)
    m4.metric("🟡 Abertas", abertas)
    m5.metric("🔵 Em Progresso", em_progresso)
    m6.metric("🚫 Bloqueadas", bloqueadas)
    
    # Projetos - Grid 3 colunas estilo Lovable
    st.markdown('<p class="section-title">📁 Projetos</p>', unsafe_allow_html=True)
    
    projetos_list = list(df_original['Projeto'].unique())
    colors = ['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444']
    
    # Usar colunas do Streamlit para grid
    cols = st.columns(3)
    
    for idx, proj in enumerate(projetos_list):
        subset = df_original[df_original['Projeto'] == proj]
        total = len(subset)
        concl = len(subset[subset['Status'].str.contains('Conclu', case=False, na=False)])
        pend = total - concl
        pct = round(concl / total * 100) if total > 0 else 0
        color = colors[idx % len(colors)]
        
        with cols[idx % 3]:
            st.markdown(f'''
            <div class="project-card">
                <div class="header">
                    <div class="title-section">
                        <div class="icon-box" style="background: {color}20;">
                            <span style="color: {color}">📁</span>
                        </div>
                        <div>
                            <div class="name">{proj}</div>
                            <div class="count">{total} issues</div>
                        </div>
                    </div>
                    <span class="chevron">➤</span>
                </div>
                <div class="progress-section">
                    <div class="progress-label">
                        <span>Progresso</span>
                        <span style="font-weight: 600; color: #f1f5f9;">{pct}%</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: {pct}%"></div>
                    </div>
                </div>
                <div class="badges">
                    <span class="badge badge-success">{concl} concluídas</span>
                    <span class="badge badge-outline">{pend} pendentes</span>
                </div>
            </div>
            ''', unsafe_allow_html=True)
    
    # Analytics
    st.markdown('<p class="section-title">📊 Analytics</p>', unsafe_allow_html=True)
    
    col_g1, col_g2 = st.columns(2)
    
    with col_g1:
        st.caption("Distribuição por Status")
        status_counts = df_original['Status'].value_counts()
        fig1 = go.Figure(data=[go.Pie(
            labels=status_counts.index,
            values=status_counts.values,
            hole=0.5,
            marker_colors=[get_status_color(s) for s in status_counts.index],
            textinfo='label+value',
            textfont=dict(size=10)
        )])
        fig1.update_layout(
            paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='#f1f5f9'),
            showlegend=False,
            margin=dict(t=10, b=10, l=10, r=10), height=250
        )
        st.plotly_chart(fig1, use_container_width=True)
    
    with col_g2:
        st.caption("Issues por Projeto")
        proj_counts = df_original['Projeto'].value_counts()
        fig2 = go.Figure(data=[go.Bar(
            x=proj_counts.index,
            y=proj_counts.values,
            marker_color=['#0ea5e9', '#8b5cf6', '#22c55e', '#f59e0b'][:len(proj_counts)],
            text=proj_counts.values,
            textposition='outside',
            textfont=dict(size=11)
        )])
        max_val = proj_counts.max() if len(proj_counts) > 0 else 1
        fig2.update_layout(
            paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)',
            font=dict(color='#f1f5f9'),
            xaxis=dict(showgrid=False, tickfont=dict(size=10, color='#94a3b8')),
            yaxis=dict(showgrid=True, gridcolor='#2a3140', tickfont=dict(color='#94a3b8'), range=[0, max_val * 1.2]),
            margin=dict(t=10, b=30, l=30, r=10), height=250
        )
        st.plotly_chart(fig2, use_container_width=True)

# ============================================
# TAB MICRO - Kanban por Projeto
# ============================================
with tab_micro:
    st.markdown(f'<p style="text-align: right; color: #64748b; font-size: 12px;">{len(df_original)} issues em {df_original["Projeto"].nunique()} projetos</p>', unsafe_allow_html=True)
    
    # Criar colunas para cada projeto (Kanban style)
    projetos = df_original['Projeto'].unique()
    cols = st.columns(len(projetos))
    
    for idx, proj in enumerate(projetos):
        with cols[idx]:
            subset = df_original[df_original['Projeto'] == proj].sort_values('Atualizado', ascending=False)
            
            # Header do projeto
            st.markdown(f"""
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <span style="font-size: 14px; font-weight: 600; color: #f1f5f9;">● {proj}</span>
                <span style="background: #2a3140; padding: 2px 8px; border-radius: 10px; font-size: 11px; color: #94a3b8;">{len(subset)}</span>
            </div>
            """, unsafe_allow_html=True)
            
            # Cards de issues
            for _, row in subset.head(6).iterrows():
                cat_class = get_categoria_class(row.get('Categoria', ''))
                status_color = get_status_color(row['Status'])
                
                st.markdown(f"""
                <div class="issue-card">
                    <div style="margin-bottom: 6px;">
                        <span class="label {cat_class}">{row.get('Categoria', 'Tarefa')}</span>
                    </div>
                    <div class="title">{row['Nome'][:45]}{'...' if len(row['Nome']) > 45 else ''}</div>
                    <div class="meta">
                        <span style="color: {status_color};">● {row['Status']}</span>
                        <span>📅 {row.get('Criado', '')}</span>
                    </div>
                </div>
                """, unsafe_allow_html=True)
            
            if len(subset) > 6:
                st.caption(f"+ {len(subset) - 6} mais...")

# === FOOTER ===
st.markdown('<div class="footer">© 2025 Click Projects • Notion + Streamlit</div>', unsafe_allow_html=True)
