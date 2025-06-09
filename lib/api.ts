interface LoginResponse {
    accessToken: string;
  }
  
  interface ChatResponse {
    message: string;
    // Add other response fields as needed
  }
  
  export async function login(email: string, password: string): Promise<string> {
    const response = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  
    if (!response.ok) {
      throw new Error('Login failed');
    }
  
    const data: LoginResponse = await response.json();
    return data.accessToken;
  }
  
  export async function sendChatMessage(accessToken: string, message: string, chatId: string): Promise<ChatResponse> {
    const response = await fetch('http://localhost:8080/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        message,
        chatId,
      }),
    });
  
    if (!response.ok) {
      throw new Error('Failed to send message');
    }
  
    return response.json();
  }