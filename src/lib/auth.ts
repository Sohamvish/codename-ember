// Mock Auth for Hackathon Demo
// In a real app, this would use Supabase Auth or NextAuth.js

export const MockUser = {
    id: "user_123",
    name: "Sarah Jenkins",
    handle: "@sarahj",
    avatar: "https://api.dicebear.com/7.x/micah/svg?seed=sarah",
    isLoggedIn: true
};

export const GuestUser = {
    id: "guest",
    name: "Guest",
    handle: "@guest",
    avatar: null,
    isLoggedIn: false
};

// Simple helper to "get" the current user
export function getCurrentUser() {
    // meaningful simulation: check if we are in a browser environment
    if (typeof window !== 'undefined') {
        const isGuest = localStorage.getItem('ember_guest_mode') === 'true';
        return isGuest ? GuestUser : MockUser;
    }
    return MockUser;
}
