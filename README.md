Absolutely! Here’s a **ready-to-copy README.md file** for your project. Just save it as `README.md` in your project root and replace the placeholder screenshots with your own images.

````markdown
# Gmail Email Viewer with Classification

A **Next.js 15** application that fetches Gmail messages, classifies them using AI (Gemini API), and displays them in a user-friendly interface with Google login.  

---

## Features

- Google OAuth login using **NextAuth**.
- Fetch Gmail emails using **Gmail API**.
- Classify emails into categories: `Important`, `Promotions`, `Social`, `Marketing`, `Spam`, `General`.
- Display emails with **category labels** and **avatars**.
- **Skeleton loading** for email list.
- User dropdown showing **avatar, name, email, and logout**.
- Responsive and modern UI with Tailwind CSS.

---

## Screenshots

### Login Screen

![Login Screenshot](./screenshots/login.png)  

### Emails List

![Emails Screenshot](./screenshots/s1.png)  

### Sidebar

![User Dropdown Screenshot](./screenshots/s2.png)  

---


## Setup Instructions

### 1. Clone Repository

```bash
git clone https://github.com/devraj27dec/MagicSlides.git
cd MagicSlides
````

### 2. Install Dependencies

```bash
npm install
# or
yarn
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```env
NEXTAUTH_SECRET=your_nextauth_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key
```

> Get Google OAuth credentials from [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
> Get Gemini API key from [Google Gemini API](https://developers.generativeai.google/).

---


### 4. Run the App

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Folder Structure

```
/components      # Reusable UI components (Avatar, UserDropdown, SkeletonEmail)
/pages/api       # API routes (NextAuth, classify-email)
/pages           # Frontend pages
/public          # Public assets (default-avatar.png)
/styles          # Tailwind CSS styles
```

---

## Usage

1. Open the app.
2. Sign in with your Google account.
3. Emails load instantly with skeletons while fetching.
4. Email categories are displayed.
5. Click user avatar to open dropdown and logout.

---

## Dependencies

* **Next.js 15**
* **NextAuth** (Google OAuth)
* **Axios** (for Gmail API)
* **Tailwind CSS**
* **React Icons**

---

## Notes

* Emails are classified via Gemini API (Gemini 2.0 Flash).
* If no category is found, `General` is assigned.
* Skeletons improve perceived performance when fetching emails.


