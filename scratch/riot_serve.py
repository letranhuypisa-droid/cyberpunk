"""Chạy localhost và mở THẲNG chế độ DẸP LOẠN để kiểm (docs/dep-loan.md Q15).

    python scratch/riot_serve.py [cổng]          mặc định 8802 (launch "static-riot")

Giống hệt `python -m http.server` (phục vụ thư mục gốc của repo, bind 127.0.0.1), chỉ thêm đúng một việc:
vào `/` hoặc `/index.html` KHÔNG kèm tham số thì chuyển sang `/index.html?riot&riotfast&dev`, tức là
    ?riot       vào thẳng bản đồ Khu Đáy, coi như đã xong 07-A (chỉ trong phiên, không ghi hồ sơ — js/riot.js)
    ?riotfast   một chu kỳ kiện = 15 giây thay vì 45 phút
    ?dev        nút nạp tiền ở GACHA, để chiêu mộ quân đóng bãi mà không phải cày
Muốn mở cả 9 bãi: gõ tay  /index.html?riot=all&riotfast&dev
Mỗi cổng là một hồ sơ riêng (localStorage tính theo origin), nên cổng này không đụng hồ sơ ở 8765.
"""
import functools
import http.server
import os
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8802
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET = '/index.html?riot&riotfast&dev'


class Handler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path in ('/', '/index.html'):        # self.path có cả query, nên ?riot... không bị chuyển vòng
            self.send_response(302)
            self.send_header('Location', TARGET)
            self.end_headers()
            return
        super().do_GET()


if __name__ == '__main__':
    http.server.ThreadingHTTPServer.allow_reuse_address = True
    handler = functools.partial(Handler, directory=ROOT)
    with http.server.ThreadingHTTPServer(('127.0.0.1', PORT), handler) as srv:
        # In ASCII thôi: console Windows không phải lúc nào cũng là UTF-8
        print(f'DEP LOAN test server: http://127.0.0.1:{PORT}/  ->  {TARGET}', flush=True)
        srv.serve_forever()
