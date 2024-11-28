export const resetPasswordEmail = ` <!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Restablecer Contraseña</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
    <table style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
        <tr>
            <td style="background-color: #4caf50; color: #ffffff; text-align: center; padding: 20px;">
                <h1 style="margin: 0;">Restablecer tu contraseña</h1>
            </td>
        </tr>
        <tr>
            <td style="padding: 20px;">
                <p>Hola {{name}},</p>
                <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si fuiste tú quien solicitó este cambio, por favor haz clic en el botón de abajo:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="{{link}}" style="background-color: #4caf50; color: #ffffff; text-decoration: none; padding: 10px 20px; font-size: 16px; border-radius: 4px;">Restablecer Contraseña</a>
                </div>
                <p>Si no realizaste esta solicitud, puedes ignorar este correo. Tu contraseña actual seguirá siendo válida.</p>
                <p>Gracias,</p>
                <p>El equipo de duermes</p>
            </td>
        </tr>
        <tr>
            <td style="background-color: #f1f1f1; text-align: center; padding: 10px; font-size: 12px; color: #666;">
                <p>Este correo es generado automáticamente, por favor no respondas.</p>
                <p>&copy; 2024 duermes. Todos los derechos reservados.</p>
            </td>
        </tr>
    </table>
</body>
</html>`;
