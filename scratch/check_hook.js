'use strict';
/* check_hook.js — cầu nối giữa hook PostToolUse của Claude Code và scratch/check.js.
   Cắm ở .claude/settings.json, matcher "Edit|Write|MultiEdit". Claude Code đẩy một JSON vào stdin:
     { "tool_name":"Edit", "tool_input":{"file_path":"...\\js\\data.js"}, "tool_response":{...} }

   Việc của script: sửa file có ảnh hưởng tới phép soát thì chạy check.js, KHÔNG thì im lặng thoát 0
   (sửa css hay ảnh không việc gì phải soát lại truyện). Đỏ thì in ra stderr và thoát **2** — mã 2 của
   PostToolUse là "báo lại cho Claude", để nó thấy ngay chỗ vừa làm hỏng thay vì đi tiếp rồi mới biết.

   Tự thử:  echo '{"tool_input":{"file_path":"js/data.js"}}' | node scratch/check_hook.js ; echo $? */

const { execFileSync } = require('child_process');
const path = require('path');
const ROOT = path.join(__dirname, '..');   // không dựa vào cwd của hook

/* File nào thì đáng soát lại: mọi .js trong js/ (data/story/comic đều nuôi lint), và bản prompt comic
   vì comic_lint đối chiếu khổ ảnh với nó. */
const MATTERS = /(^|[\\/])(js[\\/][^\\/]+\.js|docs[\\/]comic-prompts\.md)$/i;

let raw = '';
process.stdin.on('data', d => { raw += d; });
process.stdin.on('end', () => {
  let p = {};
  try { p = JSON.parse(raw); } catch (e) { process.exit(0); }   // không đọc được thì đừng cản đường
  const f = (p.tool_input && p.tool_input.file_path) || (p.tool_response && p.tool_response.filePath) || '';
  if (!MATTERS.test(String(f).replace(/\\/g, '/'))) process.exit(0);

  try {
    execFileSync(process.execPath, [path.join(__dirname, 'check.js')], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
    process.exit(0);   // xanh: im lặng, không làm bẩn transcript
  } catch (e) {
    const out = ((e.stdout || '') + (e.stderr || '')).trim();
    process.stderr.write('node scratch/check.js báo đỏ sau khi sửa ' + f + ':\n\n' + out + '\n');
    process.exit(2);   // 2 = đưa stderr này trở lại cho Claude đọc
  }
});
