const GEMINI_API_KEY = import.meta.env.GEMINI_API_KEY
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent'

class AIChatService {
    constructor() {
        this.apiKey = GEMINI_API_KEY
}
    async sendMessage(message, context = '') {
        try {
            const response = await fetch(`${GEMINI_API_URL}?key=${this.apiKey}`, {
                method:'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                        parts: [
                            {
                            text: `${context ? `Context: ${context}\n\n` : ''}${message}`
                            }
                        ]
                        }
                    ],
                    generationConfig: {
                        temperature: 0.7,
                        topK: 40,
                        topP: 0.95,
                        maxOutputTokens: 1024,
                    }
                    })
                });
                if (!response.ok) {
                    const errortext = await response.text();
                    console.error('API error details', errortext);
                    throw new Error('API request failed');
                }
                const data = await response.json();
                if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
                    console.error('Unexpected response structure', data)
                    throw new Error('Invalid response from API')
                }
                return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error('Error calling Gemini API:', error); 
            throw new Error('Failed to get responses from AI, please try again');
        }
    }
    getPredefinedPrompts(){
        return [
            {
                id: 'Crop_planning',
                title: 'Crop rotation',
                prompt: 'How to start crop rotation',
                context: 'You are an agricultural expert'
            }
        ];
    }
}
export default AIChatService;