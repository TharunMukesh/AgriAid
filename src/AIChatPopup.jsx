import React, {useState, useEffect, useRef} from 'react'
import {X, Send, Loader2, Sparkles} from 'lucide-react'
import AIChatService from './aiChatService';

function AIChatPopup({isOpen, onClose}) {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPredefinedPrompts, setShowPredefinedPrompts] = useState(true);
    const aiChatService = new AIChatService();
    const messagesEndRef = useRef(null);

    const predefinedPrompts = aiChatService.getPredefinedPrompts();

    useEffect(()=> {
        if( isOpen && messages.length === 0) {
            setMessages([
                {
                    id: 1,
                    text: "Hello! I'm your AI farming assistant. I can help you with crop planning, pest management and much more. Choose from the prompts below or ask me anything.",
                    sender: 'ai',
                    timestamp: new Date()
                }
            ]);
        }
    },[isOpen, messages.length]);

    useEffect(() => {
        scrollToBottom();
    },[messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }

    const handleSendMessage = async(message, context = '') => {
        if(!message.trim()) return;

        const userMessage = {
            id: Date.now(),
            text: message,
            sender: 'user',
            timestamp: new Date() 
        };
        
        setMessages(prev => [...prev, userMessage]);
        setInputMessage('');
        setIsLoading(true);
        setShowPredefinedPrompts(false);

        try {
            const aiResponse = await aiChatService.sendMessage(message,context);

            const aiMessage = {
                id: Date.now() + 1,
                text: aiResponse,
                sender: 'ai',
                timestamp: new Date()
            };

            setMessages(prev=> [...prev, aiMessage]);
        } catch(error){
            const errorMessage = {
                id: Date.now() + 1,
                text: "Sorry, I'm having trouble responding right now. Please try again or check your internet connection.",
                sender: 'ai',
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev=> [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePredefinedPrompt = (prompt) => {
        handleSendMessage(prompt.prompt, prompt.context);
    };

    const handleKeyPress = (e) => {
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault();
            handleSendMessage(inputMessage);
        }
    };

    const formatTimestamp = (timestamp) => {
        return timestamp.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    };

    if(!isOpen) return null;
  return (
    <div className='fixed bottom-20 right-6 z-50'>
        {/* Chat Popup */}
        <div className='bg-white rounded-lg shadow-2xl w-96 h-[600px] flex flex-col transform transition-all duration-300 ease-out'>
            {/* Header */}
            <div className='flex items-center justify-between p-4 border-b border-gray-300 bg-amber-600 text-white rounded-t-lg'>
                <div className='flex items-center space-x-2'>
                    <Sparkles size={20}/>
                    <h3 className='font-semibold'>AI Assistant</h3>
                </div>
                <button
                    onClick={onClose}
                >
                    <X size={20}/>
                </button>
            </div>

            {/* Message Area */}
            <div className='flex-1 overflow-y-auto p-4 space-y-4'>
                {messages.map((message)=> (
                    <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end ': 'justify-start'}`}>
                        <div
                            className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                message.sender === 'user' 
                                ? 'bg-amber-600 text-white'
                                : message.isError
                                ? 'bg-red-100 text-red-800 border border-red-200'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                        >
                            <p className='text-sm whitespace-pre-wrap'>{message.text}</p>
                            <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-amber-100' : 'text-gray-500'}`}>{formatTimestamp(message.timestamp)}</p>
                        </div>
                    </div>
                ))}

                {/* Loading indicator */}
                {isLoading && (
                    <div className='flex justify-start'>
                        <div className='bg-gray-100 rounded-lg px-4 py-2 flex items-center space-x-2'>
                            <Loader2 size={16} className="animate-spin" />
                            <span className='text-sm text-gray-600'>AI is thinking...</span>
                        </div>
                    </div>
                )}

                {/* predefined prompts */}
                {showPredefinedPrompts && messages.length === 1 && (
                    <div className="space-y-2">
                      <p className="text-xm text-gray-500 font-medium mb-2"> Quick Prompts:</p>
                      <div className="grid grid-cols-1 gap-2">
                        {predefinedPrompts.map((prompt) => (
                          <button
                            key={prompt.id}
                            onClick={() => handlePredefinedPrompt(prompt)}
                            className="bg-amber-50 text-black px-3 py-1 rounded-lg text-xs hover:bg-amber-100 transition-colors"
                          >
                            <p className="text-amber-700 font-medium text-sm">{prompt.title} </p>
                            <p className="text-amber-700 font-medium text-xs mt-1 line-clamp-2">{prompt.prompt.substring(0,60)}...</p>
                          </button>
                        ))}
                      </div>
                    </div>
                )}
                <div ref={messagesEndRef}/>
            </div>
            {/* input area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex space-x-2 ">
                <textarea className = "flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                value={inputMessage}
                onChange={(e)=>setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder='Ask me anything...'
                rows = '2'
                disabled = {isLoading}
                />
                <button className = "bg-amber-600 hover-bg-amber-700 text-white p-3 rounded-lg disabled:opacity-50 disabled:cursour-not-allowed" onClick = {()=>handleSendMessage(inputMessage)} disabled = {isLoading || !inputMessage.trim()} >
                  <Send size = {20}/>
                </button>
              </div>
              <p className = "text-xs text-gray-500 mt-2">Press Enter to Send, shift + enter for new line</p>
            </div>
        </div>
    </div>
  )
}
export default AIChatPopup