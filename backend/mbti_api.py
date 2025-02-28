from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib
import re
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer

# Load trained model & vectorizer
model = joblib.load("mbti_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")
tfidf_transformer = joblib.load("tfidf_transformer.pkl")

# Initialize FastAPI
app = FastAPI()

# Preprocess function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"https?://\S+", " ", text)  # Remove URLs
    text = re.sub(r"\W+", " ", text)  # Remove special characters
    text = re.sub(r"\s+", " ", text).strip()  # Remove extra spaces
    stop_words = set(stopwords.words("english"))
    text = " ".join([word for word in text.split() if word not in stop_words])
    return text

# API input schema
class InputText(BaseModel):
    text: str

# List of MBTI types in the order determined during model training
mbti_types = [
    'ENFJ', 'ENFP', 'ENTJ', 'ENTP',
    'ESFJ', 'ESFP', 'ESTJ', 'ESTP',
    'INFJ', 'INFP', 'INTJ', 'INTP',
    'ISFJ', 'ISFP', 'ISTJ', 'ISTP'
]

@app.post("/predict")
async def predict_mbti(input_data: InputText):
    text = input_data.text
    if not text or len(text) < 20:
        raise HTTPException(status_code=400, detail="Text is too short!")

    # Preprocess input
    cleaned_text = preprocess_text(text)

    # Transform the input text using the vectorizer
    text_features = vectorizer.transform([cleaned_text])
    transformed_features = tfidf_transformer.transform(text_features).toarray()

    # Make a prediction using the model
    prediction = model.predict(transformed_features)

    # Convert the NumPy integer to a native Python integer
    mbti_index = prediction[0].item()

    # Map the index to the corresponding MBTI type
    if 0 <= mbti_index < len(mbti_types):
        mbti_type = mbti_types[mbti_index]
    else:
        raise HTTPException(status_code=500, detail="Model returned an invalid index.")

    return {"mbti": mbti_type, "confidence": 0.85}

@app.get("/")
async def root():
    return {"message": "MBTI API is running! Go to /docs to test it."}
