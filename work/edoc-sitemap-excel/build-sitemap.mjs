import fs from "node:fs/promises";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

const outputDir = "E:/Sitios/Guru/outputs/edoc-sitemap-navigation-20260922";
const outputPath = `${outputDir}/sitemap-navegacion-edoc.xlsx`;
const previewPath = `${outputDir}/sitemap-navegacion-edoc-preview.png`;

const rows = [
  ["Menú principal", "Inicio", "", "Inicio", "Activa", "", "Página interna", "Sí", "inicio.html", "Entrada al área autenticada."],
  ["Menú principal", "Administración", "Roles y Usuarios", "Roles", "Activa", "", "Página interna", "Sí", "admin-roles.html", "Administración de roles y permisos."],
  ["Menú principal", "Administración", "Roles y Usuarios", "Usuarios", "Activa", "", "Página interna", "Sí", "admin-usuarios.html", "Administración de usuarios de la empresa."],
  ["Menú principal", "Administración", "Actualización Datos empresas", "Actualización de identificación fiscal", "Activa", "", "Página interna", "Sí", "admin-empresa.html", "Datos fiscales e identificación de la empresa."],
  ["Menú principal", "Administración", "Actualización Datos empresas", "Actualización de contactos", "Activa", "", "Página interna", "Sí", "admin-contactos.html", "Contactos financiero, técnico y de notificaciones."],
  ["Menú principal", "Administración", "", "Credenciales de consumo Servicio eDoc", "Activa", "", "Página interna", "Sí", "admin-credenciales.html", "Gestión de credenciales para consumir el servicio."],
  ["Menú principal", "Administración", "", "Alertas y comunicados", "Inactiva", 2, "Página interna", "No", "admin-alertas.html", "Visible como Fase 2. El archivo existe, pero el menú no lo enlaza."],
  ["Menú principal", "Administración", "", "Manuales", "Activa", "", "Página interna", "Sí", "admin-manuales.html", "Consulta de manuales del portal."],
  ["Menú principal", "Emisión", "Reportes", "Documentos Emitidos", "Activa", "", "Página interna", "Sí", "emitidos.html", "Consulta de documentos emitidos."],
  ["Menú principal", "Emisión", "Reportes", "Documentos por criterios", "Inactiva", 3, "Opción futura", "No", "Sin pantalla", "Visible en el menú como Fase 3."],
  ["Menú principal", "Recepción", "Reportes", "Documentos Recibidos", "Activa", "", "Página interna", "Sí", "recibidos.html", "Consulta y respuesta de documentos recibidos."],
  ["Menú principal", "Recepción", "Importar", "Cargar XML", "Inactiva", 2, "Opción futura", "No", "Sin pantalla", "Visible en el menú como Fase 2."],
  ["Menú principal", "Recepción", "Workflow Aprobación", "Gestión proveedores", "Inactiva", 3, "Opción futura", "No", "Sin pantalla", "Visible en el menú como Fase 3."],
  ["Menú del avatar", "Cuenta", "", "Mi perfil", "Activa", "", "Página interna", "Sí", "mi-perfil.html", "Incluye datos personales, contraseña y verificación en dos pasos."],
  ["Menú del avatar", "Cuenta", "", "Usuarios eDoc", "Activa", "", "Acceso rápido", "Sí", "admin-usuarios.html", "Acceso duplicado a la opción Usuarios de Administración."],
  ["Menú del avatar", "Cuenta", "", "Salir", "Activa", "", "Acción", "Sí", "index.html", "Cierra el recorrido y vuelve al acceso."],
  ["Utilidades superiores", "Portal", "", "Cambiar de portal o país", "Inactiva", "", "Acción sin destino", "No", "Sin destino", "Se muestra para Emiratos Árabes Unidos, pero no tiene navegación funcional."],
  ["Utilidades superiores", "Avisos", "", "Campana de avisos", "Activa", "", "Control", "No aplica", "Panel emergente", "Abre los avisos dentro de la misma pantalla."],
  ["Utilidades superiores", "Ayuda", "", "Acceso al soporte", "Activa", "", "Enlace externo", "Sí", "https://wikiedoc.guru-soft.com/", "Abre la wiki de soporte en otra pestaña."],
];

const workbook = Workbook.create();
const sheet = workbook.worksheets.add("Sitemap");
sheet.showGridLines = false;
sheet.tabColor = "#001174";

sheet.getRange("A2:J2").format.font = { name: "Arial", size: 15, bold: true, color: "#001174" };
sheet.getRange("A2").values = [["Sitemap de navegación eDoc"]];
sheet.getRange("A3:J3").format.borders = { bottom: { style: "medium", color: "#A8C634" } };
sheet.getRange("A4").values = [["Estado predeterminado del menú del portal. Las filas representan opciones visibles de navegación y controles de cabecera."]];
sheet.getRange("A4:J4").format.font = { name: "Arial", size: 10, italic: true, color: "#666666" };

sheet.getRange("A6:H6").values = [[
  "Opciones activas", null,
  "Opciones inactivas", null,
  "Total de elementos", null,
  "Elementos con fase", null,
]];
sheet.getRange("A7:H7").formulas = [[
  '=COUNTIFS($E$10:$E$28,"Activa")', null,
  '=COUNTIFS($E$10:$E$28,"Inactiva")', null,
  '=COUNTA($D$10:$D$28)', null,
  '=COUNT($F$10:$F$28)', null,
]];

for (const col of ["A", "C", "E", "G"]) {
  sheet.getRange(`${col}6:${col}7`).format = {
    fill: "#E8ECF8",
    font: { name: "Arial", size: 10, bold: true, color: "#001174" },
    horizontalAlignment: "center",
    verticalAlignment: "center",
    borders: { preset: "outside", style: "thin", color: "#C6CDE5" },
  };
}
sheet.getRange("A7").format.font = { name: "Arial", size: 13, bold: true, color: "#001174" };
sheet.getRange("C7").format.font = { name: "Arial", size: 13, bold: true, color: "#9C2F2F" };
sheet.getRange("E7").format.font = { name: "Arial", size: 13, bold: true, color: "#001174" };
sheet.getRange("G7").format.font = { name: "Arial", size: 13, bold: true, color: "#8A6200" };

sheet.getRange("A9:J9").values = [[
  "Canal", "Sección", "Grupo", "Opción", "Estado", "Fase", "Tipo", "Enlace funcional", "Ruta o destino", "Observaciones",
]];
sheet.getRange("A10:J28").values = rows;

const table = sheet.tables.add("A9:J28", true, "SitemapNavigationTable");
table.style = "TableStyleMedium2";
table.showBandedRows = true;
table.showFilterButton = true;

sheet.getRange("A9:J28").format.font = { name: "Arial", size: 10, color: "#222222" };
sheet.getRange("A9:J9").format = {
  fill: "#001174",
  font: { name: "Arial", size: 10, bold: true, color: "#FFFFFF" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  wrapText: true,
  borders: { insideVertical: { style: "thin", color: "#FFFFFF" } },
};
sheet.getRange("A10:J28").format.verticalAlignment = "center";
sheet.getRange("A10:J28").format.wrapText = false;
sheet.getRange("E10:H28").format.horizontalAlignment = "center";

sheet.getRange("E10:E28").conditionalFormats.addCustom('=$E10="Activa"', {
  fill: "#E7F2D7", font: { color: "#365314", bold: true },
});
sheet.getRange("E10:E28").conditionalFormats.addCustom('=$E10="Inactiva"', {
  fill: "#FBE7E7", font: { color: "#9C2F2F", bold: true },
});
sheet.getRange("F10:F28").conditionalFormats.add("notContainsBlanks", {
  format: { fill: "#FFF2CC", font: { color: "#7F6000", bold: true } },
});

sheet.getRange("A30").values = [["Leyenda"]];
sheet.getRange("A30").format.font = { name: "Arial", size: 10, bold: true, color: "#001174" };
sheet.getRange("B30").values = [["Activa: disponible en el estado predeterminado. Inactiva: visible sin destino funcional o reservada para una fase posterior."]];
sheet.getRange("B30:J30").format.font = { name: "Arial", size: 10, italic: true, color: "#555555" };
sheet.getRange("A32").values = [["Fuente"]];
sheet.getRange("A32").format.font = { name: "Arial", size: 10, bold: true, color: "#001174" };
sheet.getRange("B32").values = [["Estructura actual del menú compartido del portal eDoc. Corte: 22 de septiembre de 2026."]];
sheet.getRange("B32:J32").format.font = { name: "Arial", size: 10, italic: true, color: "#666666" };

const widths = {
  A: 22, B: 18, C: 28, D: 38, E: 12, F: 8, G: 18, H: 17, I: 34, J: 62,
};
for (const [col, width] of Object.entries(widths)) {
  sheet.getRange(`${col}:${col}`).format.columnWidth = width;
}
sheet.getRange("1:32").format.rowHeight = 20;
sheet.getRange("2:2").format.rowHeight = 26;
sheet.getRange("4:4").format.rowHeight = 22;
sheet.getRange("9:9").format.rowHeight = 32;
sheet.freezePanes.freezeRows(9);

workbook.recalculate();

const inspection = await workbook.inspect({
  kind: "table",
  range: "Sitemap!A2:J32",
  include: "values,formulas",
  tableMaxRows: 35,
  tableMaxCols: 10,
  maxChars: 12000,
});
console.log("INSPECTION_START");
console.log(inspection.ndjson);
console.log("INSPECTION_END");

const errors = await workbook.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!|#SPILL!|#CALC!",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});
console.log("ERROR_SCAN_START");
console.log(errors.ndjson);
console.log("ERROR_SCAN_END");

await fs.mkdir(outputDir, { recursive: true });
const preview = await workbook.render({ sheetName: "Sitemap", range: "A1:J32", scale: 1, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));
const output = await SpreadsheetFile.exportXlsx(workbook);
await output.save(outputPath);
console.log(`OUTPUT=${outputPath}`);
console.log(`PREVIEW=${previewPath}`);
