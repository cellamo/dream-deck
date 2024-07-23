/* eslint-disable react/no-unescaped-entities */
import React from 'react';
import { motion } from 'framer-motion';
import { Book, Globe, Brain, Sparkles, Target } from 'lucide-react';

interface DreamInterpretationProps {
  darkMode: boolean;
  interpretation: {
    dreamContent: string;
    generalInsight: string;
    culturalInterpretations: Array<{ culture: string; interpretation: string }>;
    keySymbols: Array<{ symbol: string; meaning: string }>;
    emotionalAnalysis: string;
    actionableAdvice: string[];
  };
}

const DreamInterpretation: React.FC<DreamInterpretationProps> = ({ darkMode, interpretation }) => {
  const cardBg = darkMode ? 'bg-purple-900/50' : 'bg-white/70';
  const textColor = darkMode ? 'text-purple-100' : 'text-purple-900';
  const borderColor = darkMode ? 'border-purple-500' : 'border-purple-300';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`${cardBg} ${textColor} rounded-lg shadow-xl p-6 space-y-6`}
    >
      <h2 className="text-2xl font-bold flex items-center">
        <Brain className="mr-2" /> Dream Interpretation
      </h2>

      <div className={`${borderColor} border-l-4 pl-4 italic`}>
        "{interpretation.dreamContent}"
      </div>

      <Section icon={<Sparkles />} title="General Insight">
        {interpretation.generalInsight}
      </Section>

      <Section icon={<Globe />} title="Cultural Interpretations">
        {interpretation.culturalInterpretations.map((ci, index) => (
          <div key={index} className="mb-2">
            <h4 className="font-semibold">{ci.culture}:</h4>
            <p>{ci.interpretation}</p>
          </div>
        ))}
      </Section>

      <Section icon={<Book />} title="Key Symbols">
        <div className="grid grid-cols-2 gap-4">
          {interpretation.keySymbols.map((ks, index) => (
            <motion.div
              key={index}
              className={`${darkMode ? 'bg-purple-800/50' : 'bg-purple-100/50'} p-3 rounded-lg`}
              whileHover={{ scale: 1.05 }}
            >
              <h4 className="font-semibold">{ks.symbol}</h4>
              <p className="text-sm">{ks.meaning}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section icon={<Brain />} title="Emotional Analysis">
        {interpretation.emotionalAnalysis}
      </Section>

      <Section icon={<Target />} title="Actionable Advice">
        <ul className="list-disc list-inside">
          {interpretation.actionableAdvice.map((advice, index) => (
            <li key={index}>{advice}</li>
          ))}
        </ul>
      </Section>

      <div className="text-sm italic mt-4">
        Note: Dream interpretation is subjective and culturally nuanced. These interpretations are general guidelines and should not be taken as absolute truths.
      </div>
    </motion.div>
  );
};

const Section: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
  <div>
    <h3 className="text-xl font-semibold mb-2 flex items-center">
      {icon}
      <span className="ml-2">{title}</span>
    </h3>
    <div>{children}</div>
  </div>
);

export default DreamInterpretation;