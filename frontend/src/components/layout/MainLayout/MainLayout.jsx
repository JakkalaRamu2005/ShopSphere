import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import Footer from '../../allfootercode/Footer/Footer';
import ChatbotWrapper from '../../Chatbot/ChatbotWrapper';
import './MainLayout.css';

/**
 * MainLayout Component
 * Provides the main application layout with navbar, footer, and chatbot
 * Uses Outlet for nested route rendering
 * MegaMenu is now only shown on home page via Navbar component
 */
function MainLayout() {
    return (
        <>
            <Navbar />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
            <ChatbotWrapper />
        </>
    );
}

export default MainLayout;
