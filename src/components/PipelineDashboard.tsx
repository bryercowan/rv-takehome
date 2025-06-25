import React from "react";
import DealList from "./DealList";
import PerformanceMetrics from "./PerformanceMetrics";
import PipelineFunnel from "./PipelineFunnel";
import Link from "next/link";

const PipelineDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* ---------- header row ---------- */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Pipeline Analytics Dashboard
          </h1>

          <Link
            href="/territories"
            className="inline-flex items-center gap-2 rounded-md
                       bg-indigo-600 px-4 py-2 text-white font-medium
                       shadow hover:bg-indigo-700 transition
                       focus-visible:outline-none focus-visible:ring
                       focus-visible:ring-indigo-400"
          >
            <span role="img" aria-hidden>
              🗺
            </span>
            Open Territory Dashboard
          </Link>
        </div>


        <div className="grid gap-6">
          {/* Pipeline Overview Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Pipeline Overview
            </h2>
            <PipelineFunnel />
          </div>

          {/* Performance Metrics Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Performance Metrics
            </h2>
            <PerformanceMetrics />
          </div>

          {/* Deal List Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Deal List
            </h2>
            <DealList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PipelineDashboard;
