import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../../Navbar/Navbar';
import MegaMenu from '../../MegaMenu/MegaMenu';
import Footer from '../../allfootercode/Footer/Footer';
import ChatbotWrapper from '../../Chatbot/ChatbotWrapper';
import './MainLayout.css';

/**
 * MainLayout Component
 * Provides the main application layout with navbar, footer, and chatbot
 * Uses Outlet for nested route rendering
 */
function MainLayout() {
    return (
        <>
            <Navbar />
            <MegaMenu />
            <main className="main-content">
                <Outlet />
            </main>
            <Footer />
            <ChatbotWrapper />
        </>
    );
}

export default MainLayout;
