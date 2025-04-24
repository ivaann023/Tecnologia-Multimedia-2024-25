<?php
// Asegúrate de no tener líneas en blanco antes de esto
header('Content-Type: application/json');
session_start();

// 1) Recoge y valida datos
$email    = trim($_POST['email']    ?? '');
$password = $_POST['password'] ?? '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
    echo json_encode([
        'success' => false,
        'message' => 'Email y contraseña obligatorios.'
    ]);
    exit;
}

// 2) Carga el JSON correcto
$jsonFile = __DIR__ . '/../json/usuarios.json';
if (!file_exists($jsonFile)) {
    echo json_encode([
      'success' => false,
      'message' => 'Error interno: datos de usuarios no encontrados.'
    ]);
    exit;
}
$users = json_decode(file_get_contents($jsonFile), true) ?: [];

// 3) Busca el usuario por email (case-insensitive)
$found = null;
foreach ($users as $u) {
    if (isset($u['email']) && strcasecmp($u['email'], $email) === 0) {
        $found = $u;
        break;
    }
}

// 4) Verifica el hash usando la clave "description"
if (
    !$found ||
    !isset($found['description']) ||
    !password_verify($password, $found['description'])
) {
    echo json_encode([
        'success' => false,
        'message' => 'Email o contraseña incorrectos.'
    ]);
    exit;
}

// 5) Todo OK: guardamos la sesión y devolvemos éxito
$_SESSION['user'] = [
    'name'  => $found['name'],
    'email' => $found['email']
];

echo json_encode([
    'success' => true,
    'name'    => $found['name']
]);
exit;
