# Quest Together

## Table of Contents

- [Overview](#overview)  
- [Live Demo](#live-demo)  
- [Features](#features)  
- [Built With](#built-with)  
- [Initial setup](#initial-setup)
- [Supabase setup](#supabase-setup)

---

## Overview  

This project is an event planner management website designed to bring communities together through shared experiences. Users can browse upcoming events and sign up to participate with ease. Community members can also become organizers, giving them the ability to create new events for others to enjoy.

Once registered, participants can not only join events but also add them directly to their Google Calendar. If logged into Google, they’ll be prompted to allow events to sync automatically. Alternatively, if they choose not to log in, a pre-filled event form will open in a new tab, letting them easily add the details to their Google Calendar manually.


---

## Live Demo  

[View my website](https://qteventplanner.netlify.app/)

---

## Features  

- Event Creation  
- Easy Sign-up  
- Google Calendar Integration  
- Community Driven  
- Secure Backend  

---

## Built With  

- [React](https://reactjs.org/)  
- [Tailwind CSS](https://tailwindcss.com/)  
- [Vite](https://vitejs.dev/)  
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)  
- [Framer Motion](https://motion.dev/)  
- [Node v22.14.0](https://nodejs.org/en)  

---

## Initial setup

In order to run this site locally, please follw the steps below:  

- on GitHub, navigate to the main page of the repository and click `<>Code`  
- Copy the URL for the repo  
- On your local machine, type `git clone` followed by the repo URL into the terminal, then pressing enter to create a copy on your machine  
- navigate into the project directory using `cd`  

Once the repo is open, please run the following:  

- install the dependencies required, using `npm install`
- then start a local server with `npm run dev` which will be available on port 5173, unless used already.  

---

## Supabase setup

- Go to `Supabase` and log in
- Click `New Project`
- Fill in your project name, password, and database region
- Click `Create new project` and wait for it to finish initialising
- In your local project repo, create a .env.local file in the root directory
- Add your Supabase environment variables
  - `VITE_SUPABASE_API_URL=<Project URL from Supabase Dashboard → Project Settings → API>`
  - `VITE_SUPABASE_ANON_KEY=<anon/public key from Project Settings → API Keys>`
- Create the necessary tables, RLS policies, and triggers
- Base Tables:
  - Events - stores event information:name, date, description, location, max capacity, price, etc.
  - User Profiles - stores user information:username, first and last name, city, phone number, profile picture, admin notes
  - Event Attendees - many-to-many table linked users to events they are attending
  - Event Favourites - many-to-many table linking users to their favourites events
- Authentication Setup:
  - Go to Supabase Dashboard - `Authentication`
  - Navigate to `Settings - External O Auth Providers` and enable the proviers you want
  - Optionally, navigate to `Authentication - Policies` and create RLS policies controlling which users can read/write to tables
- Row Level Security (RLS) Policies:
  - Enable RLS on all tables
  - Create policies allowing users to select their own information
  - Create policies allowing users to update their own rows
  - Create policies allowing admins and organisers to insert and update necessary tables
- Triggers
  - Create a trigger that links Supabase Authentication login with the User Profiles tables, so a new user automatically gets a profile row when signing up
- Storage
  - Create two Buckets in the Supabase Storage, creating the necessary folders to store event banners and profile pictures
- After setup, create your profile. Then, in Supabase, change your role to admin to grant yourself administrative privileges on the website.