"use client";

import Navbar from '../components/Navbar';
import WorldClock from '../components/WorldClock';

export default function Tools() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        <div className="bg-[var(--background)] text-[var(--foreground)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* World Clock */}
              <WorldClock />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 