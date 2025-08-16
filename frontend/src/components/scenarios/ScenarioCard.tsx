import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Camera, Eye } from 'lucide-react';

export interface Scenario {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: React.ComponentType<any>;
  color: string;
  bgPattern: string;
  borderColor: string;
  features: string[];
  cameraCount?: number;
  isActive?: boolean;
}

interface ScenarioCardProps {
  scenario: Scenario;
  index: number;
  onClick: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function ScenarioCard({ scenario, index, onClick }: ScenarioCardProps) {
  const IconComponent = scenario.icon;
  const cameraCount = scenario.cameraCount || 12;
  const isActive = scenario.isActive !== false;

  return (
    <motion.div
      variants={cardVariants}
      whileHover={{ 
        scale: 1.02, 
        y: -4,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
      className={`relative overflow-hidden rounded-xl ${scenario.bgPattern} ${scenario.borderColor} border backdrop-blur-sm cursor-pointer group`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`打开 ${scenario.title} 监控场景`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${scenario.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Content */}
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${scenario.color} shadow-lg`}>
              <IconComponent className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{scenario.title}</h3>
              <p className="text-sm text-slate-400">{scenario.titleEn}</p>
            </div>
          </div>
          <ArrowRight 
            className="w-5 h-5 text-slate-400 group-hover:text-white transition-colors transform group-hover:translate-x-1 transition-transform duration-200" 
            aria-hidden="true"
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <p className="text-slate-300 text-sm leading-relaxed">{scenario.description}</p>
          <p className="text-slate-500 text-xs italic">{scenario.descriptionEn}</p>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {scenario.features.map((feature, featureIndex) => (
            <span
              key={featureIndex}
              className="px-2 py-1 text-xs rounded-md bg-slate-800/60 text-slate-300 border border-slate-700/50"
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-700/30">
          <div className="flex items-center space-x-4 text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <Camera className="w-3 h-3" aria-hidden="true" />
              <span>{cameraCount}个摄像头</span>
            </div>
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3" aria-hidden="true" />
              <span>实时监控</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-xs">
            <div 
              className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-400' : 'bg-gray-400'}`}
              aria-hidden="true"
            />
            <span className={isActive ? 'text-green-400' : 'text-gray-400'}>
              {isActive ? '活跃' : '离线'}
            </span>
          </div>
        </div>
      </div>

      {/* Hover effect border */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      {/* Focus ring for accessibility */}
      <div className="absolute inset-0 rounded-xl ring-2 ring-blue-500 ring-opacity-0 group-focus:ring-opacity-50 transition-all duration-200" />
    </motion.div>
  );
}