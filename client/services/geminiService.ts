/// <reference types="vite/client" />

const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:3000";

export const sendMessage = async (
  prompt: string,
  history: { role: "user" | "model"; parts: { text: string }[] }[] = [],
): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    if (data.success) {
      return data.data?.response || "I couldn't generate a response.";
    } else {
      return (
        "Error: " + (data.error || data.details || "Unknown error occurred.")
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return (
      "Error: " +
      (error instanceof Error ? error.message : "Failed to connect to server.")
    );
  }
};

export const generateImage = async (prompt: string): Promise<string | null> => {
  try {
    // Note: Server doesn't have image generation endpoint yet
    // For now, use the text endpoint
    const response = await fetch(`${API_BASE_URL}/api/generate-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: `Generate a detailed description for an image: ${prompt}`,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    // Return null since actual image generation isn't supported yet
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};
