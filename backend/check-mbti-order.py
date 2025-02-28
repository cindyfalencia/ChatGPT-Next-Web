import pandas as pd
from sklearn.preprocessing import LabelEncoder

# Load the dataset
df = pd.read_csv("mbti_1.csv")  

# Initialize and fit LabelEncoder
le = LabelEncoder()
le.fit(df["type"]) 

# Print the encoding order
print("MBTI types in training order:", le.classes_)
