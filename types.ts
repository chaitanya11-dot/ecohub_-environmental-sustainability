import React from 'react';

export type EventCategory = 'Community Clean-Up' | 'Tree Planting' | 'Recycling Program' | 'Conservation';

export interface User {
  id: number;
  name: string;
  email?: string;
  role: 'user' | 'admin';
  points: number;
  registeredEventIds: number[];
  proofSubmittedEventIds: number[];
  submittedReports: {
    eventId: number;
    report: string;
    photoName: string;
  }[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  category: EventCategory;
  date: string;
  time: string;
  location: string;
  image: string;
  organizerId: number;
  organizer?: string; // Optional, can be derived
  volunteersNeeded: number;
  volunteers: number[]; // Store user IDs
  pointsValue: number;
}

export interface Article {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  image: string;
}

export interface ImpactStats {
  eventsCreated: number;
  totalVolunteers: number;
  treesPlanted: number;
  wasteCollectedKg: number;
}

export type View = 
  | 'home'
  | 'eventList'
  | 'eventDetails'
  | 'createEvent'
  | 'editEvent'
  | 'userDashboard'
  | 'adminDashboard'
  | 'blog'
  | 'articleDetails';

export interface BadgeInfo {
    name: string;
    description: string;
    icon: React.ReactNode;
    isUnlocked: boolean;
}