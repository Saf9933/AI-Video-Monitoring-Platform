import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  School, 
  Building, 
  Activity, 
  Coffee, 
  Home,
  Shield
} from 'lucide-react';
import ScenarioCard, { Scenario } from '../../components/scenarios/ScenarioCard';

const scenarios: Scenario[] = [
  {
    id: 'classrooms',
    title: '教室',
    titleEn: 'Classrooms',
    description: '监测情绪变化，防范校园霸凌，标记异常学生行为',
    descriptionEn: 'Detect emotions, monitor bullying, flag abnormal student behaviors',
    icon: School,
    color: 'from-blue-500 to-cyan-500',
    bgPattern: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    features: ['情绪识别', '霸凌检测', '行为分析', '注意力监控'],
    cameraCount: 15,
    isActive: true
  },
  {
    id: 'hallways',
    title: '走廊 / 公共区域',
    titleEn: 'Hallways & Commons',
    description: '监控冲突事件，人群密度，不安全行为预警',
    descriptionEn: 'Watch for conflicts, crowding, unsafe behavior',
    icon: Building,
    color: 'from-emerald-500 to-teal-500',
    bgPattern: 'bg-emerald-500/10',
    borderColor: 'border-emerald-500/30',
    features: ['冲突检测', '人群监控', '安全预警', '流量分析'],
    cameraCount: 12,
    isActive: true
  },
  {
    id: 'playground',
    title: '操场',
    titleEn: 'Sports Grounds',
    description: '监控大型聚集，斗争事件，异常人群运动',
    descriptionEn: 'Monitor large gatherings, fights, unusual crowd motion',
    icon: Activity,
    color: 'from-orange-500 to-red-500',
    bgPattern: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    features: ['聚集监控', '运动分析', '事件检测', '安全管理'],
    cameraCount: 8,
    isActive: true
  },
  {
    id: 'cafeteria',
    title: '食堂',
    titleEn: 'Cafeteria',
    description: '监控霸凌行为，食物争斗，情绪困扰学生',
    descriptionEn: 'Watch for bullying, food fights, emotional distress',
    icon: Coffee,
    color: 'from-purple-500 to-pink-500',
    bgPattern: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    features: ['霸凌防范', '纠纷检测', '情绪监控', '秩序维护'],
    cameraCount: 10,
    isActive: true
  },
  {
    id: 'dormitories',
    title: '宿舍',
    titleEn: 'Dormitories',
    description: '安全监控，夜间异常(仅出入口，保护隐私)',
    descriptionEn: 'Focus on safety, nighttime anomalies (entrances/exits only)',
    icon: Home,
    color: 'from-indigo-500 to-purple-500',
    bgPattern: 'bg-indigo-500/10',
    borderColor: 'border-indigo-500/30',
    features: ['出入监控', '夜间安全', '隐私保护', '异常检测'],
    cameraCount: 6,
    isActive: true
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function ScenariosHub() {
  const navigate = useNavigate();

  const handleScenarioClick = (scenarioId: string) => {
    navigate(`/scenarios/${scenarioId}`);
  };

  const totalCameras = scenarios.reduce((total, scenario) => total + (scenario.cameraCount || 0), 0);
  const activeScenarios = scenarios.filter(scenario => scenario.isActive).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-2"
        >
          <h1 className="text-3xl font-bold text-white">监控场景中心</h1>
          <p className="text-lg text-slate-400">Monitoring Scenarios Hub</p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-2xl mx-auto"
        >
          <p className="text-slate-300 leading-relaxed">
            选择监控场景以查看实时摄像头画面和智能分析数据。每个场景都配置了专门的AI模型和检测算法。
          </p>
          <p className="text-sm text-slate-500 mt-2 italic">
            Select a monitoring scenario to view real-time camera feeds and intelligent analysis data.
          </p>
        </motion.div>
      </div>

      {/* Stats Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-emerald-400">{activeScenarios}</div>
          <div className="text-sm text-slate-400">活跃场景</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">{totalCameras}</div>
          <div className="text-sm text-slate-400">总摄像头</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">24/7</div>
          <div className="text-sm text-slate-400">全天监控</div>
        </div>
      </motion.div>

      {/* Scenarios Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {scenarios.map((scenario, index) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            index={index}
            onClick={() => handleScenarioClick(scenario.id)}
          />
        ))}
      </motion.div>

      {/* Footer Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center space-y-2 pt-8 border-t border-slate-700/30"
      >
        <div className="flex items-center justify-center space-x-2 text-sm text-slate-400">
          <Shield className="w-4 h-4" />
          <span>隐私保护 · 数据加密 · 智能分析</span>
        </div>
        <p className="text-xs text-slate-500">
          所有视频数据都经过加密处理，符合隐私保护法规要求
        </p>
      </motion.div>
    </div>
  );
}