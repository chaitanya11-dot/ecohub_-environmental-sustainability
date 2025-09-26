import React, { useState, useMemo } from 'react';
import { View, Event, User, Article } from './types';
import { sampleEvents, sampleUsers, sampleArticles, sampleImpactStats } from './sampleData';

import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import ImpactTracker from './components/ImpactTracker';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import EventForm from './components/EventForm';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import BlogList from './components/BlogList';
import ArticleDetails from './components/ArticleDetails';
import EcoTipGenerator from './components/EcoTipGenerator';

const App: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [events, setEvents] = useState<Event[]>(sampleEvents);
    const [users, setUsers] = useState<User[]>(sampleUsers);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

    // For simplicity, we'll hardcode the current user. In a real app, this would be dynamic.
    const [currentUserId, setCurrentUserId] = useState(1); // Alice (user)
    // const [currentUserId, setCurrentUserId] = useState(2); // Bob (admin)
    const currentUser = useMemo(() => users.find(u => u.id === currentUserId)!, [users, currentUserId]);


    const navigateTo = (newView: View) => {
        window.scrollTo(0, 0);
        setView(newView);
    };

    const handleSelectEvent = (event: Event) => {
        setSelectedEvent(event);
        navigateTo('eventDetails');
    };
    
    const handleSelectArticle = (article: Article) => {
        setSelectedArticle(article);
        navigateTo('articleDetails');
    };

    const handleRegister = (eventId: number, credentials: { name: string; email: string }) => {
        setUsers(users.map(user => {
            if (user.id === currentUserId && !user.registeredEventIds.includes(eventId)) {
                return { ...user, registeredEventIds: [...user.registeredEventIds, eventId], name: credentials.name, email: credentials.email };
            }
            return user;
        }));
        setEvents(events.map(event => {
            if (event.id === eventId && !event.volunteers.includes(currentUserId)) {
                return { ...event, volunteers: [...event.volunteers, currentUserId] };
            }
            return event;
        }));
        alert(`Thank you, ${credentials.name}! Your registration is confirmed. A confirmation will be sent to ${credentials.email}.`);
    };

    const handleProofUpload = (eventId: number, report: string, photo: File) => {
        const event = events.find(e => e.id === eventId);
        if (!event) return;
    
        setUsers(currentUsers => currentUsers.map(user => {
            if (user.id === currentUserId) {
                if (user.proofSubmittedEventIds.includes(eventId)) {
                    return user; // Avoid duplicate submissions
                }
                return {
                    ...user,
                    points: user.points + event.pointsValue,
                    proofSubmittedEventIds: [...user.proofSubmittedEventIds, eventId],
                    submittedReports: [...user.submittedReports, { eventId, report, photoName: photo.name }],
                };
            }
            return user;
        }));
    
        alert(`Proof submitted for "${event.title}"! You've earned ${event.pointsValue} points.`);
    };
    
    const handleCreateOrUpdateEvent = (eventData: any) => {
        if(eventData.id) { // Update
            setEvents(events.map(e => e.id === eventData.id ? { ...e, ...eventData } : e));
            navigateTo('adminDashboard');
        } else { // Create
            const newEvent: Event = {
                ...eventData,
                id: Math.max(...events.map(e => e.id)) + 1,
                organizerId: currentUserId,
                volunteers: [],
                image: `https://picsum.photos/seed/event${Math.random()}/400/300`
            };
            setEvents([...events, newEvent]);
            navigateTo('adminDashboard');
        }
        alert(`Event successfully ${eventData.id ? 'updated' : 'created'}!`);
    };
    
    const handleDeleteEvent = (eventId: number) => {
        if (window.confirm('Are you sure you want to delete this event?')) {
            setEvents(events.filter(e => e.id !== eventId));
        }
    };
    
    const handleEditEvent = (event: Event) => {
        setSelectedEvent(event);
        navigateTo('editEvent');
    };

    const renderContent = () => {
        switch (view) {
            case 'home':
                return (
                    <>
                        <Hero navigateTo={navigateTo} currentUser={currentUser} />
                        <ImpactTracker stats={sampleImpactStats} />
                        <EcoTipGenerator />
                    </>
                );
            case 'eventList':
                return <EventList events={events} onSelectEvent={handleSelectEvent} />;
            case 'eventDetails':
                if (selectedEvent) {
                    return <EventDetails event={selectedEvent} currentUser={currentUser} onRegister={handleRegister} onBack={() => navigateTo('eventList')} />;
                }
                return null;
            case 'createEvent':
                return <EventForm onSubmit={handleCreateOrUpdateEvent} />;
            case 'editEvent':
                 if (selectedEvent) {
                    return <EventForm onSubmit={handleCreateOrUpdateEvent} existingEvent={selectedEvent} />;
                }
                return null;
            case 'userDashboard':
                return <UserDashboard user={currentUser} allEvents={events} onSelectEvent={handleSelectEvent} navigateTo={navigateTo} onProofUpload={handleProofUpload} />;
            case 'adminDashboard':
                const adminEvents = events.filter(e => e.organizerId === currentUser.id);
                return <AdminDashboard user={currentUser} events={adminEvents} onEdit={handleEditEvent} onDelete={handleDeleteEvent} onSelectEvent={handleSelectEvent} />;
            case 'blog':
                return <BlogList articles={sampleArticles} onSelectArticle={handleSelectArticle} />;
            case 'articleDetails':
                if (selectedArticle) {
                    return <ArticleDetails article={selectedArticle} onBack={() => navigateTo('blog')} />;
                }
                return null;
            default:
                return <div>Page not found</div>;
        }
    };

    return (
        <div className="flex flex-col min-h-screen font-sans bg-gray-50 text-gray-800">
            <Header navigateTo={navigateTo} currentUser={currentUser} />
            <main className="flex-grow">
                {renderContent()}
            </main>
            <Footer />
        </div>
    );
};

export default App;