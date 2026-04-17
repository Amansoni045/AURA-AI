import streamlit as st
import uuid
import os
from ChatModels.chat import get_model
from streamlit_extras.add_vertical_space import add_vertical_space

# --- Page Configuration ---
st.set_page_config(
    page_title="Aura AI",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- Aura Premium CSS ---
def local_css():
    st.markdown("""
    <style>
    /* Global Styling */
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap');
    
    html, body, [class*="css"] {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }

    /* Background & Main App */
    .stApp {
        background: #000000;
        color: #ECECEC;
    }

    /* Glassmorphism Input Container */
    [data-testid="stChatInput"] {
        background: rgba(30, 30, 30, 0.6) !important;
        backdrop-filter: blur(20px) !important;
        border: 1px solid rgba(255, 255, 255, 0.05) !important;
        border-radius: 24px !important;
        padding: 5px !important;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4) !important;
    }

    /* Sidebar Styling */
    [data-testid="stSidebar"] {
        background-color: #0d0d0d !important;
        border-right: 1px solid rgba(255, 255, 255, 0.03) !important;
    }

    /* Aura Logo Glow */
    .aura-logo {
        position: relative;
        width: 60px;
        height: 60px;
        background: radial-gradient(circle, #a855f7 0%, transparent 70%);
        filter: blur(15px);
        opacity: 0.5;
        margin: 0 auto;
    }

    /* Chat Messages */
    .stChatMessage {
        background-color: transparent !important;
        border: none !important;
    }

    .stChatMessage[data-testid="stChatMessageAssistant"] {
        background-color: rgba(255, 255, 255, 0.02) !important;
        border-radius: 20px !important;
        margin-bottom: 10px !important;
    }

    /* Sidebar History Items */
    .history-item {
        padding: 10px 12px;
        border-radius: 10px;
        margin-bottom: 4px;
        cursor: pointer;
        transition: all 0.2s;
        border: 1px solid transparent;
        display: flex;
        align-items: center;
        gap: 10px;
        color: #999;
    }

    .history-item:hover {
        background-color: rgba(255, 255, 255, 0.03);
        color: #fff;
    }
    
    .history-item.active {
        background-color: rgba(255, 255, 255, 0.05);
        color: #fff;
        border-color: rgba(255, 255, 255, 0.05);
    }

    /* Hide Streamlit components */
    #MainMenu {visibility: hidden;}
    footer {visibility: hidden;}
    header {visibility: hidden;}
    </style>
    """, unsafe_allow_html=True)

local_css()

# --- Session State Initialization ---
if "conversations" not in st.session_state:
    st.session_state.conversations = {} # id -> {title, messages}
if "current_chat_id" not in st.session_state:
    st.session_state.current_chat_id = None
if "selected_model" not in st.session_state:
    st.session_state.selected_model = "Aura-1 Ultra"

# --- Helper Functions ---
def get_current_chat():
    if st.session_state.current_chat_id in st.session_state.conversations:
        return st.session_state.conversations[st.session_state.current_chat_id]
    return {"messages": [], "title": "New Chat"}

def create_new_chat():
    new_id = str(uuid.uuid4())
    st.session_state.conversations[new_id] = {
        "title": "New Conversation",
        "messages": []
    }
    st.session_state.current_chat_id = new_id

def switch_chat(chat_id):
    st.session_state.current_chat_id = chat_id

# --- Sidebar ---
with st.sidebar:
    st.markdown("<div style='text-align: center; margin-bottom: 20px;'><h1 style='color: white; font-weight: 700;'>Aura AI</h1></div>", unsafe_allow_html=True)
    
    if st.button("＋ New Conversation", use_container_width=True, type="primary"):
        create_new_chat()
        st.rerun()

    add_vertical_space(2)
    st.markdown("<p style='font-size: 0.7rem; font-weight: 700; color: #666; text-transform: uppercase;'>History</p>", unsafe_allow_html=True)
    
    # History List
    for chat_id, chat_data in reversed(list(st.session_state.conversations.items())):
        active_class = "active" if st.session_state.current_chat_id == chat_id else ""
        if st.button(f"💬 {chat_data['title'][:20]}...", key=f"btn_{chat_id}", use_container_width=True):
            switch_chat(chat_id)
            st.rerun()

    add_vertical_space(4)
    st.session_state.selected_model = st.selectbox(
        "Model Selector",
        ["Aura-1 Ultra", "Aura-1 Turbo"],
        index=0 if st.session_state.selected_model == "Aura-1 Ultra" else 1
    )
    
    st.markdown("---")
    st.markdown("""
        <div style='display: flex; align-items: center; gap: 10px; padding: 10px; background: rgba(255,255,255,0.02); border-radius: 12px;'>
            <div style='width: 32px; height: 32px; border-radius: 8px; background: linear-gradient(135deg, #a855f7, #22d3ee); display: flex; align-items: center; justify-content: center; font-size: 0.7rem; color: white;'>AS</div>
            <div style='display: flex; flex-direction: column;'>
                <span style='font-size: 0.8rem; font-weight: 600;'>Aman Soni</span>
                <span style='font-size: 0.65rem; color: #666;'>Pro Member</span>
            </div>
        </div>
    """, unsafe_allow_html=True)

# --- Main Chat Interface ---
if st.session_state.current_chat_id is None:
    # Welcome Screen
    st.markdown("<div style='height: 20vh;'></div>", unsafe_allow_html=True)
    col1, col2, col3 = st.columns([1, 2, 1])
    with col2:
        st.markdown("<div class='aura-logo'></div>", unsafe_allow_html=True)
        st.markdown("<h1 style='text-align: center; font-size: 3.5rem; margin-top: -40px; font-weight: 700;'>How can Aura help?</h1>", unsafe_allow_html=True)
        
        add_vertical_space(2)
        sug_col1, sug_col2, sug_col3 = st.columns(3)
        with sug_col1:
            if st.button("Plan a 3-day trip to Tokyo", help="Click to start", use_container_width=True):
                create_new_chat()
                st.session_state.conversations[st.session_state.current_chat_id]["messages"].append({"role": "user", "content": "Plan a 3-day trip to Tokyo"})
                st.rerun()
        with sug_col2:
            if st.button("Explain quantum physics", help="Click to start", use_container_width=True):
                create_new_chat()
                st.session_state.conversations[st.session_state.current_chat_id]["messages"].append({"role": "user", "content": "Explain quantum physics like I'm five"})
                st.rerun()
        with sug_col3:
            if st.button("Write a Python script", help="Click to start", use_container_width=True):
                create_new_chat()
                st.session_state.conversations[st.session_state.current_chat_id]["messages"].append({"role": "user", "content": "Write a Python script to scrape news"})
                st.rerun()
else:
    # Actual Chat Thread
    chat = get_current_chat()
    
    # Header with Model Name
    st.markdown(f"<div style='padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.03); margin-bottom: 20px;'><span style='background: rgba(255,255,255,0.05); padding: 5px 12px; border-radius: 10px; font-size: 0.8rem; font-weight: 600;'>{st.session_state.selected_model}</span></div>", unsafe_allow_html=True)
    
    # Display Messages
    for msg in chat["messages"]:
        with st.chat_message(msg["role"], avatar="👤" if msg["role"] == "user" else "✨"):
            st.markdown(msg["content"])
    
    # Chat Input
    if prompt := st.chat_input("Ask Aura anything..."):
        # Add User Message
        chat["messages"].append({"role": "user", "content": prompt})
        
        # Update title if it's the first message
        if len(chat["messages"]) == 1:
            chat["title"] = prompt[:30] + "..." if len(prompt) > 30 else prompt
            
        with st.chat_message("user", avatar="👤"):
            st.markdown(prompt)
            
        # Get AI Response
        with st.chat_message("assistant", avatar="✨"):
            message_placeholder = st.empty()
            message_placeholder.markdown("*(Aura is thinking...)*")
            
            try:
                model = get_model()
                # Simple implementation: pass the whole history or just the last message
                response = model.invoke(prompt)
                full_response = response.content
                message_placeholder.markdown(full_response)
                chat["messages"].append({"role": "assistant", "content": full_response})
            except Exception as e:
                full_response = f"⚠️ Aura encountered an error: {str(e)}"
                message_placeholder.markdown(full_response)
                chat["messages"].append({"role": "assistant", "content": full_response})
        
        st.rerun()

# Persistence Tip: In a real app, I'd save to disk here.
# For this session, we'll keep it in memory.
