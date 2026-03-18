import { PrismaClient, EventType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const templates = [
    {
      name: 'Bautizo',
      eventType: EventType.BAUTIZO,
      previewImageUrl: null,
      defaultSettings: {
        colors: { primary: '#2D6CDF', background: '#F7FAFF', text: '#0F172A' },
        font: { heading: 'Poppins', body: 'Inter' },
        radius: 16,
      },
      defaultSections: {
        countdown: true,
        location: true,
        gallery: true,
        schedule: true,
        music: false,
        gifts: true,
        rsvp: true,
      },
    },
    {
      name: 'Cumpleaños',
      eventType: EventType.CUMPLEANOS,
      previewImageUrl: null,
      defaultSettings: {
        colors: { primary: '#FF3D71', background: '#FFF5F8', text: '#111827' },
        font: { heading: 'Montserrat', body: 'Inter' },
        radius: 20,
      },
      defaultSections: {
        countdown: true,
        location: true,
        gallery: true,
        schedule: true,
        music: true,
        gifts: false,
        rsvp: true,
      },
    },
    {
      name: 'Matrimonio Elegante',
      eventType: EventType.MATRIMONIO,
      previewImageUrl: null,
      defaultSettings: {
        colors: { primary: '#CFAE70', background: '#FAF7F2', text: '#1F2937' },
        font: { heading: 'Playfair Display', body: 'Inter' },
        radius: 18,
      },
      defaultSections: {
        countdown: true,
        location: true,
        gallery: true,
        schedule: true,
        music: true,
        gifts: true,
        rsvp: true,
      },
    },
    {
      name: 'Baby Shower',
      eventType: EventType.BABY_SHOWER,
      previewImageUrl: null,
      defaultSettings: {
        colors: { primary: '#7C3AED', background: '#F7F2FF', text: '#111827' },
        font: { heading: 'Nunito', body: 'Inter' },
        radius: 20,
      },
      defaultSections: {
        countdown: true,
        location: true,
        gallery: true,
        schedule: true,
        music: false,
        gifts: true,
        rsvp: true,
      },
    },
    {
      name: 'Fiesta',
      eventType: EventType.FIESTA,
      previewImageUrl: null,
      defaultSettings: {
        colors: { primary: '#111827', background: '#F9FAFB', text: '#111827' },
        font: { heading: 'Inter', body: 'Inter' },
        radius: 14,
      },
      defaultSections: {
        countdown: true,
        location: true,
        gallery: true,
        schedule: true,
        music: true,
        gifts: false,
        rsvp: true,
      },
    },
  ];

  for (const t of templates) {
    await prisma.template.upsert({
      where: { name: t.name },
      update: {},
      create: t,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
