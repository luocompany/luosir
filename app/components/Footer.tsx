"use client";
import ThemeToggle from './ThemeToggle';

export default function Footer() {
  return (
    <footer className="w-full py-8 bg-gray-50 dark:bg-gray-900 mt-auto relative">
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <div className="space-y-4">
          <a href="mailto:hi@luosir.top" className="text-gray-600 hover:text-gray-900 flex items-center">
            hi@luosir.top ↗
          </a>
          <div className="flex items-center space-x-2 text-gray-600">
            <span>Made by Roger</span>
          </div>
        </div>
        
        
      </div>
      
      <div className="absolute bottom-8 right-8">
        <ThemeToggle />
      </div>
    </footer>
  );
}