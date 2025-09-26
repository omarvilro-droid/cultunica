# cultunica
app de educacion social
Cultunica - Memoria Viva de Nicaragua

Cultunica es una plataforma web creada para preservar, promover y compartir la riqueza cultural de Nicaragua. Conectamos a personas interesadas en las tradiciones del país mediante un espacio interactivo donde se pueden publicar historias, fotografías, audios, videos y eventos culturales. La plataforma fomenta el intercambio cultural entre municipios, resaltando costumbres y expresiones que conforman la identidad nicaragüense.

 Propósito del Proyecto

El objetivo de Cultunica es brindar un punto de encuentro digital donde los usuarios puedan:

Explorar y compartir contenido relacionado con la cultura nicaragüense.

Conectarse con otros usuarios de distintos municipios.

Conservar tradiciones y expresiones culturales a través de la tecnología.

 Características Principales

 Autenticación de usuarios mediante Firebase Authentication (Email/Password).

 Perfiles de usuario personalizables.

 Publicaciones con opciones de comentarios y reacciones.

Secciones dedicadas a fotos, videos, audios y eventos culturales.

Administración de amigos y comunidades.

 Interfaz moderna, adaptable y fácil de usar (responsive design).

 Instalación
No se requiere instalación. Al tratarse de una aplicación web, es accesible desde cualquier dispositivo con conexión a internet. Solo se necesita un navegador web moderno y la URL del sitio para comenzar a utilizarla.

Configura Firebase:

Crea un proyecto en Firebase Console
.

Activa los siguientes servicios:

Authentication (modo Email/Password).

Firestore Database.

Copia los datos de configuración de Firebase en el archivo firebase.js.

### Estructura de Colecciones

Hemos diseñado la siguiente estructura de colecciones y subcolecciones para optimizar el almacenamiento y las consultas en Firestore, adaptándonos al modelo documental:

| Colección/Subcolección | Tipo             | Documento Padre       | Descripción                                                                 |
| :------------------- | :--------------- | :-------------------- | :-------------------------------------------------------------------------- |
| `usuarios`           | Colección Principal | N/A                   | Almacena la información fundamental de cada usuario. ID del documento = UID del usuario. |
| `usuarios/{userId}/amigos` | Subcolección     | `usuarios/{userId}` | Contiene los amigos de un usuario específico. ID del documento = UID del amigo. |
| `posts`              | Colección Principal | N/A                   | Almacena todas las publicaciones o posts de la aplicación.                   |
| `posts/{postId}/comentarios` | Subcolección     | `posts/{postId}`    | Contiene los comentarios relacionados con un post específico.                 |
| `tendencias`         | Colección Principal | N/A                   | Almacena elementos o temas que son tendencia global.                        |
| `mapasInteractivos`  | Colección Principal | N/A                   | Contiene datos de ubicaciones para la funcionalidad de mapa interactivo.    |
| `biblioteca`         | Colección Principal | N/A                   | Almacena recursos de conocimiento o elementos de la biblioteca.             |

**Consideraciones Clave:**

*   **ID de Documento:** Para `usuarios` y `amigos`, se recomienda usar el User ID (UID) de Firebase Authentication como ID del documento para facilitar la vinculación. Para `posts`, `comentarios`, `mapasInteractivos` y `biblioteca`, se puede usar un ID generado automáticamente por Firestore (`addDoc`).
*   **POJOs (Plain Old Java Objects) o Interfaces/Clases (TypeScript/JavaScript):** Se recomienda usar modelos de datos definidos en el código para mapear fácilmente los documentos de Firestore a objetos en tu aplicación.
*   **Desnormalización:** En Firestore, es común desnormalizar datos (duplicar información) para optimizar el rendimiento de lectura y reducir la cantidad de consultas necesarias.

## Configuración de Firebase Authentication

`cultunica` utiliza Firebase Authentication para la gestión de usuarios, proporcionando métodos de inicio de sesión seguros y sencillos.

*   **Tipo de Autenticación:** `FIREBASE_AUTH`
*   **Dominios Autorizados:**
    *   `localhost`
    *   `cultunica-62c4f.firebaseapp.com`
    *   `cultunica-62c4f.web.app`
*   **Autenticación Multifactor (MFA):**
    *   **Estado:** `DISABLED`
    *   **Proveedores de MFA:** `N/A`
*   **Proveedores de Identidad Soportados por Defecto:** `N/A`
*   **Proveedores de Identidad SAML de Entrada:** `N/A`
*   **Proveedores de Identidad OAuth:** `N/A`
*   **Configuración de Inicio de Sesión:**
    *   **Correo Electrónico:** `Enabled`
        *   **Contraseña Requerida:** `true`
    *   **Teléfono:** `Disabled`
    *   **Anónimo:** `Disabled`
    *   **Permitir Correos Duplicados:** `true`

## Cómo Empezar (Desarrollo)

Para configurar el entorno de desarrollo y ejecutar `cultunica` localmente:

1.  **Clona este repositorio:**
    ```bash
    git clone https://github.com/tu-usuario/cultunica.git # (Reemplaza con tu URL de repo)
    cd cultunica
    ```
2.  **Configura las credenciales de Firebase:**
    *   Para desarrollo web (JavaScript/TypeScript), asegúrate de que tu configuración de Firebase en el frontend utilice las credenciales públicas de tu proyecto.
    *   Para operaciones de backend (Java Admin SDK), descarga tu `serviceAccountKey.json` desde la consola de Firebase (`Configuración del proyecto > Cuentas de servicio`) y colócalo en la ruta adecuada (`path/to/your/serviceAccountKey.json`).
3.  **Instala las dependencias:**
    *   `npm install` (para proyectos JavaScript/TypeScript)
    *   `mvn install` o `gradle build` (para proyectos Java si aplica)
4.  **Ejecuta la aplicación:**
    *   `npm start` (o el comando correspondiente a tu framework web)

## Contribución

¡Las contribuciones son bienvenidas! Si deseas contribuir a este proyecto, por favor, sigue estos pasos:

1.  Haz un "fork" del repositorio.
2.  Crea una nueva rama (`git checkout -b feature/AmazingFeature`).
3.  Realiza tus cambios y haz "commit" (`git commit -m 'Add some AmazingFeature'`).
4.  Haz "push" a la rama (`git push origin feature/AmazingFeature`).
5.  Abre un "Pull Request".

## Licencia

Este proyecto está bajo la Licencia [**aquí podrías especificar tu licencia, por ejemplo, MIT**]. Consulta el archivo `LICENSE` para más detalles.

Verifica la estructura de archivos del proyecto:

/cultunica
├── login.html         # Página de registro e inicio de sesión
├── principal.html     # Página principal de la red social
├── perfil2.html       # Página de perfil del usuario
├── firebase.js        # Configuración e inicialización de Firebase
└── assets/            # Imágenes, estilos CSS y scripts JS

▶️ Ejecución

Para probar la plataforma:

Abre el archivo login.html en tu navegador.

Regístrate o inicia sesión con tu correo y contraseña.

Accede a la página principal (principal.html), crea publicaciones y comienza a interactuar con la comunidad.

logotipo

[Imagotipo_Cultu_Nica (1).pdf](https://github.com/user-attachments/files/22564886/Imagotipo_Cultu_Nica.1.pdf)

https://drive.google.com/file/d/1T_hEJ2Ec0ggDpOr4nDL6vZW7UWqXaXNu/view?usp=sharing
Demo 
<img width="1920" height="1080" alt="Captura de pantalla (5)" src="https://github.com/user-attachments/assets/46379d82-3e96-40e3-96e8-a6ddbc1c1652" />
`
📋 Requisitos del Sistema

Navegador web actualizado (Chrome, Edge, Firefox).

Conexión estable a Internet (Firebase funciona en la nube).

🧰 Soporte

¿Tienes dudas o necesitas ayuda?
Puedes contactar al desarrollador o consultar la guía rápida incluida en el proyecto.

Equipo 

https://github.com/omarvilro-droid

📌 Nota Final

Cultunica es más que una plataforma: es un espacio digital para vivir, celebrar y preservar la cultura nicaragüense.
Únete, comparte, conecta. ¡La cultura vive contigo!
