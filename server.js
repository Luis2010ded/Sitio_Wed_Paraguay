const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors'); 

const app = express();

app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de Gmail
const transpor_config = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'luisanibalaguilera1@gmail.com', 
        pass: 'csvxgpmfzacxvivh' // Tu contraseña de aplicación activa          
    }
});

// Ruta del formulario
app.post('/api/nuevo-pedido', (req, res) => {
    const { nombre, apellidos, telefono, email, notas, producto } = req.body;

    // 1. EL CORREO QUE TE LLEGA A VOS (Con los datos para trabajar)
    const emailParaAnibal = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background-color: #f9f9f9;">
            <h2 style="color: #001a4d; text-align: center;">🚀 ¡Tenés un Nuevo Pedido!</h2>
            <p>Se ha generado una nueva solicitud desde la landing page. Aquí tenés los datos para contactar al cliente:</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p><b>Cliente:</b> ${nombre} ${apellidos}</p>
            <p><b>WhatsApp / Tel:</b> ${telefono}</p>
            <p><b>Correo:</b> ${email}</p>
            <p><b>Detalles del Proyecto:</b> ${notas}</p>
            <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
            <p style="font-size: 0.85em; color: #777; text-align: center;">Anibal.Dev - Gestión de Pedidos Automática</p>
        </div>
    `;

    // 2. EL CORREO QUE LE LLEGA AL CLIENTE (Profesional y de agradecimiento)
    const emailParaCliente = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
            <div style="text-align: center;">
                <h2 style="color: #00a8ff; margin-bottom: 5px;">¡Gracias por tu solicitud!</h2>
                <p style="color: #555; font-size: 1.1em;">Hola <b>${nombre}</b>, recibimos correctamente tu pedido.</p>
            </div>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p>Estamos muy contentos de trabajar contigo. Nuestro equipo ya está revisando los detalles de tu propuesta para el servicio de <b>${producto}</b>.</p>
            <p>En la brevedad posible nos estaremos poniendo en contacto contigo a tu WhatsApp (<b>${telefono}</b>) para coordinar los siguientes pasos.</p>
            <br>
            <p style="margin-bottom: 0;">Saludos cordiales,</p>
            <p style="margin-top: 5px; font-weight: bold; color: #001a4d;">Luis Anibal Aguilera - Desarrollador Principal</p>
        </div>
    `;

    // CONFIGURACIÓN DEL ENVÍO AL CLIENTE
    const opcionesCliente = {
        from: '"Sitios Web Paraguay 🚀" <luisanibalaguilera1@gmail.com>', 
        to: email, 
        subject: `¡Recibimos tu solicitud, ${nombre}! ✨`,
        html: emailParaCliente
    };

    // CONFIGURACIÓN DEL ENVÍO PARA VOS
    const opcionesAnibal = {
        from: '"Servidor Web 🤖" <luisanibalaguilera1@gmail.com>', 
        to: 'luisanibalaguilera1@gmail.com', 
        subject: `🚨 NUEVO PEDIDO: ${nombre} ${apellidos}`,
        html: emailParaAnibal
    };

    // Enviar correo al cliente
    transpor_config.sendMail(opcionesCliente, (error) => {
        if (error) {
            console.log("Error al enviar al cliente:", error);
            return res.status(500).json({ OK: false, msg: 'Error al procesar el pedido.' });
        }

        // Si el del cliente sale bien, se envía el tuyo
        transpor_config.sendMail(opcionesAnibal, (err) => {
            if (err) console.log("Error al enviarte la copia a vos:", err);
            
            // Responder éxito a la página web
            res.status(200).json({ OK: true, msg: 'Pedido procesado con éxito.' });
        });
    });
});

app.listen(3000, () => console.log('Servidor corriendo en el puerto 3000'));