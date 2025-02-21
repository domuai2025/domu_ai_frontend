"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Fetch user-specific data or handle authentication checks here
    // For now, we assume the user is logged in if they can access this page
    console.log("Welcome to the Dashboard!");
  }, []);

  return (
    <div className="h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to your Dashboard</h1>
        <p className="text-gray-600">Here you can manage your data and settings.</p>
        <button
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
          onClick={() => router.push("/workspace/create")} // Navigate to workspace creation
        >
          Go to Workspace
        </button>
      </div>
    </div>
  );
}
