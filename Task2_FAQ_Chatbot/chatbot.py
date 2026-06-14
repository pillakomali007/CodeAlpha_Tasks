import nltk
import pandas as pd
import numpy as np
import string

from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# First-time download
nltk.download('punkt')
nltk.download('stopwords')

# Load FAQ data
faq_df = pd.read_csv("faqs.csv")

# Stop words
stop_words = set(stopwords.words('english'))

# Text preprocessing
def preprocess(text):

    text = str(text).lower()

    text = text.translate(
        str.maketrans('', '', string.punctuation)
    )

    tokens = word_tokenize(text)

    tokens = [
        word for word in tokens
        if word not in stop_words
    ]

    return " ".join(tokens)

# Process questions
faq_df["Processed"] = faq_df["Question"].apply(preprocess)

# TF-IDF
vectorizer = TfidfVectorizer()

faq_vectors = vectorizer.fit_transform(
    faq_df["Processed"]
)

# Chatbot function
def chatbot(user_query):

    processed_query = preprocess(user_query)

    query_vector = vectorizer.transform(
        [processed_query]
    )

    similarity_scores = cosine_similarity(
        query_vector,
        faq_vectors
    )

    best_match_index = np.argmax(
        similarity_scores
    )

    best_score = similarity_scores[0][best_match_index]

    if best_score > 0.2:
        return faq_df.iloc[best_match_index]["Answer"]

    return "Sorry, I couldn't find a matching answer."

# Chat loop
print("\nFAQ Chatbot Started")
print("Type 'exit' to stop\n")

if __name__ == "__main__":

    print("\nFAQ Chatbot Started")
    print("Type 'exit' to stop\n")

    while True:

        user_input = input("You: ")

        if user_input.lower() == "exit":
            print("Chatbot: Goodbye!")
            break

        response = chatbot(user_input)

        print("Chatbot:", response)
