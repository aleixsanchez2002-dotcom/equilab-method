#!/bin/sh
# Arranque del servidor de desarrollo con el Node instalado en ~/.local/node
export PATH="$HOME/.local/node/bin:$PATH"
exec npm run dev
