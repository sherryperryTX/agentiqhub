// Run with: node sql/generate-seed.js > sql/02-seed-data.sql
// This reads course-data.ts and generates INSERT statements

const fs = require('fs');
const path = require('path');

// Read the course-data.ts file
const content = fs.readFileSync(path.join(__dirname, '..', 'lib', 'course-data.ts'), 'utf8');

// Extract the MODULES array - we'll parse it manually since it's TS
// We need to evaluate the data. Let's extract just the array content.
const modulesMatch = content.match(/export const MODULES: Module\[\] = \[([\s\S]*)\];/);
if (!modulesMatch) {
  console.error('Could not find MODULES array');
  process.exit(1);
}

// Instead of parsing TS, let's use a simpler approach - require a JS version
// Create a temporary JS file
const jsContent = content
  .replace(/export interface \w+ \{[\s\S]*?\}/g, '')
  .replace(/export const SECTIONS[\s\S]*?\];/, '')
  .replace('export const MODULES: Module[] =', 'module.exports =')
  .replace(/\/\/ Premium Tier Modules.*$/m, '');

const tmpFile = path.join(__dirname, '_tmp_modules.js');
fs.writeFileSync(tmpFile, jsContent);

const MODULES = require(tmpFile);
fs.unlinkSync(tmpFile);

function esc(str) {
  if (!str) return '';
  return str.replace(/'/g, "''");
}

let sql = `-- =====================================================\n`;
sql += `-- Seed data: Migrate existing course content to database\n`;
sql += `-- Run this AFTER 01-course-tables.sql\n`;
sql += `-- =====================================================\n\n`;

// Insert modules
for (const mod of MODULES) {
  sql += `INSERT INTO public.course_modules (id, title, section, description, tier, sort_order)\n`;
  sql += `VALUES (${mod.id}, '${esc(mod.title)}', '${esc(mod.section)}', '${esc(mod.description)}', '${mod.tier}', ${mod.id})\n`;
  sql += `ON CONFLICT (id) DO NOTHING;\n\n`;
}

// Reset sequence
sql += `SELECT setval('course_modules_id_seq', (SELECT MAX(id) FROM course_modules));\n\n`;

// Insert lessons
for (const mod of MODULES) {
  for (let i = 0; i < mod.lessons.length; i++) {
    const lesson = mod.lessons[i];
    sql += `INSERT INTO public.course_lessons (id, module_id, title, content, video_url, sort_order)\n`;
    sql += `VALUES ('${esc(lesson.id)}', ${mod.id}, '${esc(lesson.title)}', '${esc(lesson.content)}', ${lesson.videoUrl ? `'${esc(lesson.videoUrl)}'` : 'NULL'}, ${i + 1})\n`;
    sql += `ON CONFLICT (id) DO NOTHING;\n\n`;
  }
}

// Insert quizzes
for (const mod of MODULES) {
  for (let i = 0; i < mod.quiz.length; i++) {
    const q = mod.quiz[i];
    const optionsJson = JSON.stringify(q.options).replace(/'/g, "''");
    sql += `INSERT INTO public.course_quizzes (module_id, question, options, correct_index, sort_order)\n`;
    sql += `VALUES (${mod.id}, '${esc(q.question)}', '${optionsJson}'::jsonb, ${q.correct}, ${i + 1});\n\n`;
  }
}

console.log(sql);
