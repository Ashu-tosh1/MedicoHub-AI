<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->

# 🏥 MedicoHubAI – Intelligent Hospital Management System

**MedicoHubAI** is a cutting-edge full-stack hospital management system that leverages modern web technologies and artificial intelligence to deliver a seamless healthcare experience. From registration to consultation, lab integration, prescriptions, and follow-ups, everything is accessible through a secure, responsive interface.

One of its most powerful features is **AI-assisted diagnostics** powered by **Google Gemini** – enabling real-time **symptom analysis**, **disease prediction**, and **urgency detection** to help patients understand their condition and take immediate, informed action.

---

## 💻 Technologies Used

### Frontend
- **Next.js** – React-based full-stack framework
- **Tailwind CSS** – Utility-first CSS framework
- **React Query** – API data fetching and caching
- **Jitsi Meet API** – Video call integration
- **Cloudinary** – Secure media upload and delivery

### Backend
- **Next.js API Routes** – Fullstack endpoints within the app
- **Prisma ORM** – Database access and schema management
- **PostgreSQL** – Relational database

### AI & Intelligence
- **Gemini AI** – For intelligent symptom interpretation, disease prediction, and urgency-based consultation guidance

### Authentication & Hosting
- **Clerk** – Authentication and user management
- **Vercel** – Deployment and hosting

---

## ✅ Features

- 🔐 Secure authentication for Patients and Doctors via Clerk
- 🧠 **AI-driven Symptom Analysis & Disease Prediction** using **Gemini**  
  → Users receive:
  - Predicted diseases based on symptoms  
  - Suggested urgency levels (e.g., immediate, moderate, low)  
  - Next steps and direct appointment links  
- 🧑‍⚕️ Role-based dashboards (Doctor, Patient)
- 📅 Real-time appointment booking and confirmation
- 📝 Doctor-recommended test uploads and results review
- 🧪 Lab report management
- 📄 Prescription generation and digital download
- 📞 Live video consultations using **Jitsi Meet**
- ☁️ Medical document/image uploads via **Cloudinary**
- 🧾 Full medical history tracking
- 🧑 Patient profile with blood group, vitals, contact, and address
- 📈 Clean, modern, responsive UI with Tailwind CSS
- 🔄 Seamless multi-step medical workflow

---

## 🙌 About

MedicoHubAI is designed to improve the healthcare journey for patients and doctors through intuitive UI, powerful AI, and reliable backend support. Whether you're a developer, hospital admin, or healthcare startup, MedicoHubAI serves as a strong foundation for intelligent medical platforms.

---


## 📸 Screenshots



### Authentication

- **Login**  
  ![](./public/image-2.png)

- **Register**  
  ![](./public/image-3.png)

---

### Homepage

- Explore doctors and services  
  ![](./public/image-4.png)  
  ![](./public/image-5.png)
   ![](./public/image-31.png)  
  ![](./public/image-32.png)
 ![](./public/image-33.png)
---

### Patient Dashboard

- Central view of appointments, status, and access to consultation  
  ![](./public/image-6.png)

---

### Symptom Submission

- Step 1: Enter symptoms and additional notes  
  ![](./public/image-9.png)  
  - Submission Response:  
  ![](./public/image-10.png)  
  ![](./public/image-11.png)

---

### Appointment Scheduling

- Step 2: View list of available doctors  
  ![](./public/image-7.png)

- Step 3: Book doctor appointment  
  ![](./public/image-8.png)  
  ![](./public/image-12.png)

---

### Doctor Dashboard & Confirmation

- Doctor Login and Dashboard  
  ![](./public/image-13.png)

- Doctor confirms appointment  
  ![](./public/image-14.png)

---

### Appointment Status for Patient

- Patient checks confirmed status  
  ![](./public/image-15.png)

---

### Video Consultation (Jitsi Integration)

- Patient's video interface  
  ![](./public/image-16.png)  
  ![](./public/image-17.png)

- Doctor's video interface  
  ![](./public/image-25.png)

---

### Medical Uploads by Patient

- Upload reports, images, or test results  
  ![](./public/image-18.png)  
  ![](./public/image-19.png)

---

### Doctor View & Recommendations

- Doctor receives patient uploads  
  ![](./public/image-20.png)

- Upload recommended tests  
  ![](./public/image-21.png)

---

### Patient Uploads Test Results

- Upload section for lab results  
  ![](./public/image-22.png)  
  ![](./public/image-23.png)

---

### Prescription

- Doctor receives test results and uploads prescription  
  ![](./public/image-24.png)  
  ![](./public/image-26.png)

---

### Pharmacy View for Patient

- Prescription and suggested medications  
  ![](./public/image-27.png)

---

### Patient Profile & History

- View and update patient profile  
  ![](./public/image-28.png)

- Full medical history  
  ![](./public/image-29.png)  
  ![](./public/image-30.png)

---




## ⚙️ Setup Instructions

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-username/medicohub.git
   cd medicohub ```

2. ```npm install```

3. **Environment Setup**
    
DATABASE_URL=your_postgresql_database_url
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
CLERK_API_KEY=your_clerk_backend_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

4. Prisma Setup
npx prisma db push

5. Run Development Server
npm run dev


🙌 Author
Developed with ❤️ by ASHUTOSH PATRO

