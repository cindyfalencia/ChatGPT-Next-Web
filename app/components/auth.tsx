import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccessStore } from "../store";

export function AuthPage() {
  const navigate = useNavigate();
  const accessStore = useAccessStore();

  useEffect(() => {
    const envApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    if (envApiKey) {
      accessStore.update((access) => {
        access.openaiApiKey = envApiKey;
      });
    }
  }, [accessStore]);

  return (
    <div>
      <h1>Authentication Page</h1>
      <button onClick={() => navigate("/home")}>Go to Chat</button>
    </div>
  );
}
