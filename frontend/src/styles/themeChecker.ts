// Theme Consistency Checker and Utilities
// Ensures runtime theme consistency between pages

import React from 'react';
import { checkThemeConsistency } from './theme';

export interface ThemeCheckResult {
  isConsistent: boolean;
  issues: string[];
  recommendations: string[];
}

// Theme consistency checker function
export function runThemeCheck(): ThemeCheckResult {
  const issues: string[] = [];
  const recommendations: string[] = [];

  try {
    // Check if CSS custom properties are applied
    const root = document.documentElement;
    const computedStyle = getComputedStyle(root);
    
    // Check primary color consistency
    const primaryColor = computedStyle.getPropertyValue('--color-primary').trim();
    if (!primaryColor) {
      issues.push('Primary color custom property not found');
      recommendations.push('Ensure applyCssVars() is called in main.tsx');
    }
    
    // Check if homepage theme tokens match current theme
    const isConsistent = checkThemeConsistency();
    if (!isConsistent) {
      issues.push('Theme tokens inconsistent with homepage');
      recommendations.push('Run applyCssVars() to sync theme tokens');
    }
    
    // Check for common theme issues
    const bgPrimary = computedStyle.getPropertyValue('--color-bg-primary').trim();
    const textPrimary = computedStyle.getPropertyValue('--color-text-primary').trim();
    
    if (!bgPrimary || !textPrimary) {
      issues.push('Essential color tokens missing');
      recommendations.push('Verify theme.ts is properly imported and applied');
    }
    
    // Check contrast ratios (simplified)
    const body = document.body;
    const bodyStyles = getComputedStyle(body);
    const backgroundColor = bodyStyles.backgroundColor;
    const color = bodyStyles.color;
    
    if (!backgroundColor.includes('rgb') && !backgroundColor.includes('#')) {
      issues.push('Body background color not properly set');
      recommendations.push('Ensure base styles are applied in index.css');
    }

  } catch (error) {
    issues.push(`Theme check failed: ${error}`);
    recommendations.push('Check browser console for detailed errors');
  }

  return {
    isConsistent: issues.length === 0,
    issues,
    recommendations
  };
}

// Helper function to log theme check results
export function logThemeCheck(): void {
  const result = runThemeCheck();
  
  if (result.isConsistent) {
    console.log('✅ Theme consistency check passed');
  } else {
    console.warn('⚠️  Theme consistency issues detected:');
    result.issues.forEach(issue => console.warn(`  - ${issue}`));
    console.log('💡 Recommendations:');
    result.recommendations.forEach(rec => console.log(`  - ${rec}`));
  }
}

// Runtime theme consistency assertion for tests
export function assertThemeConsistency(): void {
  const result = runThemeCheck();
  if (!result.isConsistent) {
    throw new Error(`Theme consistency check failed: ${result.issues.join(', ')}`);
  }
}

// Component for development mode theme debugging
export function ThemeDebugger({ visible = false }: { visible?: boolean }): JSX.Element | null {
  if (!visible || !import.meta.env.DEV) return null;

  const result = runThemeCheck();
  
  return React.createElement('div', {
    className: 'fixed bottom-4 right-4 bg-slate-800 border border-slate-600 rounded-lg p-4 text-xs max-w-md z-50'
  }, [
    React.createElement('div', { key: 'title', className: 'font-semibold mb-2' }, 'Theme Debug Panel'),
    React.createElement('div', {
      key: 'status',
      className: `mb-2 ${result.isConsistent ? 'text-emerald-400' : 'text-red-400'}`
    }, `Status: ${result.isConsistent ? '✅ Consistent' : '❌ Issues Found'}`),
    
    result.issues.length > 0 && React.createElement('div', { key: 'issues', className: 'mb-2' }, [
      React.createElement('div', { key: 'issues-title', className: 'font-medium text-red-400' }, 'Issues:'),
      ...result.issues.map((issue, i) => 
        React.createElement('div', { key: `issue-${i}`, className: 'text-red-300' }, `• ${issue}`)
      )
    ]),
    
    result.recommendations.length > 0 && React.createElement('div', { key: 'recommendations' }, [
      React.createElement('div', { key: 'rec-title', className: 'font-medium text-yellow-400' }, 'Recommendations:'),
      ...result.recommendations.map((rec, i) => 
        React.createElement('div', { key: `rec-${i}`, className: 'text-yellow-300' }, `• ${rec}`)
      )
    ])
  ].filter(Boolean));
}

// Auto-run theme check in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  // Wait for DOM to be ready
  const runCheck = () => {
    try {
      setTimeout(logThemeCheck, 1000);
    } catch (error) {
      console.warn('Theme check failed:', error);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runCheck);
  } else {
    runCheck();
  }
}