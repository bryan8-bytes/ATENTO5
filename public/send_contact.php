<?php
/**
 * ATENTO5 SERVICIOS GENERALES E.I.R.L.
 * Backend de Envío de Correo del Formulario de Contacto
 * 
 * Este script se ejecuta en el servidor de Hosting Perú.
 * Recibe los datos del formulario mediante una petición POST en JSON o url-encoded,
 * sanitiza las entradas y envía un correo formateado en HTML a la bandeja de contacto.
 */

// 1. Configuración de Cabeceras CORS (Permite peticiones desde el frontend de desarrollo si es necesario)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

// Responder a peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Solo permitir peticiones POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        "success" => false,
        "message" => "Método no permitido. Solo se admite el método POST."
    ]);
    exit();
}

// 2. Parámetros de Configuración del Correo
$destinatario = "Juan.ampuero@atento5.com"; // Tu correo creado en Hosting Perú
$asunto_plantilla = "Nuevo Mensaje de Contacto - Web ATENTO5";

// 3. Obtención e Interpretación de Datos
$raw_input = file_get_contents("php://input");
$data = json_decode($raw_input, true);

// Fallback si los datos no vienen como JSON
if (json_last_error() !== JSON_ERROR_NONE || empty($data)) {
    $data = $_POST;
}

$nombre = isset($data['name']) ? trim($data['name']) : '';
$email = isset($data['email']) ? trim($data['email']) : '';
$telefono = isset($data['phone']) ? trim($data['phone']) : '';
$mensaje = isset($data['message']) ? trim($data['message']) : '';

// 4. Validación de Campos Requeridos
if (empty($nombre) || empty($email) || empty($mensaje)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "Por favor, complete todos los campos obligatorios (Nombre, Correo y Mensaje)."
    ]);
    exit();
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        "success" => false,
        "message" => "El formato del correo electrónico ingresado no es válido."
    ]);
    exit();
}

// 5. Sanitización de Inputs para Evitar Inyecciones de Cabeceras
$nombre = htmlspecialchars($nombre, ENT_QUOTES, 'UTF-8');
$email = filter_var($email, FILTER_SANITIZE_EMAIL);
$telefono = htmlspecialchars($telefono, ENT_QUOTES, 'UTF-8');
$mensaje = nl2br(htmlspecialchars($mensaje, ENT_QUOTES, 'UTF-8'));

// 6. Diseño del Cuerpo del Correo en HTML Premium (Colores Corporativos: Azul #3CB4FF y Rojo #D21414)
$cuerpo_html = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.08); border-top: 5px solid #3CB4FF; }
        .header { background: linear-gradient(135deg, #0a192f 0%, #020c1b 100%); padding: 30px; text-align: center; border-bottom: 2px solid #D21414; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 1px; }
        .header p { color: #3CB4FF; margin: 5px 0 0 0; font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; }
        .content { padding: 30px; line-height: 1.6; }
        .section-title { font-size: 16px; font-weight: bold; color: #D21414; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; margin-top: 0; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
        .field { margin-bottom: 15px; }
        .label { font-size: 11px; font-weight: bold; color: #64748b; text-transform: uppercase; margin-bottom: 4px; }
        .value { font-size: 14px; color: #0f172a; font-weight: 500; }
        .message-box { background-color: #f8fafc; border-left: 4px solid #3CB4FF; padding: 15px; border-radius: 4px; font-style: italic; color: #334155; margin-top: 10px; }
        .footer { background-color: #0a192f; color: #94a3b8; text-align: center; padding: 15px; font-size: 11px; border-top: 1px solid #1e293b; }
        .footer a { color: #3CB4FF; text-decoration: none; font-weight: bold; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>ATENTO5</h1>
            <p>Servicios Generales e Industriales</p>
        </div>
        <div class='content'>
            <h2 class='section-title'>Nuevo Mensaje desde Formulario Web</h2>
            
            <div class='field'>
                <div class='label'>Nombre del Remitente:</div>
                <div class='value'>$nombre</div>
            </div>
            
            <div class='field'>
                <div class='label'>Correo Electrónico:</div>
                <div class='value'><a href='mailto:$email'>$email</a></div>
            </div>
            
            <div class='field'>
                <div class='label'>Teléfono:</div>
                <div class='value'>" . (!empty($telefono) ? $telefono : "No especificado") . "</div>
            </div>
            
            <div class='field' style='margin-top: 25px;'>
                <div class='label'>Mensaje:</div>
                <div class='message-box'>$mensaje</div>
            </div>
        </div>
        <div class='footer'>
            Este correo fue generado automáticamente por el sitio web <a href='https://www.atento5.com'>www.atento5.com</a>.<br>
            © " . date("Y") . " ATENTO5 S.G. E.I.R.L. Todos los derechos reservados.
        </div>
    </div>
</body>
</html>
";

// 7. Configuración de Cabeceras del Email
// Para evitar que sea clasificado como spam, el remitente ('From') debe pertenecer al dominio del hosting.
// Usamos el correo corporativo como emisor y el correo del usuario en 'Reply-To' para que al responder, se le responda al usuario.
$from_email = "Juan.ampuero@atento5.com";
$headers = "MIME-Version: 1.0" . "\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8" . "\r\n";
$headers .= "From: ATENTO5 Web <$from_email>" . "\r\n";
$headers .= "Reply-To: $email" . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// 8. Envío de Correo
if (mail($destinatario, $asunto_plantilla, $cuerpo_html, $headers)) {
    http_response_code(200);
    echo json_encode([
        "success" => true,
        "message" => "¡Muchas gracias! Su mensaje ha sido enviado con éxito a ATENTO5. Nos pondremos en contacto a la brevedad."
    ]);
} else {
    // Si la función nativa mail() falla, indicamos un error
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Lo sentimos, hubo un problema técnico al enviar el correo. Por favor, contáctenos directamente al correo $destinatario o vía WhatsApp."
    ]);
}
?>
