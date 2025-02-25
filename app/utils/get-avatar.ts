export const getAvatarUrl = async (userId: string): Promise<string | null> => {
  try {
    const response = await fetch(`/api/user/get-avatar?userId=${userId}`);

    if (!response.ok) {
      console.error("❌ Error fetching avatar:", response.statusText);
      return null;
    }

    const data = await response.json();
    return data.glb_url;
  } catch (error) {
    console.error("❌ Failed to retrieve avatar:", error);
    return null;
  }
};
