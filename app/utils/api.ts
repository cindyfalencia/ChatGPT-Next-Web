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

export async function fullAnalysis(questionnaire: string) {
  try {
    const response = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: questionnaire }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch MBTI analysis");
    }

    const result = await response.json();
    console.log("FastAPI MBTI Result:", result);

    return {
      type: result.mbti || "UNKNOWN",
      confidence: result.confidence || 0,
      bestMatch: result.mbti || "UNKNOWN",
      breakdown: {}, // Optional if FastAPI provides additional insights
    };
  } catch (error) {
    console.error("Error fetching MBTI analysis:", error);
    return {
      type: "UNKNOWN",
      confidence: 0,
      bestMatch: "UNKNOWN",
      breakdown: {},
    };
  }
}
