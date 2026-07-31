<?php
/**
 * ATENTO5 SERVICIOS GENERALES E.I.R.L.
 * API de Gestión de Correo Corporativo (IMAP / SMTP)
 * 
 * Este script se ejecuta en el servidor de Hosting Perú.
 * Proporciona endpoints para leer carpetas de correo (IMAP), enviar correos (SMTP),
 * descargar archivos adjuntos y gestionar estados (leído, eliminado, destacado).
 */

// 1. Configuración de Cabeceras y CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Email, X-Password, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

// Responder a peticiones OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// 2. Obtener Credenciales de las Cabeceras HTTP
$email = isset($_SERVER['HTTP_X_EMAIL']) ? trim($_SERVER['HTTP_X_EMAIL']) : '';
$password = isset($_SERVER['HTTP_X_PASSWORD']) ? $_SERVER['HTTP_X_PASSWORD'] : '';

// Alternativa en caso de que las cabeceras HTTP no se envíen (por ejemplo, en descargas de archivos)
if (empty($email) || empty($password)) {
    $email = isset($_GET['email']) ? trim($_GET['email']) : '';
    $password = isset($_GET['password']) ? $_GET['password'] : '';
}

if (empty($email) || empty($password)) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "No autorizado. Credenciales X-Email y X-Password requeridas."
    ]);
    exit();
}

// 3. Configuración del Servidor de Correo de Atento5
$imap_host = "{mail.atento5.com:993/imap/ssl}";
$smtp_host = "ssl://mail.atento5.com";
$smtp_port = 465;

// Obtener acción solicitada
$action = isset($_GET['action']) ? $_GET['action'] : '';

// 4. Funciones Auxiliares para IMAP y Estructuras de Correo

/**
 * Obtener Tipo MIME de una estructura de parte
 */
function get_mime_type($structure) {
    $primary_mime_type = ["TEXT", "MULTIPART", "MESSAGE", "APPLICATION", "AUDIO", "IMAGE", "VIDEO", "OTHER"];
    if ($structure->subtype) {
        return $primary_mime_type[(int)$structure->type] . "/" . $structure->subtype;
    }
    return "TEXT/PLAIN";
}

/**
 * Buscar la parte correspondiente al número de parte en la estructura de manera recursiva
 */
function find_part_by_no($structure, $part_no, $current_prefix = "") {
    if ($part_no === "" || $part_no === "1") {
        if ($structure->type != 1) { // Si no es multiparte, es la parte principal
            return $structure;
        }
    }
    
    if ($structure->type == 1) { // multipart
        foreach ($structure->parts as $index => $sub_structure) {
            $prefix = $current_prefix === "" ? ($index + 1) : $current_prefix . "." . ($index + 1);
            if ((string)$prefix === (string)$part_no) {
                return $sub_structure;
            }
            $found = find_part_by_no($sub_structure, $part_no, $prefix);
            if ($found) return $found;
        }
    }
    return null;
}

/**
 * Buscar recursivamente las partes de texto HTML o plano de un correo
 */
function find_body_part($structure, $target_mime, $part_no = "") {
    $mime = get_mime_type($structure);
    if ($mime === $target_mime) {
        $charset = "UTF-8";
        if ($structure->ifparameters) {
            foreach ($structure->parameters as $p) {
                if (strtolower($p->attribute) === 'charset') {
                    $charset = $p->value;
                }
            }
        }
        return [
            'part_no' => $part_no === "" ? "1" : $part_no,
            'encoding' => $structure->encoding,
            'charset' => $charset
        ];
    }
    
    if ($structure->type == 1) { // multipart
        foreach ($structure->parts as $index => $sub_structure) {
            $prefix = $part_no === "" ? ($index + 1) : $part_no . "." . ($index + 1);
            $found = find_body_part($sub_structure, $target_mime, $prefix);
            if ($found) return $found;
        }
    }
    
    return null;
}

/**
 * Obtener y decodificar el cuerpo de texto del correo electrónico
 */
function get_email_body($mbox, $uid) {
    $structure = imap_fetchstructure($mbox, $uid, FT_UID);
    if (!$structure) return "";
    
    $html_part = find_body_part($structure, "TEXT/HTML");
    $plain_part = find_body_part($structure, "TEXT/PLAIN");
    
    $part_no = "";
    $mime_type = "";
    $encoding = 0;
    
    if ($html_part) {
        $part_no = $html_part['part_no'];
        $mime_type = "TEXT/HTML";
        $encoding = $html_part['encoding'];
    } elseif ($plain_part) {
        $part_no = $plain_part['part_no'];
        $mime_type = "TEXT/PLAIN";
        $encoding = $plain_part['encoding'];
    } else {
        $encoding = $structure->encoding;
        $mime_type = get_mime_type($structure);
        $part_no = "1";
    }
    
    $body = imap_fetchbody($mbox, $uid, $part_no, FT_UID);
    
    // Decodificar según codificación de transferencia
    if ($encoding == 3) { // BASE64
        $body = base64_decode($body);
    } elseif ($encoding == 4) { // QUOTED-PRINTABLE
        $body = quoted_printable_decode($body);
    }
    
    // Detectar Charset y convertir a UTF-8 si es necesario
    $charset = "UTF-8";
    if ($html_part && isset($html_part['charset'])) {
        $charset = $html_part['charset'];
    } elseif ($plain_part && isset($plain_part['charset'])) {
        $charset = $plain_part['charset'];
    }
    
    if (strtoupper($charset) !== 'UTF-8' && !empty($body)) {
        // Ignorar errores de conversión
        $body = @mb_convert_encoding($body, 'UTF-8', $charset);
    }
    
    // Si es texto plano, agregar saltos de línea para mostrar en HTML
    if ($mime_type === "TEXT/PLAIN") {
        $body = nl2br(htmlspecialchars($body));
    }
    
    return $body;
}

/**
 * Buscar recursivamente todos los archivos adjuntos en la estructura del correo
 */
function get_attachments($mbox, $uid, $structure = false, $part_no = "") {
    $attachments = [];
    if (!$structure) {
        $structure = imap_fetchstructure($mbox, $uid, FT_UID);
    }
    if ($structure) {
        if ($structure->type == 1) { // multipart
            foreach ($structure->parts as $index => $sub_structure) {
                $prefix = $part_no === "" ? ($index + 1) : $part_no . "." . ($index + 1);
                $attachments = array_merge($attachments, get_attachments($mbox, $uid, $sub_structure, $prefix));
            }
        } else {
            // Verificar si es archivo adjunto por disposición o parámetros
            $filename = "";
            $is_attachment = false;
            
            if ($structure->ifdisposition && (strtolower($structure->disposition) == "attachment" || strtolower($structure->disposition) == "inline")) {
                $is_attachment = true;
            }
            
            if ($structure->ifparameters) {
                foreach ($structure->parameters as $p) {
                    if (strtolower($p->attribute) == "name" || strtolower($p->attribute) == "filename") {
                        $filename = $p->value;
                        $is_attachment = true;
                    }
                }
            }
            if ($structure->ifdparameters) {
                foreach ($structure->dparameters as $p) {
                    if (strtolower($p->attribute) == "name" || strtolower($p->attribute) == "filename") {
                        $filename = $p->value;
                        $is_attachment = true;
                    }
                }
            }
            
            // Si es un adjunto y tiene nombre, lo agregamos a la lista
            if ($is_attachment && $filename) {
                $size_bytes = $structure->bytes;
                $size_str = $size_bytes > 1024 * 1024 
                    ? round($size_bytes / (1024 * 1024), 1) . " MB"
                    : round($size_bytes / 1024, 0) . " KB";
                
                $attachments[] = [
                    'part_no' => $part_no === "" ? "1" : $part_no,
                    'name' => imap_utf8($filename),
                    'size' => $size_str,
                    'type' => strtolower(pathinfo($filename, PATHINFO_EXTENSION))
                ];
            }
        }
    }
    return $attachments;
}

/**
 * Detectar nombres de carpetas en cPanel IMAP
 */
function get_imap_folders($mbox, $imap_host) {
    $list = @imap_getmailboxes($mbox, $imap_host, "*");
    $folders = [];
    if ($list) {
        foreach ($list as $val) {
            $name = $val->name;
            $clean_name = str_replace($imap_host, "", $name);
            $lower_name = strtolower($clean_name);

            $key = strtolower($clean_name);
            if ($key === 'inbox') {
                $folders['inbox'] = $clean_name;
            } elseif (strpos($lower_name, 'sent') !== false || strpos($lower_name, 'enviados') !== false) {
                $folders['sent'] = $clean_name;
            } elseif (strpos($lower_name, 'trash') !== false || strpos($lower_name, 'papelera') !== false || strpos($lower_name, 'eliminados') !== false) {
                $folders['trash'] = $clean_name;
            } elseif (strpos($lower_name, 'draft') !== false || strpos($lower_name, 'borradores') !== false) {
                $folders['drafts'] = $clean_name;
            } elseif (strpos($lower_name, 'spam') !== false || strpos($lower_name, 'correo no deseado') !== false || strpos($lower_name, 'junk') !== false) {
                $folders['spam'] = $clean_name;
            } else {
                $folders[$key] = $clean_name;
            }
        }
    }

    if (!isset($folders['inbox'])) {
        $folders['inbox'] = 'INBOX';
    }
    if (!isset($folders['sent'])) {
        $folders['sent'] = 'INBOX.Sent';
    }
    if (!isset($folders['trash'])) {
        $folders['trash'] = 'INBOX.Trash';
    }
    if (!isset($folders['drafts'])) {
        $folders['drafts'] = 'INBOX.Drafts';
    }
    if (!isset($folders['spam'])) {
        $folders['spam'] = 'INBOX.Spam';
    }

    return $folders;
}

// 5. Lógica del Cliente SMTP (Envío Seguro)
function smtp_send($from, $password, $to, $subject, $body_html, $attachments = []) {
    global $smtp_host, $smtp_port;
    
    // Conectar vía SSL/TLS
    $socket = @fsockopen($smtp_host, $smtp_port, $errno, $errstr, 15);
    if (!$socket) {
        throw new Exception("Error al conectar al servidor SMTP de Atento5: $errstr ($errno)");
    }
    
    // Función local para validar las respuestas del servidor SMTP
    $read_socket = function($socket, $expected) {
        $response = "";
        while ($line = fgets($socket, 512)) {
            $response .= $line;
            if (substr($line, 3, 1) === " ") {
                break;
            }
        }
        $code = substr($response, 0, 3);
        if ($code !== $expected) {
            throw new Exception("Error SMTP: Esperaba código $expected, recibí: $response");
        }
        return $response;
    };
    
    $read_socket($socket, "220");
    
    fwrite($socket, "EHLO mail.atento5.com\r\n");
    $read_socket($socket, "250");
    
    fwrite($socket, "AUTH LOGIN\r\n");
    $read_socket($socket, "334");
    
    fwrite($socket, base64_encode($from) . "\r\n");
    $read_socket($socket, "334");
    
    fwrite($socket, base64_encode($password) . "\r\n");
    $read_socket($socket, "235");
    
    fwrite($socket, "MAIL FROM:<$from>\r\n");
    $read_socket($socket, "250");
    
    // Procesar destinatarios (soporta correos separados por comas o punto y coma)
    $recipients = preg_split('/[,;]+/', $to);
    foreach ($recipients as $rcpt) {
        $rcpt = trim($rcpt);
        if (empty($rcpt)) continue;
        // Limpiar formato "Nombre <correo@server.com>" a "correo@server.com"
        $clean_rcpt = $rcpt;
        if (preg_match('/<([^>]+)>/', $rcpt, $matches)) {
            $clean_rcpt = trim($matches[1]);
        }
        if (empty($clean_rcpt) || strpos($clean_rcpt, '@') === false) continue;
        fwrite($socket, "RCPT TO:<$clean_rcpt>\r\n");
        $read_socket($socket, "250");
    }
    
    fwrite($socket, "DATA\r\n");
    $read_socket($socket, "354");
    
    // Construcción del correo en formato MIME
    $boundary = "----=" . md5(uniqid(rand(), true));
    
    $headers = "From: $from\r\n";
    $headers .= "To: $to\r\n";
    $headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n\r\n";
    
    // Cuerpo del correo
    $message = "This is a multi-part message in MIME format.\r\n\r\n";
    $message .= "--$boundary\r\n";
    $message .= "Content-Type: text/html; charset=UTF-8\r\n";
    $message .= "Content-Transfer-Encoding: base64\r\n\r\n";
    $message .= chunk_split(base64_encode($body_html)) . "\r\n";
    
    // Adjuntar archivos
    foreach ($attachments as $att) {
        $filename = $att['name'];
        $content = $att['content'];
        $type = $att['type'];
        
        $message .= "--$boundary\r\n";
        $message .= "Content-Type: $type; name=\"$filename\"\r\n";
        $message .= "Content-Disposition: attachment; filename=\"$filename\"\r\n";
        $message .= "Content-Transfer-Encoding: base64\r\n\r\n";
        $message .= chunk_split(base64_encode($content)) . "\r\n";
    }
    
    $message .= "--$boundary--\r\n";
    
    // Enviar contenido total y finalizar DATA con un punto en una línea solitaria
    fwrite($socket, $headers . $message . "\r\n.\r\n");
    $read_socket($socket, "250");
    
    fwrite($socket, "QUIT\r\n");
    $read_socket($socket, "221");
    
    fclose($socket);
    return true;
}

// 6. Enrutamiento de Acciones

// Endpoint para obtener listado de carpetas IMAP
if ($action === 'get_folders') {
    $mbox_test = @imap_open($imap_host, $email, $password, OP_HALFOPEN);
    if (!$mbox_test) {
        http_response_code(401);
        echo json_encode([
            "success" => false,
            "message" => "No se pudo abrir la conexion IMAP para listar carpetas."
        ]);
        exit();
    }

    $folders_map = get_imap_folders($mbox_test, $imap_host);
    imap_close($mbox_test);

    $response_folders = [];
    foreach ($folders_map as $key => $imap_name) {
        $response_folders[] = [
            'key' => $key,
            'name' => $imap_name,
            'label' => ucfirst($key)
        ];
    }

    echo json_encode([
        "success" => true,
        "folders" => $response_folders
    ]);
    exit();
}

// Abrir una conexión de prueba inicial a IMAP para descubrir carpetas y validar contraseña
$mbox_test = @imap_open($imap_host, $email, $password, OP_HALFOPEN);
if (!$mbox_test) {
    http_response_code(401);
    echo json_encode([
        "success" => false,
        "message" => "Error de inicio de sesión: No se pudo conectar al servidor de correos con las credenciales provistas. Verifique su correo o contraseña."
    ]);
    exit();
}

$folders = get_imap_folders($mbox_test, $imap_host);
imap_close($mbox_test);

// ─────────────────────────────────────────────
// ACCIÓN: OBTENER CORREOS
// ─────────────────────────────────────────────
if ($action === 'get_emails') {
    set_time_limit(0);
    ini_set('memory_limit', '512M');

    $folder_key = isset($_GET['folder']) ? trim($_GET['folder']) : 'inbox';
    $target_folder_key = ($folder_key === 'starred') ? 'inbox' : $folder_key;

    if (!isset($folders[$target_folder_key])) {
        $target_folder_key = 'inbox';
    }

    $folder_path = $imap_host . $folders[$target_folder_key];
    $mbox = @imap_open($folder_path, $email, $password);

    if (!$mbox) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "No se pudo abrir la carpeta $folder_key en el servidor de correo."
        ]);
        exit();
    }

    $num_messages = imap_num_msg($mbox);
    $emails_list = [];

    if ($num_messages > 0) {
        $count = (int)$num_messages;
        $start = $num_messages;
        $end = max(1, $start - $count + 1);

        for ($i = $start; $i >= $end; $i--) {
            $header = @imap_headerinfo($mbox, $i);
            if (!$header) continue;

            $uid = imap_uid($mbox, $i);

            $from_name = isset($header->from[0]->personal) ? imap_utf8($header->from[0]->personal) : '';
            $from_email = isset($header->from[0]->mailbox) && isset($header->from[0]->host)
                ? $header->from[0]->mailbox . "@" . $header->from[0]->host
                : '';
            if (empty($from_name)) {
                $from_name = $from_email;
            }

            $to_name = isset($header->to[0]->personal) ? imap_utf8($header->to[0]->personal) : '';
            $to_email = isset($header->to[0]->mailbox) && isset($header->to[0]->host)
                ? $header->to[0]->mailbox . "@" . $header->to[0]->host
                : '';
            if (empty($to_name)) {
                $to_name = $to_email;
            }

            $subject = isset($header->subject) ? imap_utf8($header->subject) : '(Sin asunto)';
            $timestamp = isset($header->udate) ? $header->udate : strtotime($header->date);

            if ($timestamp > time()) {
                continue;
            }

            $date_str = date("d M Y, h:i A", $timestamp);
            $today = strtotime('today');
            $yesterday = strtotime('yesterday');
            if ($timestamp >= $today) {
                $date_str = "Hoy, " . date("h:i A", $timestamp);
            } elseif ($timestamp >= $yesterday) {
                $date_str = "Ayer, " . date("h:i A", $timestamp);
            }

            $is_read = empty($header->Unseen);
            $is_starred = ($header->Flagged === 'F' || $header->Flagged === 'T');

            if ($folder_key === 'starred' && !$is_starred) {
                continue;
            }

            $emails_list[] = [
                'id' => $uid,
                'fromName' => $from_name,
                'fromEmail' => $from_email,
                'toName' => $to_name,
                'toEmail' => $to_email,
                'subject' => $subject,
                'date' => $date_str,
                'isRead' => $is_read,
                'isStarred' => $is_starred,
                'folder' => $folder_key
            ];
        }
    }

    imap_close($mbox);

    echo json_encode([
        "success" => true,
        "emails" => $emails_list,
        "total" => count($emails_list),
        "server_total" => $num_messages,
        "has_more" => false
    ]);
    exit();
}

elseif ($action === 'get_email') {
    $uid = isset($_GET['uid']) ? (int)$_GET['uid'] : 0;
    $folder_key = isset($_GET['folder']) ? trim($_GET['folder']) : 'inbox';
    $target_folder_key = ($folder_key === 'starred') ? 'inbox' : $folder_key;
    
    if (!isset($folders[$target_folder_key])) {
        $target_folder_key = 'inbox';
    }
    
    $folder_path = $imap_host . $folders[$target_folder_key];
    $mbox = @imap_open($folder_path, $email, $password);
    
    if (!$mbox) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "No se pudo abrir la carpeta."]);
        exit();
    }
    
    $msgno = imap_msgno($mbox, $uid);
    if (!$msgno) {
        imap_close($mbox);
        echo json_encode(["success" => false, "message" => "Correo no encontrado."]);
        exit();
    }
    
    $header = @imap_headerinfo($mbox, $msgno);
    $realUid = imap_uid($mbox, $msgno);
    $body = get_email_body($mbox, $realUid);
    $attachments = get_attachments($mbox, $realUid);
    
    $from_name = isset($header->from[0]->personal) ? imap_utf8($header->from[0]->personal) : '';
    $from_email = isset($header->from[0]->mailbox) && isset($header->from[0]->host) 
        ? $header->from[0]->mailbox . "@" . $header->from[0]->host 
        : '';
    $to_name = isset($header->to[0]->personal) ? imap_utf8($header->to[0]->personal) : '';
    $to_email = isset($header->to[0]->mailbox) && isset($header->to[0]->host) 
        ? $header->to[0]->mailbox . "@" . $header->to[0]->host 
        : '';
    
    imap_close($mbox);
    
    echo json_encode([
        "success" => true,
        "id" => $uid,
        "fromName" => $from_name ?: $from_email,
        "fromEmail" => $from_email,
        "toName" => $to_name ?: $to_email,
        "toEmail" => $to_email,
        "subject" => isset($header->subject) ? imap_utf8($header->subject) : '(Sin asunto)',
        "body" => $body,
        "attachments" => $attachments,
        "date" => date("d M Y, h:i A", isset($header->udate) ? $header->udate : strtotime($header->date)),
        "isRead" => empty($header->Unseen),
        "isStarred" => ($header->Flagged === 'F' || $header->Flagged === 'T')
    ]);
    exit();
}

// ─────────────────────────────────────────────
// ACCIÓN: ENVIAR CORREO
// ─────────────────────────────────────────────
elseif ($action === 'send_email') {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Método no permitido. Use POST."]);
        exit();
    }
    
    $to = isset($_POST['to']) ? trim($_POST['to']) : '';
    $subject = isset($_POST['subject']) ? trim($_POST['subject']) : '';
    $body = isset($_POST['body']) ? trim($_POST['body']) : '';
    
    if (empty($to) || empty($body)) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Destinatario y cuerpo son obligatorios."]);
        exit();
    }
    
    // Procesar archivos adjuntos subidos
    $attachments = [];
    $attachment_count = isset($_POST['attachment_count']) ? (int)$_POST['attachment_count'] : 0;
    
    for ($i = 0; $i < $attachment_count; $i++) {
        $file_key = "attachment_" . $i;
        if (isset($_FILES[$file_key]) && $_FILES[$file_key]['error'] === UPLOAD_ERR_OK) {
            $file_tmp = $_FILES[$file_key]['tmp_name'];
            $file_name = $_FILES[$file_key]['name'];
            $file_type = $_FILES[$file_key]['type'];
            
            $attachments[] = [
                'name' => $file_name,
                'content' => file_get_contents($file_tmp),
                'type' => $file_type
            ];
        }
    }
    
    try {
        // Enviar vía SMTP seguro utilizando la cuenta del usuario autenticado
        smtp_send($email, $password, $to, $subject, $body, $attachments);
        
        // Guardar también una copia en la carpeta "Enviados" en IMAP
        $sent_folder = isset($folders['sent']) ? $folders['sent'] : 'INBOX.Sent';
        $mbox = @imap_open($imap_host . $sent_folder, $email, $password);
        if ($mbox) {
            // Construir cabeceras mínimas para la copia local en el servidor
            $boundary = "----=" . md5(uniqid(rand(), true));
            $copy_headers = "From: $email\r\n";
            $copy_headers .= "To: $to\r\n";
            $copy_headers .= "Subject: =?UTF-8?B?" . base64_encode($subject) . "?=\r\n";
            $copy_headers .= "MIME-Version: 1.0\r\n";
            $copy_headers .= "Content-Type: multipart/mixed; boundary=\"$boundary\"\r\n";
            $copy_headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
            $copy_headers .= "Date: " . date("r") . "\r\n\r\n";
            
            $copy_msg = "--$boundary\r\n";
            $copy_msg .= "Content-Type: text/html; charset=UTF-8\r\n";
            $copy_msg .= "Content-Transfer-Encoding: base64\r\n\r\n";
            $copy_msg .= chunk_split(base64_encode($body)) . "\r\n";
            
            foreach ($attachments as $att) {
                $copy_msg .= "--$boundary\r\n";
                $copy_msg .= "Content-Type: " . $att['type'] . "; name=\"" . $att['name'] . "\"\r\n";
                $copy_msg .= "Content-Disposition: attachment; filename=\"" . $att['name'] . "\"\r\n";
                $copy_msg .= "Content-Transfer-Encoding: base64\r\n\r\n";
                $copy_msg .= chunk_split(base64_encode($att['content'])) . "\r\n";
            }
            $copy_msg .= "--$boundary--\r\n";
            
            // Añadir al buzón de enviados y marcarlo como leído (\Seen)
            @imap_append($mbox, $imap_host . $sent_folder, $copy_headers . $copy_msg, "\\Seen");
            @imap_close($mbox);
        }
        
        echo json_encode([
            "success" => true,
            "message" => "Correo electrónico enviado con éxito vía SMTP."
        ]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode([
            "success" => false,
            "message" => "Error al enviar el correo: " . $e->getMessage()
        ]);
    }
    exit();
}

// ─────────────────────────────────────────────
// ACCIÓN: DESCARGAR ARCHIVO ADJUNTO
// ─────────────────────────────────────────────
elseif ($action === 'download_attachment') {
    $uid = isset($_GET['uid']) ? (int)$_GET['uid'] : 0;
    $part_no = isset($_GET['part_no']) ? trim($_GET['part_no']) : '';
    $folder_key = isset($_GET['folder']) ? trim($_GET['folder']) : 'inbox';
    
    if ($folder_key === 'starred') {
        $folder_key = 'inbox';
    }
    
    if (!isset($folders[$folder_key])) {
        $folder_key = 'inbox';
    }
    
    $mbox = @imap_open($imap_host . $folders[$folder_key], $email, $password);
    if (!$mbox) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "No se pudo conectar al buzón de correo."]);
        exit();
    }
    
    $structure = imap_fetchstructure($mbox, $uid, FT_UID);
    $target_part = find_part_by_no($structure, $part_no);
    
    if (!$target_part) {
        http_response_code(404);
        echo json_encode(["success" => false, "message" => "Archivo adjunto no encontrado en el mensaje."]);
        exit();
    }
    
    $filename = "archivo_adjunto";
    if ($target_part->ifparameters) {
        foreach ($target_part->parameters as $p) {
            if (strtolower($p->attribute) === 'name' || strtolower($p->attribute) === 'filename') {
                $filename = $p->value;
            }
        }
    }
    if ($target_part->ifdparameters) {
        foreach ($target_part->dparameters as $p) {
            if (strtolower($p->attribute) === 'name' || strtolower($p->attribute) === 'filename') {
                $filename = $p->value;
            }
        }
    }
    
    $filename = imap_utf8($filename);
    $mime_type = get_mime_type($target_part);
    
    $content = imap_fetchbody($mbox, $uid, $part_no, FT_UID);
    
    if ($target_part->encoding == 3) {
        $content = base64_decode($content);
    } elseif ($target_part->encoding == 4) {
        $content = quoted_printable_decode($content);
    }
    
    imap_close($mbox);
    
    // Transmitir archivo al cliente para descarga
    header("Pragma: public");
    header("Expires: 0");
    header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
    header("Content-Type: $mime_type");
    header("Content-Disposition: attachment; filename=\"$filename\"");
    header("Content-Transfer-Encoding: binary");
    header("Content-Length: " . strlen($content));
    echo $content;
    exit();
}

// ─────────────────────────────────────────────
// ACCIÓN: CAMBIAR ESTADO DESTACADO (STAR)
// ─────────────────────────────────────────────
elseif ($action === 'toggle_star') {
    $uid = isset($_GET['uid']) ? (int)$_GET['uid'] : 0;
    $folder_key = isset($_GET['folder']) ? trim($_GET['folder']) : 'inbox';
    $is_starred = isset($_GET['starred']) && $_GET['starred'] === 'true';
    
    if ($folder_key === 'starred') $folder_key = 'inbox';
    $mbox = @imap_open($imap_host . $folders[$folder_key], $email, $password);
    
    if ($mbox) {
        if ($is_starred) {
            imap_setflag_full($mbox, $uid, "\\Flagged", ST_UID);
        } else {
            imap_clearflag_full($mbox, $uid, "\\Flagged", ST_UID);
        }
        imap_close($mbox);
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "No se pudo actualizar el estado en el servidor."]);
    }
    exit();
}

// ─────────────────────────────────────────────
// ACCIÓN: ELIMINAR CORREO (MOVER A PAPELERA / PERMANENTE)
// ─────────────────────────────────────────────
elseif ($action === 'delete_email') {
    $uid = isset($_GET['uid']) ? (int)$_GET['uid'] : 0;
    $folder_key = isset($_GET['folder']) ? trim($_GET['folder']) : 'inbox';
    
    if ($folder_key === 'starred') $folder_key = 'inbox';
    $mbox = @imap_open($imap_host . $folders[$folder_key], $email, $password);
    
    if ($mbox) {
        if ($folder_key === 'trash') {
            // Eliminar permanentemente
            imap_delete($mbox, $uid, FT_UID);
            imap_expunge($mbox);
            imap_close($mbox);
            echo json_encode(["success" => true, "deleted" => "permanent"]);
        } else {
            // Mover a papelera
            $trash_folder = isset($folders['trash']) ? $folders['trash'] : 'INBOX.Trash';
            $move_success = imap_mail_move($mbox, $uid, $trash_folder, CP_UID);
            if ($move_success) {
                imap_expunge($mbox);
            }
            imap_close($mbox);
            echo json_encode(["success" => true, "deleted" => "moved_to_trash"]);
        }
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "No se pudo eliminar el correo."]);
    }
    exit();
}

// ─────────────────────────────────────────────
// ACCIÓN: MARCAR COMO LEÍDO / NO LEÍDO
// ─────────────────────────────────────────────
elseif ($action === 'mark_read') {
    $uid = isset($_GET['uid']) ? (int)$_GET['uid'] : 0;
    $folder_key = isset($_GET['folder']) ? trim($_GET['folder']) : 'inbox';
    $is_read = isset($_GET['read']) && $_GET['read'] === 'true';
    
    if ($folder_key === 'starred') $folder_key = 'inbox';
    $mbox = @imap_open($imap_host . $folders[$folder_key], $email, $password);
    
    if ($mbox) {
        if ($is_read) {
            imap_setflag_full($mbox, $uid, "\\Seen", ST_UID);
        } else {
            imap_clearflag_full($mbox, $uid, "\\Seen", ST_UID);
        }
        imap_close($mbox);
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "No se pudo actualizar el estado de lectura."]);
    }
    exit();
}

// ─────────────────────────────────────────────
// ACCIÓN: RESTAURAR CORREO DESDE LA PAPELERA
// ─────────────────────────────────────────────
elseif ($action === 'restore_email') {
    $uid = isset($_GET['uid']) ? (int)$_GET['uid'] : 0;
    
    // Conectar a la papelera
    $trash_folder = isset($folders['trash']) ? $folders['trash'] : 'INBOX.Trash';
    $mbox = @imap_open($imap_host . $trash_folder, $email, $password);
    
    if ($mbox) {
        // Encontrar el remitente para decidir si va a inbox o sent
        $header = imap_headerinfo($mbox, imap_msgno($mbox, $uid));
        $from_email = isset($header->from[0]->mailbox) && isset($header->from[0]->host) 
            ? $header->from[0]->mailbox . "@" . $header->from[0]->host 
            : '';
            
        $target_folder_key = (strtolower($from_email) === strtolower($email)) ? 'sent' : 'inbox';
        $target_folder = isset($folders[$target_folder_key]) ? $folders[$target_folder_key] : 'INBOX';
        
        $move_success = imap_mail_move($mbox, $uid, $target_folder, CP_UID);
        if ($move_success) {
            imap_expunge($mbox);
        }
        imap_close($mbox);
        echo json_encode(["success" => true]);
    } else {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "No se pudo restaurar el correo."]);
    }
    exit();
}

// Acción desconocida
else {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Acción inválida o no especificada."]);
    exit();
}



