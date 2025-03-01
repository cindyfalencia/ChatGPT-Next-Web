export async function getMBTI(text: string) {
  const response = await fetch("http://127.0.0.1:8000/predict", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });

  if (!response.ok) {
    throw new Error("Failed to predict MBTI");
  }

  const data = await response.json();
  return data; // { mbti: "INTP", confidence: 0.85 }
}
