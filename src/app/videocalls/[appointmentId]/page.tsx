import VideoJoin from '@/Components/VideoCall/Videocall2';
import { Suspense } from 'react';
// import VideoCall from './VideoCall'; // Adjust the import path as needed

export default function VideocallsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen justify-center items-center">Loading video call...</div>}>
      <VideoJoin />
    </Suspense>
  );
}