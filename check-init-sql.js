// check-init-sql.js
// สคริปต์นี้จะตรวจสอบว่า columns ใน init.sql ตรงกับ entity ของ service หรือไม่
const fs = require('fs');
const path = require('path');

// กำหนด mapping ตารางกับ entity (ใช้ path string แทน require)
const entityMap = {
  users: path.join(__dirname, 'src/user/entities/user.entity.ts'),
  bills: path.join(__dirname, 'src/bills/entities/bill.entity.ts'),
  bill_logs: path.join(__dirname, 'src/bill_logs/entities/bill_log.entity.ts'),
  bill_followers: path.join(__dirname, 'src/bill_followers/entities/bill_follower.entity.ts'),
};

// อ่านไฟล์ init.sql
const sql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');

// ฟังก์ชันดึง columns จาก SQL
function extractColumns(sql, table) {
  const regex = new RegExp(`CREATE TABLE IF NOT EXISTS ${table} \\(([^;]+?)\\);`, 's');
  const match = sql.match(regex);
  if (!match) return [];
  return match[1]
    .split(',\n')
    .map(line => line.trim().split(' ')[0])
    .filter(col => col && !col.startsWith('--'));
}

// ฟังก์ชันดึง properties จาก entity (TypeScript)
function extractEntityProps(entityPath) {
  const content = fs.readFileSync(entityPath, 'utf8');
  const propRegex = /@Column\([^)]*\)\s+([a-zA-Z0-9_]+):/g;
  const props = [];
  let match;
  while ((match = propRegex.exec(content))) {
    props.push(match[1]);
  }
  // PrimaryGeneratedColumn
  const idRegex = /@PrimaryGeneratedColumn\([^)]*\)\s+([a-zA-Z0-9_]+):/g;
  while ((match = idRegex.exec(content))) {
    props.push(match[1]);
  }
  // CreateDateColumn, UpdateDateColumn, DeleteDateColumn
  const dateRegex = /@(CreateDateColumn|UpdateDateColumn|DeleteDateColumn)\([^)]*\)\s+([a-zA-Z0-9_]+):/g;
  while ((match = dateRegex.exec(content))) {
    props.push(match[2]);
  }
  return props;
}

// ฟังก์ชัน normalize ชื่อ column (ลบ _, แปลงเป็น lowercase)
function normalize(col) {
  return col.replace(/_/g, '').toLowerCase();
}

// ฟังก์ชันหา column ที่คล้ายกัน (fuzzy match)
function findSimilar(col, candidates) {
  const norm = normalize(col);
  return candidates.find(c => normalize(c) === norm);
}

// --- เพิ่มฟังก์ชันแก้ไข entity ให้ตรงกับ SQL ---
function syncEntityWithSql(entityPath, sqlCols, entityCols) {
  let content = fs.readFileSync(entityPath, 'utf8');
  let changed = false;
  // เพิ่ม property ที่มีใน SQL แต่ไม่มีใน entity
  sqlCols.forEach(col => {
    if (!entityCols.includes(col)) {
      // เพิ่ม property แบบ basic (string, nullable)
      // กำหนด type เป็น string และ nullable: true เป็น default
      // (ถ้าต้องการ type เฉพาะเจาะจงต้องปรับเองภายหลัง)
      const prop = `\n  @Column({ name: '${col}', nullable: true })\n  ${col}: string;\n`;
      // แทรกก่อนปิด class
      content = content.replace(/}\s*$/, prop + '}');
      changed = true;
      console.log(`    SYNC: เพิ่ม property '${col}' ใน entity ให้ตรงกับ SQL`);
    }
  });
  // ลบ property ที่มีใน entity แต่ไม่มีใน SQL
  entityCols.forEach(col => {
    if (!sqlCols.includes(col)) {
      // ลบทั้ง decorator และ property
      const regex = new RegExp(`\n\s*@[^@\n]+\n\s*${col}:[^;]+;\n`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, '\n');
        changed = true;
        console.log(`    SYNC: ลบ property '${col}' ใน entity เพราะไม่มีใน SQL`);
      }
    }
  });
  if (changed) {
    fs.writeFileSync(entityPath, content, 'utf8');
    console.log(`    SYNC: อัปเดตไฟล์ ${entityPath} เรียบร้อย`);
  }
}

// ตรวจสอบแต่ละตาราง
for (const [table, entityPath] of Object.entries(entityMap)) {
  const sqlCols = extractColumns(sql, table);
  const entityCols = extractEntityProps(entityPath);
  const missingInEntity = sqlCols.filter(col => !entityCols.includes(col));
  const missingInSql = entityCols.filter(col => !sqlCols.includes(col));
  console.log(`\nTable: ${table}`);
  console.log('  Columns in SQL but not in Entity:', missingInEntity);
  console.log('  Columns in Entity but not in SQL:', missingInSql);

  // เช็คชื่อ column ที่คล้ายกันแต่สะกดไม่ตรง
  missingInEntity.forEach(col => {
    const similar = findSimilar(col, entityCols);
    if (similar) {
      console.log(`    HINT: Column '${col}' in SQL is similar to '${similar}' in Entity.`);
    }
  });
  missingInSql.forEach(col => {
    const similar = findSimilar(col, sqlCols);
    if (similar) {
      console.log(`    HINT: Column '${col}' in Entity is similar to '${similar}' in SQL.`);
    }
  });

  // --- เรียกฟังก์ชัน sync ---
  syncEntityWithSql(entityPath, sqlCols, entityCols);
}
