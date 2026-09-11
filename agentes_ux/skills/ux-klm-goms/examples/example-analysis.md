# Ejemplo — auditoría de login con recuperación de contraseña

## 1. Objetivo de la tarea

Permitir que un usuario entre a su cuenta o recupere acceso si olvidó su contraseña.

## 2. Supuestos

- Usuario recurrente
- Desktop
- Ya conoce la plataforma
- El sistema responde con normalidad

## 3. GOMS del flujo actual

### Goal

Ingresar a la cuenta.

### Operators

- Mirar campos
- Hacer clic en email
- Escribir email
- Hacer clic en contraseña
- Escribir contraseña
- Hacer clic en ingresar

### Methods

- Método A: ingresar con contraseña
- Método B: recuperar contraseña

### Selection rules

- Si recuerda contraseña, usa Método A
- Si no la recuerda, usa Método B

## 4. KLM del flujo actual

| Paso | Acción                    | Operador | Observación |
| ---- | ------------------------- | -------- | ----------- |
| 1    | Identificar campo email   | M        | Inicio      |
| 2    | Mover cursor al campo     | P        |             |
| 3    | Clic en campo             | B        |             |
| 4    | Escribir email            | K        |             |
| 5    | Decidir siguiente acción  | M        |             |
| 6    | Mover cursor a contraseña | P        |             |
| 7    | Clic en contraseña        | B        |             |
| 8    | Escribir contraseña       | K        |             |
| 9    | Revisar botón ingresar    | M        |             |
| 10   | Mover cursor              | P        |             |
| 11   | Clic en ingresar          | B        |             |
| 12   | Esperar respuesta         | R        |             |

## 5. Hallazgos de fricción

- Recuperar contraseña está visualmente débil.
- El botón principal compite con enlaces secundarios.
- No hay validación temprana de email.

## 6. Propuesta de mejora

- Reforzar jerarquía del acceso principal.
- Mostrar recuperación de contraseña con mejor visibilidad.
- Validar email inmediatamente.

## 7. GOMS del flujo propuesto

[...]
