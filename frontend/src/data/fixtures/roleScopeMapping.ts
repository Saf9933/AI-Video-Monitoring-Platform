// Role scope mapping for demo - defines which classrooms each role can access
// Directors have access to all rooms ('*'), Professors have specific assigned rooms

export interface RoleScope {
  role: 'professor' | 'director';
  allowedRoomIds: '*' | string[];
  scopeCount: number;
  loginCode: string;
  description: {
    zh: string;
    en: string;
  };
  accessLevel: {
    zh: string;
    en: string;
  };
}

// Demo professor assignments - in real system this would come from user management
export const PROFESSOR_ROOM_ASSIGNMENTS: Record<string, string[]> = {
  'prof_zhang': ['classroom_001', 'classroom_002', 'classroom_003'],
  'prof_li': ['classroom_004', 'classroom_005', 'classroom_006'],
  'prof_wang': ['classroom_007', 'classroom_008'],
  'prof_demo': ['classroom_001', 'classroom_003', 'classroom_005', 'classroom_007'] // Default demo professor
};

// Total available classrooms in the system
export const ALL_CLASSROOM_IDS = [
  'classroom_001', 'classroom_002', 'classroom_003', 'classroom_004', 'classroom_005',
  'classroom_006', 'classroom_007', 'classroom_008', 'classroom_009', 'classroom_010',
  'classroom_011', 'classroom_012'
];

export function getRoleScope(role: 'professor' | 'director', userId: string = 'prof_demo'): RoleScope {
  if (role === 'director') {
    return {
      role: 'director',
      allowedRoomIds: '*',
      scopeCount: ALL_CLASSROOM_IDS.length,
      loginCode: generateLoginCode('director'),
      description: {
        zh: '主任权限 - 完整系统访问',
        en: 'Director Access - Full System Access'
      },
      accessLevel: {
        zh: '所有教室 + 原始媒体',
        en: 'All Classrooms + Original Media'
      }
    };
  } else {
    const assignedRooms = PROFESSOR_ROOM_ASSIGNMENTS[userId] || PROFESSOR_ROOM_ASSIGNMENTS['prof_demo'];
    return {
      role: 'professor',
      allowedRoomIds: assignedRooms,
      scopeCount: assignedRooms.length,
      loginCode: generateLoginCode('professor'),
      description: {
        zh: '教授权限 - 限定教室访问',
        en: 'Professor Access - Assigned Classrooms Only'
      },
      accessLevel: {
        zh: `${assignedRooms.length} 间教室 + 隐私遮罩`,
        en: `${assignedRooms.length} Classrooms + Privacy Masking`
      }
    };
  }
}

function generateLoginCode(role: string): string {
  const timestamp = Date.now().toString(36);
  const rolePrefix = role === 'director' ? 'DIR' : 'PROF';
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `${rolePrefix}-${timestamp}-${random}`;
}

export function isRoomAccessible(roomId: string, allowedRoomIds: '*' | string[]): boolean {
  if (allowedRoomIds === '*') {
    return true;
  }
  return allowedRoomIds.includes(roomId);
}

export function getUnaccessibleRoomIds(allowedRoomIds: '*' | string[]): string[] {
  if (allowedRoomIds === '*') {
    return [];
  }
  return ALL_CLASSROOM_IDS.filter(roomId => !allowedRoomIds.includes(roomId));
}

// Demo login codes for testing
export const DEMO_LOGIN_CODES = {
  professor: 'PROF-demo-ABC123',
  director: 'DIR-demo-XYZ789'
} as const;