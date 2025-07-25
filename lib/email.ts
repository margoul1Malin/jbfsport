import nodemailer from 'nodemailer';

// Configuration du transporteur pour privateemail
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'mail.privateemail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true pour le port 465, false pour les autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface ContactEmailData {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Date;
}

export async function sendContactNotification(contactData: ContactEmailData) {
  try {
    // Email de notification pour l'admin
    const adminEmailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
      subject: `[JBF Sport] Nouvelle demande de contact - ${contactData.name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e293b; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">JBF Sport</h1>
            <p style="color: #94a3b8; margin: 5px 0 0 0;">Nouvelle demande de contact</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px;">
            <h2 style="color: #374151; margin-bottom: 20px;">Détails de la demande</h2>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <p><strong>Nom :</strong> ${contactData.name}</p>
              <p><strong>Email :</strong> <a href="mailto:${contactData.email}">${contactData.email}</a></p>
              ${contactData.phone ? `<p><strong>Téléphone :</strong> ${contactData.phone}</p>` : ''}
              <p><strong>Date :</strong> ${contactData.createdAt.toLocaleDateString('fr-FR')} à ${contactData.createdAt.toLocaleTimeString('fr-FR')}</p>
            </div>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px;">
              <h3 style="color: #374151; margin-top: 0;">Message :</h3>
              <p style="line-height: 1.6; color: #4b5563;">${contactData.message}</p>
            </div>
            
            <div style="margin-top: 30px; text-align: center;">
              <a href="mailto:${contactData.email}?subject=Re: Votre demande sur JBF Sport" 
                 style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Répondre directement
              </a>
            </div>
          </div>
          
          <div style="background-color: #374151; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 14px;">
              Demande ID: ${contactData.id}
            </p>
          </div>
        </div>
      `,
    };

    // Email de confirmation pour le client
    const clientEmailOptions = {
      from: process.env.SMTP_USER,
      to: contactData.email,
      subject: 'Confirmation de réception - JBF Sport',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1e293b; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">JBF Sport</h1>
            <p style="color: #94a3b8; margin: 5px 0 0 0;">Merci pour votre message</p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 30px;">
            <h2 style="color: #374151;">Bonjour ${contactData.name},</h2>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Nous avons bien reçu votre message et nous vous remercions pour votre intérêt pour JBF Sport.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Récapitulatif de votre demande :</h3>
              <p style="color: #6b7280; font-style: italic;">"${contactData.message}"</p>
            </div>
            
            <p style="color: #4b5563; line-height: 1.6;">
              Notre équipe reviendra vers vous dans les plus brefs délais, généralement sous 24 heures.
            </p>
            
            <div style="background-color: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #1e40af; margin: 0; font-size: 14px;">
                💡 <strong>Astuce :</strong> Vous pouvez également nous contacter directement par téléphone ou consulter notre catalogue en ligne.
              </p>
            </div>
          </div>
          
          <div style="background-color: #374151; padding: 20px; text-align: center;">
            <p style="color: #94a3b8; margin: 0; font-size: 14px;">
              Merci de faire confiance à JBF Sport pour vos équipements sportifs
            </p>
          </div>
        </div>
      `,
    };

    // Envoyer les deux emails en parallèle
    const [adminResult, clientResult] = await Promise.allSettled([
      transporter.sendMail(adminEmailOptions),
      transporter.sendMail(clientEmailOptions),
    ]);

    // Vérifier les résultats
    const results = {
      adminEmail: adminResult.status === 'fulfilled',
      clientEmail: clientResult.status === 'fulfilled',
      errors: [] as string[],
    };

    if (adminResult.status === 'rejected') {
      results.errors.push(`Erreur email admin: ${adminResult.reason}`);
    }

    if (clientResult.status === 'rejected') {
      results.errors.push(`Erreur email client: ${clientResult.reason}`);
    }

    return results;

  } catch (error) {
    console.error('Erreur lors de l\'envoi des emails:', error);
    throw new Error(`Erreur envoi email: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
  }
}

// Fonction de test de la connexion email
export async function testEmailConnection() {
  try {
    await transporter.verify();
    return { success: true, message: 'Connexion email réussie' };
  } catch (error) {
    console.error('Erreur de connexion email:', error);
    return { 
      success: false, 
      message: `Erreur de connexion: ${error instanceof Error ? error.message : 'Erreur inconnue'}` 
    };
  }
} 