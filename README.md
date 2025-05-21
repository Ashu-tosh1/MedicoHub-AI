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
step-1
login
![alt text](image-2.png)

register
![alt text](image-3.png)

step-2
homepage
![alt text](image-4.png)
![alt text](image-5.png)

step-3
Patient DashbOard



![alt text](image-6.png)

step-4
![alt text](image-9.png)

step-4 response
![alt text](image-10.png)
![alt text](image-11.png)


Schedule appointment
step-5 List of doctors
![alt text](image-7.png)


step-6 Doctorbooking
![alt text](image-8.png)
![alt text](image-12.png)

step-7 Doctor Login
doctor Dashboard
![alt text](image-13.png)

Step-8 Doctor Confirms the appointment
![alt text](image-14.png)

Step-9 Patient check the appointment status 
![alt text](image-15.png)

step-10 vIDEO CALL
![alt text](image-16.png)
![alt text](image-17.png)
by doctor
![alt text](image-25.png)

step-11 upload details
![alt text](image-18.png)

![alt text](image-19.png)

step-12 doctor receives it 
![alt text](image-20.png)

step-13 doctor response and upload recommended tests
![alt text](image-21.png)

step-14 patient receives and upload the reports 
![alt text](image-22.png)
![alt text](image-23.png)

step-15 doctor receives the reports and upload the prescription
![alt text](image-24.png)
![alt text](image-26.png)

step-16 patient receives the prescription and a small pharmacy page which indiactes the prescibe medication
![alt text](image-27.png)

step-17 patient profile
![alt text](image-28.png)

step-18 medial history
![alt text](image-29.png)
![alt text](image-30.png)



export default function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
      res.status(200).json({ id, message: 'Author data fetched successfully' });
  } else if (req.method === 'POST') {
      res.status(200).json({ id, message: 'Author data sent successfully' });
  } else if (req.method === 'PUT') {
      res.status(200).json({ id, message: 'Author data updated successfully' });
  } else if (req.method === 'DELETE') {
      res.status(200).json({ id, message: 'Author data deleted successfully' });
  }
}

// app/api/[id]/route.js
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  const { id } = params;

  // Fetch data based on the 'id'
  const data = { id: id, message: `Details for item ${id}` };

  return NextResponse.json(data);
}