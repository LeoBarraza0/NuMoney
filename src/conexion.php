<?php
$host = "localhost";
$user = "root";
$password = ""; // Sin contraseña por defecto en XAMPP
$db = "nombre_de_tu_base_de_datos";

$conexion = new mysqli($host, $user, $password, $db);

if ($conexion->connect_error) {
    die("Error de conexión: " . $conexion->connect_error);
}
echo "Conexión exitosa";
?>