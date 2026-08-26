# QuickNote — A Simple Note-Taking App

QuickNote is a minimalist note-taking web application built with Next.js and Supabase. It allows you to create, edit, delete, and sync your personal notes in real-time across multiple devices and browser tabs.

## Features

- 🔐 **Authentication**: Sign up and log in with email and password
- 📝 **CRUD Operations**: Create, read, update, and delete notes
- ⚡ **Real-time Sync**: See changes instantly across all open tabs and devices
- 🎨 **Responsive Design**: Works seamlessly on desktop and mobile
- 🔒 **Secure**: Row Level Security (RLS) ensures you can only access your own notes

## Prerequisites

Before you begin, make sure you have:

- Node.js 18+ installed
- A Supabase account (free at [supabase.com](https://supabase.com))

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/voongtranhung/quicknote.git
cd quicknote
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project URL and anon key from the project settings
3. In your Supabase project, go to SQL Editor and run the following SQL to create the `notes` table:

```sql
-- Create notes table
CREATE TABLE notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create notes"
  ON notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE notes;
```

### 4. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Then update it with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How to Use

1. **Sign Up**: Create a new account with your email and password
2. **Create Notes**: Click "Create Note" and enter your title and content
3. **Edit Notes**: Click the "Edit" button on any note to modify it
4. **Delete Notes**: Click the "Delete" button to remove a note (with confirmation)
5. **Real-time Sync**: Open the app in multiple tabs to see changes appear instantly

## Deployment

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add your environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click Deploy

Your app will be live in minutes!

## Project Structure

```
quicknote/
├── app/
│   ├── page.tsx              # Authentication page (login/signup)
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Global styles
│   ├── utils/
│   │   └── supabase/
│   │       └── client.ts     # Supabase client initialization
│   └── notes/
│       ├── page.tsx          # Notes list page
│       └── components/
│           ├── NoteList.tsx  # Note cards display
│           ├── CreateNoteModal.tsx  # Create note form
│           └── EditNoteModal.tsx    # Edit note form
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .env.example
```

## Technologies Used

- **Frontend**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Real-time Updates**: Supabase Realtime

## Future Enhancements

- Search and filter notes
- Tags and folders
- Dark mode
- Social authentication (Google, GitHub)
- Note sharing with other users
- Rich text editor
- Mobile app

## Security

- All notes are protected by Row Level Security (RLS) policies
- Only authenticated users can access their own notes
- Passwords are securely hashed by Supabase Auth

## Support

For issues or questions, please open an issue on GitHub.

## License

MIT License - feel free to use this project for learning or as a starting point for your own projects!
