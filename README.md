# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/REPLACE_WITH_PROJECT_ID) and click on Share -> Publish.

## AWS deployment (Amplify)

This repo includes an `amplify.yml` so you can deploy with AWS Amplify using the default Vite build.

High-level steps:
- Create a new Amplify app and connect this repository.
- Use the default build settings (Amplify will pick up `amplify.yml`).
- Set the output directory to `dist` if prompted.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/features/custom-domain#custom-domain)

## SpongeBob English / Indonesian (sub-app)

The **SpongeBob** language app lives in `deployed-sponge-bob` and is built into `public/sponge/` on `npm run build`, same as Shape and Fraction. It is served at **`/sponge/`** on the Cognizo Wheel site (same host as `cognizowheel.web.app`).

## Sign-in & saved activity (Firebase Auth + Firestore)

The landing page and **Putaran Roda** (`/wheel`) include **Masuk / Log in** (email + password, Google, or new account). While signed in, each wheel animation cycle (throttled to about once every 4 seconds) writes a row under `users/{uid}/records` in **Cloud Firestore**.

**One-time Firebase console setup**

1. Enable **Authentication** → Sign-in methods: **Email/Password** and **Google** (turn Google on, then choose a support email). Under **Settings** → **Authorized domains**, add `localhost` (for dev) and your production host (e.g. `cognizowheel.web.app`).
2. Create the **Firestore** database (production mode is fine; access is enforced by `firestore.rules`).
3. Deploy rules with: `firebase deploy --only firestore` (or use `npm run deploy`, which deploys hosting + Firestore).