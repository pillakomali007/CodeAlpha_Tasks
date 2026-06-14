import streamlit as st
from chatbot import chatbot

st.title("🤖 FAQ Chatbot")

question = st.text_input("Ask a Question")

if question:
    answer = chatbot(question)
    st.write(answer)
