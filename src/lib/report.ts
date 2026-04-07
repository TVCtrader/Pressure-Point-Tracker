import { AppState, ChecklistItem } from '../types';
import { SOCIAL_PRESSURE_ITEMS, INVESTMENT_PRESSURE_ITEMS, SELF_PROTECTION_ITEMS } from '../constants';

export function generateMarkdownReport(state: AppState): string {
  let report = '# Pressure Points Analysis Report\n\n';
  report += `Generated on: ${new Date().toLocaleString()}\n\n`;

  const sections = [
    { title: '社會壓力點辨識 (Social Pressure Points)', items: SOCIAL_PRESSURE_ITEMS, category: 'FAT' },
    { title: '投資市場壓力點 (Investment Market)', items: INVESTMENT_PRESSURE_ITEMS, category: 'TREPAN' },
    { title: '自保與預判策略 (Self-Protection)', items: SELF_PROTECTION_ITEMS, category: 'PROTECTION' },
  ];

  sections.forEach((section) => {
    report += `## ${section.title}\n\n`;
    section.items.forEach((item) => {
      const isChecked = state.checkedItems[item.id] ? '[x]' : '[ ]';
      report += `### ${isChecked} ${item.title}\n`;
      report += `*Description:* ${item.description}\n`;
      if (state.itemNotes[item.id]) {
        report += `*Notes:* ${state.itemNotes[item.id]}\n`;
      }
      report += '\n';
    });

    if (state.summaryNotes[section.category]) {
      report += `**Phase Summary:**\n${state.summaryNotes[section.category]}\n\n`;
    }
    report += '---\n\n';
  });

  return report;
}

export function downloadFile(content: string, fileName: string, contentType: string) {
  const a = document.createElement('a');
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}
