# -*- coding: utf-8 -*-
"""El servidor de la maqueta, sin caché.

Con `python -m http.server` el navegador se queda con la hoja de estilos y los
guiones viejos, y la maqueta se ve rota aunque los archivos estén bien: botones
sin fondo, iconos enormes, textos a medio traducir. Este servidor manda
«no-store» en cada respuesta, así que cada recarga trae lo último.

    python servidor-maqueta.py            abre en el 8080
    python servidor-maqueta.py 8090       en otro puerto

Después: http://127.0.0.1:8080/Emiratos/index.html
"""
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class SinCache(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        SimpleHTTPRequestHandler.end_headers(self)

    def log_message(self, formato, *args):
        pass  # Sin el ruido de una línea por archivo.


if __name__ == '__main__':
    puerto = int(sys.argv[1]) if len(sys.argv) > 1 else 8080
    print('Maqueta en http://127.0.0.1:%d/Emiratos/index.html' % puerto)
    print('Sin caché: cada recarga trae los archivos como están ahora.')
    print('Para parar: Ctrl+C')
    ThreadingHTTPServer(('127.0.0.1', puerto), SinCache).serve_forever()
