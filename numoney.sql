-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 25-11-2024 a las 09:00:33
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `numoney`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cliente`
--

CREATE TABLE `cliente` (
  `IdCliente` varchar(255) NOT NULL,
  `NombreCompleto` varchar(255) NOT NULL,
  `Tipo_Documento` enum('Cedula de ciudadanía','Tarjeta de identidad','Cedula de extranjería','Pasaporte','Licencia de conducir') NOT NULL,
  `Correo` varchar(255) NOT NULL,
  `Direccion` varchar(255) NOT NULL,
  `Fecha_Registro` datetime NOT NULL,
  `Estado` enum('Activo','Inactivo','','') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cuenta`
--

CREATE TABLE `cuenta` (
  `IdCuenta` varchar(255) NOT NULL,
  `NumeroCuenta` varchar(255) NOT NULL,
  `TipoCuenta` enum('Cuenta ahorro','Cuenta corriente','Cuenta inversion') NOT NULL,
  `SaldoActual` double NOT NULL,
  `Estado` enum('Activa','Inactiva') NOT NULL,
  `FechaApertura` datetime NOT NULL,
  `IdCliente_fk` varchar(255) NOT NULL,
  `Telefono` varchar(15) NOT NULL,
  `contraseña` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `movimientocuenta`
--

CREATE TABLE `movimientocuenta` (
  `IdMovimiento` varchar(255) NOT NULL,
  `IdCuenta_fk` varchar(255) NOT NULL,
  `IdTransaccion_fk` varchar(255) NOT NULL,
  `FechaHora` datetime NOT NULL,
  `TipoMovimiento` enum('Deposito','Retiro','Transferencia','Pago','Recarga','Compra') NOT NULL,
  `SaldoPrevio` double NOT NULL,
  `SaldoPosterior` double NOT NULL,
  `EstadoMovimiento` enum('Pendiente','Completado','Fallido') NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `ReferenciaExterna` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicio`
--

CREATE TABLE `servicio` (
  `IdServicio` varchar(255) NOT NULL,
  `NombreServicio` varchar(255) NOT NULL,
  `Monto` double NOT NULL,
  `FechaHora` datetime NOT NULL,
  `IdTipoS_fk` varchar(255) NOT NULL,
  `IdProveedor_fk` varchar(255) NOT NULL,
  `IdCliente_fk` varchar(255) NOT NULL,
  `EstadoServicio` enum('Activo','Inactivo','Pendiente') NOT NULL,
  `Descripcion` varchar(255) DEFAULT NULL,
  `Comision` double DEFAULT NULL,
  `ReferenciaExterna` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `servicioproveedor`
--

CREATE TABLE `servicioproveedor` (
  `IdProveedor` varchar(255) NOT NULL,
  `Nombre` bigint(20) NOT NULL,
  `Direccion` varchar(255) NOT NULL,
  `Descripcion` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `telefonos`
--

CREATE TABLE `telefonos` (
  `IdRepTel` varchar(255) NOT NULL,
  `Telefono` varchar(255) NOT NULL,
  `IdClienteFk` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `tiposervicio`
--

CREATE TABLE `tiposervicio` (
  `IdTipoS` varchar(255) NOT NULL,
  `NombreTipoServicio` varchar(255) NOT NULL,
  `Descripcion` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `transaccion`
--

CREATE TABLE `transaccion` (
  `IdTransaccion` varchar(255) NOT NULL,
  `IdCuentaOrigen_fk` varchar(255) NOT NULL,
  `IdCuentaDestino_fk` varchar(255) NOT NULL,
  `TipoTransaccion` enum('Deposito','Retiro','Transferencia','Pago','Recarga','Compra') NOT NULL,
  `MontoAplica` double NOT NULL,
  `FechaHora` datetime NOT NULL,
  `Metodo` enum('Tarjeta credito','Tarjeta debito','Transferencia bancaria','NFC','QR','Criptomoneda') NOT NULL,
  `Descripcion` varchar(255) NOT NULL,
  `SaldoPosterior` double NOT NULL,
  `EstadoTransaccion` enum('Pendiente','Completada','Fallida','') NOT NULL,
  `Comision` double NOT NULL,
  `ReferenciaExterna` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `cliente`
--
ALTER TABLE `cliente`
  ADD PRIMARY KEY (`IdCliente`);

--
-- Indices de la tabla `cuenta`
--
ALTER TABLE `cuenta`
  ADD PRIMARY KEY (`IdCuenta`),
  ADD KEY `IdCliente_fk` (`IdCliente_fk`);

--
-- Indices de la tabla `movimientocuenta`
--
ALTER TABLE `movimientocuenta`
  ADD PRIMARY KEY (`IdMovimiento`),
  ADD KEY `IdTransaccion_fk` (`IdTransaccion_fk`),
  ADD KEY `IdCuenta_fk` (`IdCuenta_fk`);

--
-- Indices de la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD PRIMARY KEY (`IdServicio`),
  ADD KEY `IdCliente_fk` (`IdCliente_fk`),
  ADD KEY `IdTipoS_fk` (`IdTipoS_fk`),
  ADD KEY `IdProveedor_fk` (`IdProveedor_fk`);

--
-- Indices de la tabla `servicioproveedor`
--
ALTER TABLE `servicioproveedor`
  ADD PRIMARY KEY (`IdProveedor`);

--
-- Indices de la tabla `telefonos`
--
ALTER TABLE `telefonos`
  ADD PRIMARY KEY (`IdRepTel`),
  ADD KEY `idclientefk` (`IdClienteFk`),
  ADD KEY `IdClienteFk_2` (`IdClienteFk`);

--
-- Indices de la tabla `tiposervicio`
--
ALTER TABLE `tiposervicio`
  ADD PRIMARY KEY (`IdTipoS`);

--
-- Indices de la tabla `transaccion`
--
ALTER TABLE `transaccion`
  ADD PRIMARY KEY (`IdTransaccion`),
  ADD KEY `Cuentas` (`IdCuentaOrigen_fk`,`IdCuentaDestino_fk`),
  ADD KEY `IdCuentaDestino_fk` (`IdCuentaDestino_fk`);

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `cuenta`
--
ALTER TABLE `cuenta`
  ADD CONSTRAINT `cuenta_ibfk_1` FOREIGN KEY (`IdCliente_fk`) REFERENCES `cliente` (`IdCliente`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `movimientocuenta`
--
ALTER TABLE `movimientocuenta`
  ADD CONSTRAINT `movimientocuenta_ibfk_1` FOREIGN KEY (`IdTransaccion_fk`) REFERENCES `transaccion` (`IdTransaccion`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `movimientocuenta_ibfk_2` FOREIGN KEY (`IdCuenta_fk`) REFERENCES `cuenta` (`IdCuenta`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `servicio`
--
ALTER TABLE `servicio`
  ADD CONSTRAINT `servicio_ibfk_1` FOREIGN KEY (`IdCliente_fk`) REFERENCES `cliente` (`IdCliente`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `servicio_ibfk_2` FOREIGN KEY (`IdTipoS_fk`) REFERENCES `tiposervicio` (`IdTipoS`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `servicio_ibfk_3` FOREIGN KEY (`IdProveedor_fk`) REFERENCES `servicioproveedor` (`IdProveedor`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `telefonos`
--
ALTER TABLE `telefonos`
  ADD CONSTRAINT `telefonos_ibfk_1` FOREIGN KEY (`IdClienteFk`) REFERENCES `servicioproveedor` (`IdProveedor`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Filtros para la tabla `transaccion`
--
ALTER TABLE `transaccion`
  ADD CONSTRAINT `transaccion_ibfk_1` FOREIGN KEY (`IdCuentaOrigen_fk`) REFERENCES `cuenta` (`IdCuenta`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `transaccion_ibfk_2` FOREIGN KEY (`IdCuentaDestino_fk`) REFERENCES `cuenta` (`IdCuenta`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
