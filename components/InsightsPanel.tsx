import React from 'react';
import { BarChart, PieChart, LucideIcon } from 'lucide-react';

const InsightsPanel = () => {
  return (
    <div className="bg-blue-900/30 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Dream Insights</h2>
      <div className="space-y-4">
        <InsightCard
          icon={BarChart}
          title="Emotion Trends"
          description="Joy and excitement are your most common dream emotions this week."
        />
        <InsightCard
          icon={PieChart}
          title="Theme Analysis"
          description="33% of your recent dreams involve flying or falling."
        />
      </div>
    </div>
  );
};

interface InsightCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

const InsightCard: React.FC<InsightCardProps> = ({ icon: Icon, title, description }) => (
  <div className="bg-gray-800/50 rounded p-4 flex items-start space-x-4">
    <Icon className="text-teal-400" size={24} />
    <div>
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  </div>
);

export default InsightsPanel;
