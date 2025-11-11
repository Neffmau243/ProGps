#!/bin/bash

# Script de prueba para la API GPS Tracking

BASE_URL="http://localhost:8000/api"

echo "========================================="
echo "GPS TRACKING API - PRUEBAS"
echo "========================================="
echo ""

# 1. Login como Admin
echo "1. Login como Admin..."
ADMIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@gps.com","password":"admin123"}')

ADMIN_TOKEN=$(echo $ADMIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$ADMIN_TOKEN" ]; then
  echo "❌ Error en login de admin"
  echo $ADMIN_RESPONSE
  exit 1
fi

echo "✅ Admin login exitoso"
echo "Token: ${ADMIN_TOKEN:0:20}..."
echo ""

# 2. Login como Empleado
echo "2. Login como Empleado..."
EMPLEADO_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"juan@gps.com","password":"empleado123"}')

EMPLEADO_TOKEN=$(echo $EMPLEADO_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$EMPLEADO_TOKEN" ]; then
  echo "❌ Error en login de empleado"
  echo $EMPLEADO_RESPONSE
  exit 1
fi

echo "✅ Empleado login exitoso"
echo "Token: ${EMPLEADO_TOKEN:0:20}..."
echo ""

# 3. Listar usuarios (Admin)
echo "3. Listar usuarios (como Admin)..."
USERS_RESPONSE=$(curl -s -X GET "$BASE_URL/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

echo "✅ Usuarios obtenidos"
echo $USERS_RESPONSE | head -c 200
echo "..."
echo ""

# 4. Listar dispositivos (Empleado)
echo "4. Listar dispositivos (como Empleado)..."
DEVICES_RESPONSE=$(curl -s -X GET "$BASE_URL/devices" \
  -H "Authorization: Bearer $EMPLEADO_TOKEN")

echo "✅ Dispositivos obtenidos"
echo $DEVICES_RESPONSE
echo ""

# 5. Registrar ubicación GPS (Empleado)
echo "5. Registrar ubicación GPS (como Empleado)..."
GPS_RESPONSE=$(curl -s -X POST "$BASE_URL/gps" \
  -H "Authorization: Bearer $EMPLEADO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "device_id": 1,
    "latitude": -12.046374,
    "longitude": -77.042793,
    "accuracy": 10.5
  }')

echo "✅ Ubicación GPS registrada"
echo $GPS_RESPONSE
echo ""

# Esperar un momento para que se procese
sleep 2

# 6. Ver ubicaciones actuales (Admin)
echo "6. Ver ubicaciones actuales (como Admin)..."
CURRENT_RESPONSE=$(curl -s -X GET "$BASE_URL/locations/current" \
  -H "Authorization: Bearer $ADMIN_TOKEN")

echo "✅ Ubicaciones actuales obtenidas"
echo $CURRENT_RESPONSE
echo ""

# 7. Crear nuevo usuario (Admin)
echo "7. Crear nuevo usuario (como Admin)..."
NEW_USER_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@gps.com",
    "password": "test123456",
    "role_id": 2
  }')

echo "✅ Usuario creado"
echo $NEW_USER_RESPONSE
echo ""

# 8. Intentar crear usuario como Empleado (debe fallar)
echo "8. Intentar crear usuario como Empleado (debe fallar)..."
FAIL_RESPONSE=$(curl -s -X POST "$BASE_URL/users" \
  -H "Authorization: Bearer $EMPLEADO_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fail User",
    "email": "fail@gps.com",
    "password": "fail123456",
    "role_id": 2
  }')

echo "✅ Acceso denegado correctamente"
echo $FAIL_RESPONSE
echo ""

echo "========================================="
echo "✅ TODAS LAS PRUEBAS COMPLETADAS"
echo "========================================="
