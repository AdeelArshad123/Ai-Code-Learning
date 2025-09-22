import React from 'react';

const LandingPage = () => {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">
            The Future of Code Learning is Here
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            CodeMentorAI is a comprehensive educational SaaS platform that provides AI-powered programming education to help you master coding faster.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300">
            Get Started
          </button>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
