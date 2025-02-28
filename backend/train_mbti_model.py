import pandas as pd
import numpy as np
import joblib
import re
import nltk
from nltk.corpus import stopwords
from sklearn.feature_extraction.text import CountVectorizer, TfidfTransformer
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier

# Download stopwords
nltk.download("stopwords")

# Load MBTI dataset
data = pd.read_csv("mbti_1.csv")  

# Preprocess function
def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"https?://\S+", " ", text)  # Remove URLs
    text = re.sub(r"\W+", " ", text)  # Remove special characters
    text = re.sub(r"\s+", " ", text).strip()  # Remove extra spaces
    stop_words = set(stopwords.words("english"))
    text = " ".join([word for word in text.split() if word not in stop_words])
    return text

# Apply preprocessing to all posts
data["cleaned_posts"] = data["posts"].apply(preprocess_text)

# Convert MBTI types to numerical labels
mbti_types = list(data["type"].unique())
data["label"] = data["type"].apply(lambda x: mbti_types.index(x))

# Convert text to numerical features
vectorizer = CountVectorizer(stop_words="english", max_features=1500)
X_features = vectorizer.fit_transform(data["cleaned_posts"])

tfidf_transformer = TfidfTransformer()
X_tfidf = tfidf_transformer.fit_transform(X_features).toarray()

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X_tfidf, data["label"], test_size=0.2, random_state=42)

# Train RandomForest model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
joblib.dump(model, "mbti_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")  # Save vectorizer
joblib.dump(tfidf_transformer, "tfidf_transformer.pkl")  # Save TF-IDF

print("Model training complete! `mbti_model.pkl` saved.")

