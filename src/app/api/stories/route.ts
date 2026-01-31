import { NextResponse } from 'next/server';

// Mock database for stories (In-memory for hackathon MVP if no DB connected)
let stories = [
    {
        id: 1,
        tag: "Courage",
        content: "Today I finally stood up to my boss. It wasn't loud or dramatic, but I said 'No' to the extra work that wasn't mine. My hands were shaking, but I did it.",
        likes: 24,
        time: "2h ago",
        isAnonymous: true
    },
    {
        id: 2,
        tag: "Healing",
        content: "It's been 3 years since I left. Some days are still hard, but I realized today that I haven't thought about him in a week. I'm reclaiming my space.",
        likes: 156,
        time: "5h ago",
        isAnonymous: true
    },
    {
        id: 3,
        tag: "Hope",
        content: "To the girl crying on the subway today: I saw you. I've been you. It gets better, I promise.",
        likes: 89,
        time: "1d ago",
        isAnonymous: true
    }
];

export async function GET() {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(stories);
}

export async function POST(request: Request) {
    const body = await request.json();

    const newStory = {
        id: stories.length + 1,
        tag: body.tag,
        content: body.content,
        isAnonymous: body.isAnonymous,
        likes: 0,
        time: "Just now",
    };

    stories = [newStory, ...stories];

    return NextResponse.json(newStory);
}
