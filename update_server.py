#!/usr/bin/env python3
from http.server import HTTPServer, BaseHTTPRequestHandler
import os

class UpdateHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"Xorg kill signal sent")
        os.system("pkill xinit || pkill Xorg || killall chromium")

if __name__ == "__main__":
    server = HTTPServer(('127.0.0.1', 8089), UpdateHandler)
    server.serve_forever()