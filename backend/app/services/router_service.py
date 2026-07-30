"""
Router Service — Intelligent query parser and router.
Detects URLs in user inputs, downloads and indexes them on-the-fly,
and routes queries between normal chat, RAG, and extraction pipelines automatically.
"""

import re
from typing import List
from app.loaders.web import load_web_url
from app.vectorstores.chroma import get_chroma_store, has_chroma_documents
from langchain_core.messages import SystemMessage, BaseMessage


def extract_urls(text: str) -> List[str]:
    """
    Finds all valid HTTP/HTTPS URLs inside user message text.
    """
    url_pattern = re.compile(
        r'https?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\(\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
    )
    return url_pattern.findall(text)


class RouterService:

    @staticmethod
    def process_and_route_messages(
        messages: List[BaseMessage],
        latest_user_message: str,
    ) -> List[BaseMessage]:
        """
        Intelligently routes, fetches webpage contexts on-the-fly, and injects context prompts.
        """
        # 1. Detect and parse URLs on-the-fly
        detected_urls = extract_urls(latest_user_message)
        
        if detected_urls:
            # Load and index URL contents on-the-fly
            try:
                vectorstore = get_chroma_store()
                for url in detected_urls:
                    # Ingest and add page chunks to active Chroma store
                    chunks = load_web_url(url)
                    for chunk in chunks:
                        chunk.metadata["source_file"] = url
                    vectorstore.add_documents(chunks)
            except Exception as e:
                print(f"On-the-fly web crawl failed for {detected_urls}: {e}")

        # 2. Retrieve document context (only if documents exist and message is not a simple greeting)
        context = ""
        if latest_user_message and has_chroma_documents():
            clean_msg = latest_user_message.strip().lower()
            greetings = {"hii", "hi", "hello", "hey", "hola", "thanks", "thank you", "who are you"}
            if len(clean_msg) > 3 and clean_msg not in greetings:
                try:
                    vectorstore = get_chroma_store()
                    # Run similarity search matching k=4
                    retrieved_docs = vectorstore.similarity_search(latest_user_message, k=4)
                    if retrieved_docs:
                        context = "\n\n---\n\n".join([doc.page_content for doc in retrieved_docs])
                except Exception:
                    pass

        # 3. Inject correct prompts automatically
        routed_messages = list(messages)

        # RAG pipeline routing
        if context:
            system_instruction = (
                "You are a knowledgeable AI assistant. Answer the user's question accurately "
                f"based on the provided document context:\n{context}\n\n"
                "If the context touches on the topic, explain it based on what is available. "
                "Only state that the answer was not found if the context has absolutely zero relevance."
            )
            # Find and update or prepend SystemMessage
            routed_messages.insert(0, SystemMessage(content=system_instruction))

        # Movie extraction request routing
        elif any(keyword in latest_user_message.lower() for keyword in ["extract movie", "cinesage", "cast", "director", "release year"]):
            extraction_instruction = (
                "You are an expert movie information extractor. "
                "Extract structured movie details (Title, Release Year, Genre, Director, Cast, Summary) "
                "from the text accurately and format them cleanly."
            )
            routed_messages.insert(0, SystemMessage(content=extraction_instruction))

        return routed_messages
