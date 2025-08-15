import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { studentLabels } from '../i18n/students';

interface Student {
  id: string;
  name: string;
  grade: string;
  classroom: string;
  status: 'active' | 'inactive' | 'flagged';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  alertCount: number;
  lastActivity: string;
  consentStatus: 'full_consent' | 'partial_redacted' | 'no_consent';
  parentContact: string;
}

export default function StudentManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');

  // Mock student data
  const students: Student[] = [
    {
      id: 'STU-001',
      name: '张小明',
      grade: 'Grade 9',
      classroom: '教室-3A',
      status: 'active',
      riskLevel: 'low',
      alertCount: 2,
      lastActivity: '2024-01-15T10:30:00Z',
      consentStatus: 'full_consent',
      parentContact: 'zhang.parent@email.com'
    },
    {
      id: 'STU-002', 
      name: '李小红',
      grade: 'Grade 8',
      classroom: '教室-4B',
      status: 'flagged',
      riskLevel: 'high',
      alertCount: 8,
      lastActivity: '2024-01-15T09:45:00Z',
      consentStatus: 'partial_redacted',
      parentContact: 'li.parent@email.com'
    },
    {
      id: 'STU-003',
      name: '王小华',
      grade: 'Grade 10',
      classroom: '计算机室-B',
      status: 'active',
      riskLevel: 'medium',
      alertCount: 4,
      lastActivity: '2024-01-15T11:15:00Z',
      consentStatus: 'full_consent',
      parentContact: 'wang.parent@email.com'
    },
    {
      id: 'STU-004',
      name: '陈小亮',
      grade: 'Grade 7',
      classroom: '教室-2C',
      status: 'active',
      riskLevel: 'low',
      alertCount: 1,
      lastActivity: '2024-01-15T08:20:00Z',
      consentStatus: 'no_consent',
      parentContact: 'chen.parent@email.com'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-700/50 rounded-full text-xs font-medium">
            {studentLabels.active} / {studentLabels.activeEn}
          </span>
        );
      case 'flagged':
        return (
          <span className="px-2 py-1 bg-red-900/30 text-red-400 border border-red-700/50 rounded-full text-xs font-medium">
            {studentLabels.flagged} / {studentLabels.flaggedEn}
          </span>
        );
      case 'inactive':
        return (
          <span className="px-2 py-1 bg-slate-700/30 text-slate-400 border border-slate-600/50 rounded-full text-xs font-medium">
            {studentLabels.inactive} / {studentLabels.inactiveEn}
          </span>
        );
      default:
        return null;
    }
  };

  const getRiskBadge = (riskLevel: string) => {
    switch (riskLevel) {
      case 'critical':
        return (
          <span className="px-2 py-1 bg-red-900/30 text-red-400 border border-red-700/50 rounded-full text-xs font-medium">
            {studentLabels.critical} / {studentLabels.criticalEn}
          </span>
        );
      case 'high':
        return (
          <span className="px-2 py-1 bg-orange-900/30 text-orange-400 border border-orange-700/50 rounded-full text-xs font-medium">
            {studentLabels.high} / {studentLabels.highEn}
          </span>
        );
      case 'medium':
        return (
          <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-700/50 rounded-full text-xs font-medium">
            {studentLabels.medium} / {studentLabels.mediumEn}
          </span>
        );
      case 'low':
        return (
          <span className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-700/50 rounded-full text-xs font-medium">
            {studentLabels.low} / {studentLabels.lowEn}
          </span>
        );
      default:
        return null;
    }
  };

  const getConsentBadge = (consentStatus: string) => {
    switch (consentStatus) {
      case 'full_consent':
        return (
          <span className="px-2 py-1 bg-green-900/30 text-green-400 border border-green-700/50 rounded-full text-xs font-medium">
            {studentLabels.fullConsent} / {studentLabels.fullConsentEn}
          </span>
        );
      case 'partial_redacted':
        return (
          <span className="px-2 py-1 bg-yellow-900/30 text-yellow-400 border border-yellow-700/50 rounded-full text-xs font-medium">
            {studentLabels.partialRedacted} / {studentLabels.partialRedactedEn}
          </span>
        );
      case 'no_consent':
        return (
          <span className="px-2 py-1 bg-red-900/30 text-red-400 border border-red-700/50 rounded-full text-xs font-medium">
            {studentLabels.noConsent} / {studentLabels.noConsentEn}
          </span>
        );
      default:
        return null;
    }
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         student.classroom.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || student.status === statusFilter;
    const matchesRisk = !riskFilter || student.riskLevel === riskFilter;
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  return (
    <div className="space-y-4 lg:space-y-6 w-full max-w-full overflow-hidden">
      {/* Page Header */}
      <div className="bg-slate-800/50 border border-slate-700 px-4 lg:px-6 py-3 lg:py-4 rounded-xl transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-white">{studentLabels.pageTitle}</h1>
            <p className="text-slate-300 text-sm mt-1">{studentLabels.pageSubtitle}</p>
            <p className="text-slate-400 mt-1 text-sm">
              {studentLabels.pageDescription}
            </p>
          </div>
          <button className="inline-flex items-center px-3 lg:px-4 py-2 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-blue-400 bg-blue-900/30 hover:bg-blue-900/50 transition-colors">
            <Plus className="w-4 h-4 mr-2" />
            <span className="whitespace-nowrap">
              {studentLabels.addStudent}
              <span className="text-blue-300/70 ml-1 hidden lg:inline">/ {studentLabels.addStudentEn}</span>
            </span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-6 transition-all duration-200">
        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3 lg:p-6 transition-all duration-200">
          <div className="flex items-center">
            <div className="h-8 w-8 lg:h-12 lg:w-12 bg-blue-900/30 rounded-lg flex items-center justify-center border border-blue-700/50">
              <Users className="h-4 w-4 lg:h-6 lg:w-6 text-blue-400" />
            </div>
            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
              <p className="text-xs lg:text-sm font-medium text-slate-300 truncate">{studentLabels.totalStudents}</p>
              <p className="text-xs text-slate-400 hidden lg:block">{studentLabels.totalStudentsEn}</p>
              <p className="text-xl lg:text-2xl font-bold text-white">{students.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3 lg:p-6 transition-all duration-200">
          <div className="flex items-center">
            <div className="h-8 w-8 lg:h-12 lg:w-12 bg-green-900/30 rounded-lg flex items-center justify-center border border-green-700/50">
              <CheckCircle className="h-4 w-4 lg:h-6 lg:w-6 text-green-400" />
            </div>
            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
              <p className="text-xs lg:text-sm font-medium text-slate-300 truncate">{studentLabels.activeStudents}</p>
              <p className="text-xs text-slate-400 hidden lg:block">{studentLabels.activeStudentsEn}</p>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {students.filter(s => s.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3 lg:p-6 transition-all duration-200">
          <div className="flex items-center">
            <div className="h-8 w-8 lg:h-12 lg:w-12 bg-red-900/30 rounded-lg flex items-center justify-center border border-red-700/50">
              <AlertTriangle className="h-4 w-4 lg:h-6 lg:w-6 text-red-400" />
            </div>
            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
              <p className="text-xs lg:text-sm font-medium text-slate-300 truncate">{studentLabels.flaggedStudents}</p>
              <p className="text-xs text-slate-400 hidden lg:block">{studentLabels.flaggedStudentsEn}</p>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {students.filter(s => s.status === 'flagged').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-3 lg:p-6 transition-all duration-200">
          <div className="flex items-center">
            <div className="h-8 w-8 lg:h-12 lg:w-12 bg-orange-900/30 rounded-lg flex items-center justify-center border border-orange-700/50">
              <Clock className="h-4 w-4 lg:h-6 lg:w-6 text-orange-400" />
            </div>
            <div className="ml-3 lg:ml-4 min-w-0 flex-1">
              <p className="text-xs lg:text-sm font-medium text-slate-300 truncate">{studentLabels.highRiskStudents}</p>
              <p className="text-xs text-slate-400 hidden lg:block">{studentLabels.highRiskStudentsEn}</p>
              <p className="text-xl lg:text-2xl font-bold text-white">
                {students.filter(s => s.riskLevel === 'high' || s.riskLevel === 'critical').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-3 lg:p-4 transition-all duration-200">
        <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder={studentLabels.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-md text-sm text-slate-200 placeholder:text-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
              />
            </div>
          </div>
          
          <div className="flex gap-2 lg:gap-3">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 min-w-0 flex-1 lg:flex-none lg:w-auto"
            >
              <option value="">{studentLabels.allStatus}</option>
              <option value="active">{studentLabels.active}</option>
              <option value="flagged">{studentLabels.flagged}</option>
              <option value="inactive">{studentLabels.inactive}</option>
            </select>
            
            <select 
              value={riskFilter} 
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-sm text-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200 min-w-0 flex-1 lg:flex-none lg:w-auto"
            >
              <option value="">{studentLabels.allRiskLevels}</option>
              <option value="low">{studentLabels.low}</option>
              <option value="medium">{studentLabels.medium}</option>
              <option value="high">{studentLabels.high}</option>
              <option value="critical">{studentLabels.critical}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-800/50 rounded-xl border border-slate-700 overflow-hidden transition-all duration-200">
        <div className="px-4 lg:px-6 py-3 lg:py-4 border-b border-slate-600">
          <h3 className="text-base lg:text-lg font-medium text-white">
            {studentLabels.student} ({filteredStudents.length})
          </h3>
          <p className="text-sm text-slate-400 hidden lg:block">{studentLabels.studentEn} List</p>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-600">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  <div className="lg:hidden">{studentLabels.student}</div>
                  <div className="hidden lg:block">{studentLabels.student}</div>
                  <div className="text-slate-400 normal-case hidden lg:block">{studentLabels.studentEn}</div>
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider hidden xl:table-cell">
                  <div>{studentLabels.classroom}</div>
                  <div className="text-slate-400 normal-case">{studentLabels.classroomEn}</div>
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  <div className="lg:hidden">{studentLabels.status}</div>
                  <div className="hidden lg:block">{studentLabels.status}</div>
                  <div className="text-slate-400 normal-case hidden lg:block">{studentLabels.statusEn}</div>
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  <div className="lg:hidden">{studentLabels.riskLevel}</div>
                  <div className="hidden lg:block">{studentLabels.riskLevel}</div>
                  <div className="text-slate-400 normal-case hidden lg:block">{studentLabels.riskLevelEn}</div>
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider hidden xl:table-cell">
                  <div>{studentLabels.alerts}</div>
                  <div className="text-slate-400 normal-case">{studentLabels.alertsEn}</div>
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider hidden xl:table-cell">
                  <div>{studentLabels.consent}</div>
                  <div className="text-slate-400 normal-case">{studentLabels.consentEn}</div>
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider hidden xl:table-cell">
                  <div>{studentLabels.lastActivity}</div>
                  <div className="text-slate-400 normal-case">{studentLabels.lastActivityEn}</div>
                </th>
                <th className="px-4 lg:px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                  <div className="lg:hidden">{studentLabels.actions}</div>
                  <div className="hidden lg:block">{studentLabels.actions}</div>
                  <div className="text-slate-400 normal-case hidden lg:block">{studentLabels.actionsEn}</div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-slate-800/30 divide-y divide-slate-600">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-slate-800/60 transition-all duration-200">
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{student.name}</div>
                      <div className="text-xs lg:text-sm text-slate-400">{student.id} • {student.grade}</div>
                      <div className="xl:hidden text-xs text-slate-400 mt-1 flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {student.classroom}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap hidden xl:table-cell">
                    <div className="flex items-center text-sm text-slate-200">
                      <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                      {student.classroom}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                    {getStatusBadge(student.status)}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap">
                    {getRiskBadge(student.riskLevel)}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap hidden xl:table-cell">
                    <div className="text-sm text-slate-200">
                      {student.alertCount > 0 ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-900/30 text-red-400 border border-red-700/50">
                          {student.alertCount} {studentLabels.alertsCount}
                        </span>
                      ) : (
                        <span className="text-slate-400">{studentLabels.noAlerts}</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap hidden xl:table-cell">
                    {getConsentBadge(student.consentStatus)}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm text-slate-400 hidden xl:table-cell">
                    {new Date(student.lastActivity).toLocaleDateString()} at{' '}
                    {new Date(student.lastActivity).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-4 lg:px-6 py-3 lg:py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-1 lg:space-x-2">
                      <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200 p-1">
                        <Eye className="w-3 h-3 lg:w-4 lg:h-4" />
                      </button>
                      <button className="text-slate-400 hover:text-slate-300 transition-colors duration-200 p-1">
                        <Edit className="w-3 h-3 lg:w-4 lg:h-4" />
                      </button>
                      <button className="text-red-400 hover:text-red-300 transition-colors duration-200 p-1">
                        <Trash2 className="w-3 h-3 lg:w-4 lg:h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-2 text-sm font-medium text-white">{studentLabels.noStudentsFound}</h3>
            <p className="text-xs text-slate-400 mt-1">{studentLabels.noStudentsFoundEn}</p>
            <p className="mt-1 text-sm text-slate-400">
              {studentLabels.adjustCriteria}
            </p>
            <p className="text-xs text-slate-500 mt-1">{studentLabels.adjustCriteriaEn}</p>
          </div>
        )}
      </div>
    </div>
  );
}