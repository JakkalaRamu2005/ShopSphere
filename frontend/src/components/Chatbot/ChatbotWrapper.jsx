import React from 'react';
import { useAuth } from '../AuthContext';
import Chatbot from './Chatbot';

export default function ChatbotWrapper() {
    const { isLoggedIn } = useAuth();

    // Only show chatbot when user is logged in
    if (!isLoggedIn) {
        return null;
    }

    return <Chatbot />;
}
