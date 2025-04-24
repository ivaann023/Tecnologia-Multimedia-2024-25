<?php
session_start();
header('Content-Type: application/json');

// 1) Recuperar los datos del formulario
$name     = trim($_POST['name']     ?? '');
$email    = trim($_POST['email']    ?? '');
$password = $_POST['password']      ?? '';

if (empty($name) || !filter_var($email, FILTER_VALIDATE_EMAIL) || empty($password)) {
    echo json_encode([
        'success' => false,
        'message' => 'Debes indicar nombre, un email válido y una contraseña.'
    ]);
    exit;
}

// 2) Ruta al JSON (desde php/ hacia ../json/)
$file = __DIR__ . '/../json/usuarios.json';
if (!file_exists($file)) {
    file_put_contents($file, json_encode([], JSON_PRETTY_PRINT|JSON_UNESCAPED_UNICODE));
}
$users = json_decode(file_get_contents($file), true) ?: [];

// 3) Comprobar duplicados
foreach ($users as $u) {
    if (strcasecmp($u['email'], $email) === 0) {
        echo json_encode([
            'success' => false,
            'message' => 'Ya existe un usuario con ese correo.'
        ]);
        exit;
    }
}

// 4) Añadir al array y guardar
$users[] = [
    'name'        => $name,
    'email'       => $email,
    'description' => password_hash($password, PASSWORD_DEFAULT)
];

$bytes = file_put_contents(
    $file,
    json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
);

if ($bytes === false) {
    echo json_encode([
        'success' => false,
        'message' => 'Error al guardar en el servidor.'
    ]);
    exit;
}

// 5) Éxito
$_SESSION['user'] = ['name'=>$name,'email'=>$email];
echo json_encode([
    'success' => true,
    'name'    => $name
]);
exit;
