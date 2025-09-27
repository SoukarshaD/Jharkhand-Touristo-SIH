// frontend/src/pages/AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import { fetchAnalyticsSummary } from '../api/api';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Link } from 'react-router-dom'; // Import Link

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AdminDashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => { load(); }, []);
  async function load() {
    try {
      const data = await fetchAnalyticsSummary();
      setSummary(data);
    } catch (error) {
      console.error("Failed to fetch analytics summary:", error);
      setSummary({ totals: {}, topDestinationTags: [], sentiment_analysis: {}, generatedAt: new Date() });
    }
  }

  if (!summary) return <div className="p-6">Loading analytics…</div>;

  const t = summary.totals;

  const colors = {
    Positive: 'rgb(75, 192, 192)',
    Negative: 'rgb(255, 99, 132)',
    Neutral: 'rgb(54, 162, 235)',
  };

  const chartData = {
    labels: Object.keys(summary.sentiment_analysis),
    datasets: [
      {
        label: 'Reviews by Sentiment',
        data: Object.values(summary.sentiment_analysis),
        backgroundColor: Object.keys(summary.sentiment_analysis).map(key => colors[key]),
        borderColor: Object.keys(summary.sentiment_analysis).map(key => colors[key]),
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Sentiment Analysis of Reviews' },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: 'Number of Reviews' } }
    }
  };

  return (
    <div className="container p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Tourism Analytics</h1>
        {/* ADD THIS LINK */}
        <Link to="/admin/users" className="btn">Manage Users</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
        <div className="card bg-white rounded-lg shadow-md p-4 text-center"><h3>Destinations</h3><p className="text-2xl font-bold mt-2">{t.destinations || 0}</p></div>
        <div className="card bg-white rounded-lg shadow-md p-4 text-center"><h3>Products</h3><p className="text-2xl font-bold mt-2">{t.products || 0}</p></div>
        <div className="card bg-white rounded-lg shadow-md p-4 text-center"><h3>Events</h3><p className="text-2xl font-bold mt-2">{t.events || 0}</p></div>
        <div className="card bg-white rounded-lg shadow-md p-4 text-center"><h3>Homestays</h3><p className="text-2xl font-bold mt-2">{t.homestays || 0}</p></div>
        <div className="card bg-white rounded-lg shadow-md p-4 text-center"><h3>Bookings</h3><p className="text-2xl font-bold mt-2">{t.bookings || 0}</p></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        <div className="card bg-white rounded-lg shadow-md p-4">
          <h3 className="font-bold mb-2">Top Destination Tags</h3>
          <ul className="list-disc list-inside">
            {summary.topDestinationTags.map(x => (
              <li key={x.tag}>{x.tag} — {x.count} mentions</li>
            ))}
          </ul>
          <p className="mt-4 text-xs opacity-70">Updated: {new Date(summary.generatedAt).toLocaleString()}</p>
        </div>

        <div className="card bg-white rounded-lg shadow-md p-4">
          <Bar data={chartData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}