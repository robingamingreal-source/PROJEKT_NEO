import os
import json
import mimetypes
import urllib.parse
from http.server import SimpleHTTPRequestHandler, HTTPServer

UPLOAD_DIR = 'uploads'
os.makedirs(UPLOAD_DIR, exist_ok=True)

class NeoDropHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/' or self.path == '/x-surf.html':
            self.path = '/x-surf.html'
            return super().do_GET()
        
        if self.path.startswith('/drop/'):
            route_id = self.path.split('/')[-1]
            for filename in os.listdir(UPLOAD_DIR):
                if filename.startswith(route_id):
                    file_path = os.path.join(UPLOAD_DIR, filename)
                    original_name = filename.split('_', 1)[1]
                    self.send_response(200)
                    mime_type, _ = mimetypes.guess_type(file_path)
                    self.send_header('Content-type', mime_type or 'application/octet-stream')
                    self.send_header('Content-Disposition', f'attachment; filename="{original_name}"')
                    self.end_headers()
                    with open(file_path, 'rb') as f:
                        self.wfile.write(f.read())
                    return
            self.send_error(404)
        else:
            return super().do_GET()

    def do_POST(self):
        if self.path == '/upload':
            content_length = int(self.headers['Content-Length'])
            file_name = urllib.parse.unquote(self.headers.get('X-File-Name', 'file.bin'))
            route_id = self.headers.get('X-Route-Id', '0000')
            file_data = self.rfile.read(content_length)
            save_path = os.path.join(UPLOAD_DIR, f"{route_id}_{file_name}")
            with open(save_path, 'wb') as f:
                f.write(file_data)
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'status': 'success', 'url': f'/drop/{route_id}'}).encode())
        else:
            self.send_error(404)

if __name__ == '__main__':
    port = 8080
    server = HTTPServer(('0.0.0.0', port), NeoDropHandler)
    server.serve_forever()