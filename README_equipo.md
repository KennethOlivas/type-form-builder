# 🚀 Guía de Onboarding - Equipo TFM

Bienvenido/a al equipo de desarrollo. Este documento detalla el flujo de trabajo, la organización de Git y la configuración necesaria para contribuir al proyecto de forma estandarizada.

---

## 🏗️ 1. Organización del Repositorio

Para este TFM, operamos bajo una estructura de **GitHub Organization** para simular un entorno profesional.

* **Organización:** [OBSDevOpsCloud-G2](https://github.com/OBSDevOpsCloud-G2)
* **Repositorio Principal (Fork):** `type-form-builder`.
* **Repositorio Upstream:** Proyecto original de `KennethOlivas`. Se mantiene solo como referencia externa.

> [!TIP]
> Todos los miembros tienen permisos de **Write** o **Maintainer**. La rama `master` está protegida para evitar errores accidentales.

---

## 🔄 2. Flujo de Trabajo (Git Workflow)

Utilizamos un modelo de **Feature Branching**. Nadie trabaja directamente sobre `master`.

### Configuración de Remotos
| Remoto | URL / Propósito |
| :--- | :--- |
| **origin** | `https://github.com/OBSDevOpsCloud-G2/type-form-builder.git` (Nuestro trabajo) |
| **upstream** | `https://github.com/KennethOlivas/type-form-builder.git` (Referencia original) |

### Nomenclatura de Ramas
* `master`: Código estable y listo para producción (Protegida).
* `feature/nombre-de-la-mejora`: Para nuevas funcionalidades.
* `fix/descripcion-del-error`: Para corrección de bugs.

---

## 🔐 3. Configuración de Seguridad (SSH)

Para poder realizar `push` a la organización de forma segura, es obligatorio usar llaves SSH en lugar de contraseñas.

1.  **Generar llave:** Abre tu terminal y ejecuta:
    ```bash
    ssh-keygen -t ed25519 -C "tu_email@ejemplo.com"
    ```
2.  **Añadir a GitHub:** * Copia tu clave pública: `cat ~/.ssh/id_ed25519.pub`
    * Ve a [GitHub Settings > SSH Keys](https://github.com/settings/keys) y añádela.
3.  **Verificar:** Ejecuta `ssh -T git@github.com`. Deberías recibir un mensaje de bienvenida de GitHub.


---

## 🛠️ 4. Configuración del Entorno

Para mantener la coherencia en el código, utilizamos el siguiente estándar:

* **IDE:** Visual Studio Code.
* **Extensiones Recomendadas:**
    * `ESLint` & `Prettier` (Formato de código).
    * `GitLens` (Historial de cambios).
    * `Tailwind CSS IntelliSense` (Sugerencias de estilos).
    * `Docker` (Gestión de contenedores).
    * `Error Lens` (Reporte de errores visual).

---

## 🚀 5. Guía de Inicio Rápido (Paso a Paso)

Sigue estos pasos para configurar tu copia local:

### Paso 1: Clonar el proyecto
```bash
git clone [https://github.com/OBSDevOpsCloud-G2/type-form-builder.git](https://github.com/OBSDevOpsCloud-G2/type-form-builder.git)
cd type-form-builder