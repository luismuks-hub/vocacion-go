#!/usr/bin/env python3
"""
Vocación GO — Servidor local offline v2.0
Doble clic en iniciar.bat (Windows) para arrancar.
Luego abre: http://localhost:8000
"""

import sys, os, subprocess

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# ── En local: auto-instalar si faltan ───────────────────────
if 'RENDER' not in os.environ:
    import subprocess
    def _instalar(pkg):
        try:
            __import__(pkg)
        except ImportError:
            print(f'  Instalando {pkg}...')
            subprocess.check_call([sys.executable,'-m','pip','install',pkg,'--quiet'],
                stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            print(f'  {pkg} OK')
    _instalar('reportlab')
    _instalar('openpyxl')

# ── Imports principales ──────────────────────────────────────
import http.server, socketserver, json
from datetime import datetime
import io, traceback

PORT = 8000

# ── Helpers ──────────────────────────────────────────────────
def limpiar(texto):
    """Eliminar emojis y caracteres no-ASCII que crashean Helvetica en reportlab."""
    if not texto:
        return ''
    return ''.join(c for c in str(texto) if ord(c) < 128)

def truncar(texto, max_chars):
    t = limpiar(texto)
    return t[:max_chars-3] + '...' if len(t) > max_chars else t

# ── GENERADOR PDF ────────────────────────────────────────────
def generar_pdf(datos):
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import mm
    from reportlab.pdfgen import canvas as rl_canvas
    from reportlab.lib.colors import HexColor

    u  = datos.get('usuario', {})
    r  = datos.get('resultado', {})
    pn = r.get('puntajesNorm', {})
    nd = r.get('nivelesDims', {})
    carreras = r.get('carrerasRecomendadas', [])

    W, H = A4
    buf = io.BytesIO()
    c = rl_canvas.Canvas(buf, pagesize=A4)

    # Paleta
    BG     = HexColor('#0D0D1A')
    PURPLE = HexColor('#8B00FF')
    LIME   = HexColor('#B8E800')   # Lime más suave para PDF
    BLUE   = HexColor('#00A8DD')
    WHITE  = HexColor('#FFFFFF')
    LGRAY  = HexColor('#DCDCEB')
    MGRAY  = HexColor('#9090B0')
    DGRAY  = HexColor('#505080')
    GREEN  = HexColor('#30DD70')

    DIM_C = {
        'DIM-01': HexColor('#8B00FF'), 'DIM-02': HexColor('#22C55E'),
        'DIM-03': HexColor('#00A8DD'), 'DIM-04': HexColor('#DD0088'),
        'DIM-05': HexColor('#FF6B00'), 'DIM-06': HexColor('#7080A0'),
    }
    DIM_LABEL = {
        'DIM-01':'Academico', 'DIM-02':'Tecnico', 'DIM-03':'Cientifico',
        'DIM-04':'Social',    'DIM-05':'Serv. Publico', 'DIM-06':'Disciplina'
    }
    CAT_C = {
        'UNIVERSITARIA': HexColor('#8B00FF'),
        'UNIVERSITARIA_SOCIAL': HexColor('#8B00FF'),
        'UNIVERSITARIA_CIENCIAS': HexColor('#00A8DD'),
        'UNIVERSITARIA_TECNICA': HexColor('#8B00FF'),
        'TECNICA': HexColor('#22C55E'),
        'FUERZAS_ARMADAS': HexColor('#FF6B00'),
        'POLICIAL': HexColor('#DD0088'),
    }

    def cabecera():
        c.setFillColor(HexColor('#150830'))
        c.rect(0, H - 56*mm, W, 56*mm, fill=1, stroke=0)
        c.setFillColor(PURPLE)
        c.rect(0, H - 3*mm, W, 3*mm, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 22)
        c.drawString(18*mm, H - 18*mm, 'VOCACION GO')
        c.setFillColor(LIME)
        c.setFont('Helvetica-Bold', 9)
        c.drawString(18*mm, H - 26*mm, 'EL JUEGO MAS IMPORTANTE: TU CARRERA')
        c.setFillColor(LGRAY)
        c.setFont('Helvetica', 12)
        nom = truncar(f"{u.get('nombre','')} {u.get('apellido','')}", 50).strip()
        c.drawString(18*mm, H - 36*mm, f'Reporte: {nom}')
        c.setFillColor(MGRAY)
        c.setFont('Helvetica', 8)
        fecha = datetime.now().strftime('%d/%m/%Y')
        meta = f"{fecha}  |  {u.get('edad','?')} anios  |  {limpiar(u.get('region','?'))}  |  {limpiar(u.get('grado','?'))}"
        c.drawString(18*mm, H - 44*mm, meta)
        c.setFillColor(PURPLE)
        c.rect(0, H - 57*mm, W, 3*mm, fill=1, stroke=0)

    def fondo():
        c.setFillColor(BG)
        c.rect(0, 0, W, H, fill=1, stroke=0)

    def pie(pag, total):
        c.setFillColor(HexColor('#0A0A18'))
        c.rect(0, 0, W, 10*mm, fill=1, stroke=0)
        c.setFillColor(DGRAY)
        c.setFont('Helvetica', 6)
        c.drawString(18*mm, 4*mm,
            'Vocacion GO | Resultado orientativo. No reemplaza orientacion vocacional presencial.')
        c.drawRightString(W - 18*mm, 4*mm, f'Pag. {pag}/{total}')
        c.setFillColor(PURPLE)
        c.rect(0, 0, W, 2*mm, fill=1, stroke=0)

    # ── Pag 1 ──
    fondo(); cabecera()
    y = H - 68*mm

    # Caja resultado
    c.setFillColor(HexColor('#1E0840'))
    c.setStrokeColor(PURPLE)
    c.setLineWidth(0.8)
    c.roundRect(18*mm, y - 24*mm, W - 36*mm, 24*mm, 4*mm, fill=1, stroke=1)

    cat = limpiar(r.get('categoriaLabel','')).upper()
    c.setFillColor(LIME)
    c.setFont('Helvetica-Bold', 14)
    c.drawCentredString(W/2, y - 10*mm, cat)
    c.setFillColor(MGRAY)
    c.setFont('Helvetica', 8)
    c.drawCentredString(W/2, y - 18*mm,
        f"Regla: {limpiar(r.get('reglaAplicada','?'))}  |  Confianza: {limpiar(r.get('confianza','?'))}")
    y -= 33*mm

    # Dimensiones
    c.setFillColor(BLUE)
    c.setFont('Helvetica-Bold', 10)
    c.drawString(18*mm, y, 'PERFIL POR DIMENSIONES')
    y -= 4*mm
    c.setStrokeColor(DGRAY); c.setLineWidth(0.4)
    c.line(18*mm, y, W - 18*mm, y)
    y -= 7*mm

    for i, did in enumerate(['DIM-01','DIM-02','DIM-03','DIM-04','DIM-05','DIM-06']):
        p  = pn.get(did, 0)
        cx = 18*mm if i % 2 == 0 else W/2 + 5*mm
        ry = y - (i // 2) * 17*mm
        dc = DIM_C.get(did, MGRAY)

        c.setFillColor(dc); c.setFont('Helvetica-Bold', 8)
        c.drawString(cx, ry, DIM_LABEL.get(did, did))
        c.setFillColor(WHITE)
        c.drawString(cx + 48*mm, ry, f'{p}/100')

        # Barra
        c.setFillColor(DGRAY)
        c.roundRect(cx, ry - 5.5*mm, 72*mm, 3.5*mm, 1*mm, fill=1, stroke=0)
        if p > 0:
            c.setFillColor(dc)
            c.roundRect(cx, ry - 5.5*mm, 72*mm*(p/100), 3.5*mm, 1*mm, fill=1, stroke=0)

        nv = limpiar(nd.get(did, {}).get('nivel', ''))
        c.setFillColor(MGRAY); c.setFont('Helvetica', 7)
        c.drawString(cx + 58*mm, ry, nv)

    y -= 3 * 17*mm + 8*mm

    # Mensaje
    msg = truncar(r.get('mensaje',''), 130)
    if msg:
        c.setFillColor(HexColor('#14142A'))
        c.roundRect(18*mm, y - 13*mm, W - 36*mm, 13*mm, 3*mm, fill=1, stroke=0)
        c.setFillColor(LGRAY); c.setFont('Helvetica-Oblique', 8)
        c.drawCentredString(W/2, y - 8*mm, msg)
        y -= 22*mm

    # Carreras
    c.setFillColor(BLUE); c.setFont('Helvetica-Bold', 10)
    c.drawString(18*mm, y, 'CARRERAS RECOMENDADAS')
    y -= 4*mm
    c.setStrokeColor(DGRAY); c.setLineWidth(0.3)
    c.line(18*mm, y, W - 18*mm, y)
    y -= 7*mm

    pag = 1
    for car in carreras[:5]:
        bloque = 42*mm
        if y < 20*mm + bloque:
            pie(pag, '?'); c.showPage(); fondo()
            # Mini cabecera en páginas siguientes
            c.setFillColor(HexColor('#150830'))
            c.rect(0, H - 18*mm, W, 18*mm, fill=1, stroke=0)
            c.setFillColor(PURPLE)
            c.rect(0, H - 2*mm, W, 2*mm, fill=1, stroke=0)
            c.setFillColor(LIME); c.setFont('Helvetica-Bold', 9)
            c.drawString(18*mm, H - 11*mm, 'VOCACION GO - Reporte (continuacion)')
            c.setFillColor(PURPLE)
            c.rect(0, H - 18*mm, W, 1.5*mm, fill=1, stroke=0)
            y = H - 28*mm
            pag += 1

        ac = CAT_C.get(car.get('categoria',''), MGRAY)
        c.setFillColor(ac)
        c.rect(18*mm, y - bloque, 2*mm, bloque, fill=1, stroke=0)

        # Nombre
        nom_car = truncar(car.get('nombre',''), 55)
        c.setFillColor(ac); c.setFont('Helvetica-Bold', 10)
        c.drawString(22*mm, y - 7*mm, nom_car)

        # Afinidad
        c.setFillColor(LIME); c.setFont('Helvetica-Bold', 9)
        c.drawRightString(W - 18*mm, y - 7*mm, f"{car.get('afinidad',0)}% afin")

        # Descripción
        desc = truncar(car.get('descripcion',''), 100)
        if desc:
            c.setFillColor(LGRAY); c.setFont('Helvetica', 7.5)
            c.drawString(22*mm, y - 14*mm, desc[:85])
            if len(limpiar(car.get('descripcion',''))) > 85:
                c.drawString(22*mm, y - 19*mm, truncar(car.get('descripcion',''), 170)[85:])

        # Metadatos
        c.setFillColor(MGRAY); c.setFont('Helvetica-Bold', 7)
        c.drawString(22*mm, y - 27*mm, 'Duracion:')
        c.setFillColor(WHITE); c.setFont('Helvetica', 7)
        c.drawString(38*mm, y - 27*mm, limpiar(car.get('duracion','')))

        sj = limpiar(car.get('sueldoJunior',''))
        if sj:
            c.setFillColor(MGRAY); c.setFont('Helvetica-Bold', 7)
            c.drawString(68*mm, y - 27*mm, 'Junior:')
            c.setFillColor(GREEN); c.setFont('Helvetica', 7)
            c.drawString(82*mm, y - 27*mm, sj)

        insts = [limpiar(i) for i in car.get('instituciones',[]) if limpiar(i)]
        if insts:
            c.setFillColor(MGRAY); c.setFont('Helvetica-Bold', 7)
            c.drawString(22*mm, y - 34*mm, 'Instituciones:')
            c.setFillColor(WHITE); c.setFont('Helvetica', 7)
            c.drawString(44*mm, y - 34*mm, ' / '.join(insts[:4])[:60])

        c.setStrokeColor(DGRAY); c.setLineWidth(0.2)
        c.line(18*mm, y - bloque, W - 18*mm, y - bloque)
        y -= bloque + 3*mm

    pie(pag, pag)
    c.save()
    return buf.getvalue()


# ── GENERADOR EXCEL ──────────────────────────────────────────
def generar_excel(datos):
    import openpyxl
    from openpyxl.styles import Font, PatternFill, Alignment
    from openpyxl.utils import get_column_letter

    u     = datos.get('usuario', {})
    r     = datos.get('resultado', {})
    pn    = r.get('puntajesNorm', {})
    pb    = r.get('puntajesBrutos', {})
    nd    = r.get('nivelesDims', {})
    resp  = datos.get('respuestas', {})
    items = datos.get('items', [])
    todas = datos.get('todasEvaluaciones', [])

    wb = openpyxl.Workbook()

    def hfill(hex_col):
        return PatternFill('solid', fgColor=hex_col.lstrip('#'))

    DIMS = [
        ('DIM-01','Intereses Academicos / Universitarios',  10, 1.0),
        ('DIM-02','Intereses Tecnicos / Practicos',         10, 1.0),
        ('DIM-03','Intereses Cientificos / Investigativos', 10, 1.0),
        ('DIM-04','Intereses Sociales / Comunitarios',      10, 1.0),
        ('DIM-05','Tendencias de Servicio Publico',          8, 1.25),
        ('DIM-06','Disciplina y Estructura',                 8, 1.25),
    ]
    DIM_NOM = {d[0]: d[1] for d in DIMS}

    # ── Hoja 1: Resumen ──
    ws1 = wb.active
    ws1.title = 'Resumen'

    def write_header(ws, row, text, color='8B00FF', size=12):
        cell = ws.cell(row=row, column=1, value=text)
        cell.font = Font(bold=True, color=color, size=size)
        cell.fill = hfill('#0D0D1A')
        return row + 1

    def write_row(ws, row, key, val):
        ws.cell(row=row, column=1, value=key).font = Font(bold=True, color='6060A0')
        ws.cell(row=row, column=2, value=str(val) if val is not None else '')
        return row + 1

    row = 1
    row = write_header(ws1, row, 'VOCACION GO - Reporte de Evaluacion', 'C8FF00', 13)
    row += 1
    row = write_header(ws1, row, 'DATOS DEL EVALUADO', '00C8FF', 10)
    row = write_row(ws1, row, 'Nombre',      f"{u.get('nombre','')} {u.get('apellido','')}".strip())
    row = write_row(ws1, row, 'Edad',        u.get('edad',''))
    row = write_row(ws1, row, 'Genero',      'Masculino' if u.get('genero')=='M' else ('Femenino' if u.get('genero')=='F' else 'No indica'))
    row = write_row(ws1, row, 'Grado',       u.get('grado',''))
    row = write_row(ws1, row, 'Region',      u.get('region',''))
    row = write_row(ws1, row, 'Institucion', u.get('institucion',''))
    row = write_row(ws1, row, 'Fecha',       datetime.now().strftime('%d/%m/%Y'))
    row += 1
    row = write_header(ws1, row, 'RESULTADO VOCACIONAL', '00C8FF', 10)
    row = write_row(ws1, row, 'Categoria',           r.get('categoriaLabel',''))
    row = write_row(ws1, row, 'Regla aplicada',      r.get('reglaAplicada',''))
    row = write_row(ws1, row, 'Nivel de confianza',  r.get('confianza',''))
    row = write_row(ws1, row, 'Dimension dominante', r.get('dimDominante',''))
    row = write_row(ws1, row, 'Mensaje',             r.get('mensaje',''))
    row += 1
    row = write_header(ws1, row, 'PUNTAJES POR DIMENSION', '00C8FF', 10)
    # Encabezado tabla
    hdrs = ['Dimension','Codigo','Puntaje 0-100','Puntaje bruto','Nivel']
    for ci, h in enumerate(hdrs, 1):
        cell = ws1.cell(row=row, column=ci, value=h)
        cell.font = Font(bold=True, color='FFFFFF')
        cell.fill = hfill('#1A1A35')
    row += 1
    for did, dnom, ni, _ in DIMS:
        ws1.cell(row=row, column=1, value=dnom)
        ws1.cell(row=row, column=2, value=did)
        ws1.cell(row=row, column=3, value=pn.get(did, 0))
        ws1.cell(row=row, column=4, value=pb.get(did, 0))
        ws1.cell(row=row, column=5, value=nd.get(did, {}).get('nivel', ''))
        row += 1
    row += 1
    row = write_header(ws1, row, 'CARRERAS RECOMENDADAS', '00C8FF', 10)
    hdrs2 = ['#','Carrera','Subcategoria','Afinidad %','Duracion','Sueldo Junior','Sueldo Senior']
    for ci, h in enumerate(hdrs2, 1):
        cell = ws1.cell(row=row, column=ci, value=h)
        cell.font = Font(bold=True, color='FFFFFF')
        cell.fill = hfill('#1A1A35')
    row += 1
    for idx, car in enumerate(r.get('carrerasRecomendadas', []), 1):
        ws1.cell(row=row, column=1, value=idx)
        ws1.cell(row=row, column=2, value=car.get('nombre',''))
        ws1.cell(row=row, column=3, value=car.get('subcategoria',''))
        ws1.cell(row=row, column=4, value=car.get('afinidad', 0))
        ws1.cell(row=row, column=5, value=car.get('duracion',''))
        ws1.cell(row=row, column=6, value=car.get('sueldoJunior',''))
        ws1.cell(row=row, column=7, value=car.get('sueldoSenior',''))
        row += 1

    for col, w in zip('ABCDEFG', [34, 20, 12, 14, 14, 20, 20]):
        ws1.column_dimensions[col].width = w

    # ── Hoja 2: Respuestas ──
    ws2 = wb.create_sheet('Respuestas 56 items')
    ETQ = {1:'Totalmente en desacuerdo', 2:'En desacuerdo',
           3:'Ni de acuerdo ni en desacuerdo', 4:'De acuerdo', 5:'Totalmente de acuerdo'}
    cab2 = ['ID Item','Dimension','Cod.','Pregunta','Respuesta','Etiqueta','Holland','Kuder']
    for ci, h in enumerate(cab2, 1):
        cell = ws2.cell(row=1, column=ci, value=h)
        cell.font = Font(bold=True, color='FFFFFF')
        cell.fill = hfill('#1A1A35')
        cell.alignment = Alignment(horizontal='center', wrap_text=True)

    DIM_FILLS = {'DIM-01':'EDE9FE','DIM-02':'D1FAE5','DIM-03':'DBEAFE',
                 'DIM-04':'FCE7F3','DIM-05':'FEF3C7','DIM-06':'F3F4F6'}
    for ri, item in enumerate(items, 2):
        v = resp.get(item.get('id',''))
        v_int = int(v) if str(v).isdigit() else None
        row_data = [
            item.get('id',''), DIM_NOM.get(item.get('dim',''), item.get('dim','')),
            item.get('dim',''), item.get('texto',''),
            v_int, ETQ.get(v_int, 'Sin respuesta' if v_int is None else ''),
            item.get('holland',''), item.get('kuder','')
        ]
        for ci, val in enumerate(row_data, 1):
            cell = ws2.cell(row=ri, column=ci, value=val)
            cell.fill = hfill(DIM_FILLS.get(item.get('dim',''), 'FFFFFF'))

    for col, w in zip('ABCDEFGH', [9, 36, 8, 65, 10, 34, 22, 15]):
        ws2.column_dimensions[col].width = w
    ws2.freeze_panes = 'A2'

    # ── Hoja 3: Puntajes ──
    ws3 = wb.create_sheet('Puntajes')
    ws3.cell(row=1, column=1, value='CALCULO DE PUNTAJES').font = Font(bold=True, color='00C8FF', size=11)
    ws3.append([])
    cab3 = ['Dimension','Codigo','N Items','Peso','Bruto','Max Posible','Normalizado (0-100)','Nivel']
    for ci, h in enumerate(cab3, 1):
        cell = ws3.cell(row=3, column=ci, value=h)
        cell.font = Font(bold=True, color='FFFFFF')
        cell.fill = hfill('#1A1A35')
    for did, dnom, ni, peso in DIMS:
        ws3.append([dnom, did, ni, peso, pb.get(did,0), ni*5, pn.get(did,0), nd.get(did,{}).get('nivel','')])
    for col, w in zip('ABCDEFGH', [36, 8, 8, 6, 10, 12, 20, 12]):
        ws3.column_dimensions[col].width = w

    # ── Hoja 4: Comparación ──
    if todas:
        ws4 = wb.create_sheet('Comparacion')
        ws4.cell(row=1, column=1, value='COMPARACION DE EVALUACIONES').font = Font(bold=True, color='00C8FF', size=11)
        ws4.append([])
        cab4 = ['Nombre','Edad','Region','Fecha','Categoria','Confianza','Regla',
                'DIM-01','DIM-02','DIM-03','DIM-04','DIM-05','DIM-06']
        for ci, h in enumerate(cab4, 1):
            cell = ws4.cell(row=3, column=ci, value=h)
            cell.font = Font(bold=True, color='FFFFFF')
            cell.fill = hfill('#1A1A35')
        for ev in todas:
            eu = ev.get('usuario', {})
            er = ev.get('resultado', {})
            ep = er.get('puntajesNorm', {})
            fecha_ev = ''
            try:
                fecha_ev = datetime.fromisoformat(ev.get('fechaCreacion','')).strftime('%d/%m/%Y')
            except Exception:
                pass
            ws4.append([
                f"{eu.get('nombre','')} {eu.get('apellido','')}".strip(),
                eu.get('edad',''), eu.get('region',''), fecha_ev,
                er.get('categoriaLabel',''), er.get('confianza',''), er.get('reglaAplicada',''),
                ep.get('DIM-01',''), ep.get('DIM-02',''), ep.get('DIM-03',''),
                ep.get('DIM-04',''), ep.get('DIM-05',''), ep.get('DIM-06','')
            ])
        for col, w in zip('ABCDEFGHIJKLM', [24,6,16,12,24,12,8,8,8,8,8,8,8]):
            ws4.column_dimensions[col].width = w
        ws4.freeze_panes = 'A4'

    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


# ── EXCEL TODAS LAS EVALUACIONES ────────────────────────────
def generar_excel_todas(datos):
    import openpyxl
    from openpyxl.styles import Font, PatternFill, Alignment
    import io

    todas = datos.get('todasEvaluaciones', [])
    items = datos.get('items', [])

    def hfill(hex_col):
        return PatternFill('solid', fgColor=hex_col.lstrip('#'))

    DIMS = [
        ('DIM-01','Academico',10,1.0), ('DIM-02','Tecnico',10,1.0),
        ('DIM-03','Cientifico',10,1.0), ('DIM-04','Social',10,1.0),
        ('DIM-05','Serv. Publico',8,1.25), ('DIM-06','Disciplina',8,1.25),
    ]
    DIM_NOM = {d[0]: d[1] for d in DIMS}
    ETQ = {1:'Totalmente en desacuerdo', 2:'En desacuerdo',
           3:'Ni de acuerdo ni en desacuerdo', 4:'De acuerdo', 5:'Totalmente de acuerdo'}
    DIM_FILLS = {'DIM-01':'EDE9FE','DIM-02':'D1FAE5','DIM-03':'DBEAFE',
                 'DIM-04':'FCE7F3','DIM-05':'FEF3C7','DIM-06':'F3F4F6'}

    wb = openpyxl.Workbook()

    # ── Hoja 1: Comparación resumida de todas ──
    ws1 = wb.active
    ws1.title = 'Comparacion General'
    ws1.cell(row=1,column=1,value='VOCACION GO - Comparacion de Todas las Evaluaciones').font = Font(bold=True,color='C8FF00',size=13)
    ws1.cell(row=2,column=1,value=f'Total evaluaciones: {len(todas)}').font = Font(color='9090B0')
    ws1.append([])

    cab = ['N','Nombre','Edad','Genero','Region','Grado','Fecha',
           'Categoria','Regla','Confianza',
           'DIM-01 Acad.','DIM-02 Tec.','DIM-03 Cient.',
           'DIM-04 Social','DIM-05 Serv.','DIM-06 Disc.']
    for ci, h in enumerate(cab, 1):
        cell = ws1.cell(row=4, column=ci, value=h)
        cell.font = Font(bold=True, color='FFFFFF', size=10)
        cell.fill = hfill('#1A1A35')
        cell.alignment = Alignment(horizontal='center', wrap_text=True)

    CAT_COLORS_XL = {
        'Carrera Universitaria':'8B00FF','Carrera Tecnica':'22C55E',
        'Fuerzas Armadas':'FF6B00','Carrera Policial':'DD0088',
        'Indeterminado':'6B7280',
    }

    for idx, ev in enumerate(todas, 1):
        eu = ev.get('usuario', {})
        er = ev.get('resultado', {})
        ep = er.get('puntajesNorm', {})
        fecha_ev = ''
        try:
            fecha_ev = datetime.fromisoformat(ev.get('fechaCreacion','')).strftime('%d/%m/%Y')
        except Exception:
            pass

        genero_str = 'Masculino' if eu.get('genero')=='M' else ('Femenino' if eu.get('genero')=='F' else 'No indica')
        row_data = [
            idx,
            f"{eu.get('nombre','')} {eu.get('apellido','')}".strip(),
            eu.get('edad',''), genero_str, eu.get('region',''), eu.get('grado',''), fecha_ev,
            er.get('categoriaLabel',''), er.get('reglaAplicada',''), er.get('confianza',''),
            ep.get('DIM-01',''), ep.get('DIM-02',''), ep.get('DIM-03',''),
            ep.get('DIM-04',''), ep.get('DIM-05',''), ep.get('DIM-06','')
        ]

        row_num = idx + 4
        for ci, val in enumerate(row_data, 1):
            cell = ws1.cell(row=row_num, column=ci, value=val)
            if idx % 2 == 0:
                cell.fill = hfill('13132A')

        # Color en columna Categoría según resultado
        cat_color = CAT_COLORS_XL.get(er.get('categoriaLabel',''), '6060A0')
        ws1.cell(row=row_num, column=8).font = Font(bold=True, color=cat_color)

    for col, w in zip('ABCDEFGHIJKLMNOP', [4,24,6,12,16,18,12,22,8,12,10,10,10,10,10,10]):
        ws1.column_dimensions[col].width = w
    ws1.freeze_panes = 'A5'

    # ── Hojas individuales: una por evaluación ──
    for idx, ev in enumerate(todas, 1):
        eu = ev.get('usuario', {})
        er = ev.get('resultado', {})
        ep = er.get('puntajesNorm', {})
        resp_ev = ev.get('respuestas', {})
        nombre_hoja = f"{idx}_{eu.get('nombre','?')[:8]}_{eu.get('apellido','?')[:6]}"
        nombre_hoja = nombre_hoja[:31]  # Excel limita a 31 chars

        ws = wb.create_sheet(nombre_hoja)
        # Encabezado de la hoja
        ws.cell(row=1,column=1,value=f"Evaluacion #{idx}: {eu.get('nombre','')} {eu.get('apellido','')}").font = Font(bold=True,color='C8FF00',size=11)
        ws.cell(row=2,column=1,value=f"Categoria: {er.get('categoriaLabel','')} | Confianza: {er.get('confianza','')} | Regla: {er.get('reglaAplicada','')}").font = Font(color='9090B0')
        ws.append([])

        # Tabla de puntajes por dimensión
        ws.cell(row=4,column=1,value='PUNTAJES POR DIMENSION').font = Font(bold=True,color='00C8FF')
        ws.append(['Dimension','Codigo','Puntaje 0-100','Nivel'])
        for ci,h in enumerate(['Dimension','Codigo','Puntaje 0-100','Nivel'],1):
            ws.cell(row=5,column=ci).font = Font(bold=True,color='FFFFFF')
            ws.cell(row=5,column=ci).fill = hfill('1A1A35')
        for did, dnom, _, _ in DIMS:
            ws.append([dnom, did, ep.get(did,''), er.get('nivelesDims',{}).get(did,{}).get('nivel','')])
        ws.append([])

        # Tabla de respuestas
        ws_row = ws.max_row + 1
        ws.cell(row=ws_row,column=1,value='RESPUESTAS A LOS 56 ITEMS').font = Font(bold=True,color='00C8FF')
        ws_row += 1
        cab_r = ['ID Item','Dimension','Pregunta','Respuesta (1-5)','Etiqueta']
        for ci,h in enumerate(cab_r,1):
            cell = ws.cell(row=ws_row,column=ci,value=h)
            cell.font = Font(bold=True,color='FFFFFF')
            cell.fill = hfill('1A1A35')
        ws_row += 1
        for item in items:
            v = resp_ev.get(item.get('id',''))
            v_int = int(v) if str(v).isdigit() else None
            row_data = [
                item.get('id',''), DIM_NOM.get(item.get('dim',''), item.get('dim','')),
                item.get('texto',''), v_int, ETQ.get(v_int,'Sin respuesta' if v_int is None else '')
            ]
            for ci, val in enumerate(row_data, 1):
                cell = ws.cell(row=ws_row, column=ci, value=val)
                cell.fill = hfill(DIM_FILLS.get(item.get('dim',''),'FFFFFF'))
            ws_row += 1

        for col, w in zip('ABCDE', [9,16,65,14,34]):
            ws.column_dimensions[col].width = w
        ws.freeze_panes = 'A2'

    buf = io.BytesIO()
    wb.save(buf)
    return buf.getvalue()


# ── SERVIDOR ─────────────────────────────────────────────────
class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=BASE_DIR, **kwargs)

    def log_message(self, fmt, *args):
        # Mostrar solo errores, no cada request
        if args and str(args[1]) not in ('200', '304'):
            print(f'  [{args[1]}] {args[0]}')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST,GET,OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/pdf':
            self._exportar(generar_pdf, 'application/pdf', 'VocacionGO.pdf')
        elif self.path == '/api/excel':
            ct = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            self._exportar(generar_excel, ct, 'VocacionGO.xlsx')
        elif self.path == '/api/excel/todas':
            ct = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            self._exportar(generar_excel_todas, ct, 'VocacionGO_Todas.xlsx')
        else:
            self.send_error(404, 'Endpoint no encontrado')

    def _exportar(self, fn, content_type, filename):
        try:
            length = int(self.headers.get('Content-Length', 0))
            body   = self.rfile.read(length)
            datos  = json.loads(body)
            archivo = fn(datos)

            self.send_response(200)
            self.send_header('Content-Type',        content_type)
            self.send_header('Content-Disposition', f'attachment; filename="{filename}"')
            self.send_header('Content-Length',      str(len(archivo)))
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(archivo)
        except Exception as e:
            print(f'\n  ERROR al generar archivo: {e}')
            traceback.print_exc()
            self.send_response(500)
            self.send_header('Content-Type', 'text/plain; charset=utf-8')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(str(e).encode('utf-8'))


def main():
    os.chdir(BASE_DIR)

    # Render asigna el puerto via variable de entorno PORT
    # En local usa 8000 por defecto
    port = int(os.environ.get('PORT', PORT))
    is_render = 'RENDER' in os.environ

    if not is_render:
        print('=' * 52)
        print('  VOCACION GO - Servidor local offline')
        print('=' * 52)
        print(f'  URL: http://localhost:{port}')
        print('  * Para cerrar: Ctrl+C o cierra la ventana')
        print('=' * 52)
    else:
        print(f'VocacionGO iniciando en Render — puerto {port}')

    try:
        socketserver.TCPServer.allow_reuse_address = True
        with socketserver.TCPServer(('0.0.0.0', port), Handler) as httpd:
            httpd.serve_forever()
    except KeyboardInterrupt:
        print('\n  Servidor cerrado.')
    except OSError:
        if not is_render:
            print(f'\n  ERROR: Puerto {port} en uso.')
            input('  Presiona Enter para cerrar...')
        sys.exit(1)

if __name__ == '__main__':
    main()
