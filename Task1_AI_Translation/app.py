from flask import Flask, render_template, request, jsonify
from deep_translator import GoogleTranslator
from langdetect import detect
from textblob import TextBlob

app = Flask(__name__)

history = []

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/translate', methods=['POST'])
def translate():

    data = request.get_json()

    text = data['text']
    target = data['target']

    detected_lang = detect(text)

    translated = GoogleTranslator(
        source='auto',
        target=target
    ).translate(text)

    polarity = TextBlob(text).sentiment.polarity

    if polarity > 0:
        sentiment = "Positive 😊"
    elif polarity < 0:
        sentiment = "Negative 😔"
    else:
        sentiment = "Neutral 😐"
        
history.append({
    "original": text,
    "translated": translated
})

return jsonify({
    "translated": translated,
    "detected": detected_lang,
    "sentiment": sentiment,
    "history": history[-10:]
})
if __name__ == "__main__":
    app.run(debug=True)