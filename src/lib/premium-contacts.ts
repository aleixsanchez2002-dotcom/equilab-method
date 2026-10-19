import "server-only";

/** Contactos privados: configurar solo en el servidor, nunca en variables NEXT_PUBLIC_. */
export function premiumContacts() {
  return [
    { name: "Giovanni Torrens", role: "Doma clásica", phone: process.env.PREMIUM_GIOVANNI_PHONE ?? "" },
    { name: "Alex Ricarte", role: "Preparación física", phone: process.env.PREMIUM_RICARTE_PHONE ?? "" },
  ].filter(contact => /^\+[1-9]\d{7,14}$/.test(contact.phone)).map(contact => ({
    ...contact,
    display: contact.phone.replace(/^\+34(\d{3})(\d{3})(\d{3})$/, "+34 $1 $2 $3"),
    href: `tel:${contact.phone}`,
  }));
}
