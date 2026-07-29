import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Arthur Milton author database...');

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.book.deleteMany();
  await prisma.post.deleteMany();
  await prisma.video.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.setting.deleteMany();
  await prisma.adminUser.deleteMany();

  // Create Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.create({
    data: {
      email: 'admin@arthurmilton.com',
      passwordHash,
      name: 'Arthur Milton',
    },
  });

  // Create Books
  const saltLightKeeper = await prisma.book.create({
    data: {
      slug: 'the-salt-light-keeper',
      title: 'The Salt Light Keeper',
      subtitle: 'A Novella of Cornish Fog & Solitude',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      synopsis: `In the relentless winter of 1894, solitary lighthouse keeper Thomas Vane is assigned to Lizard Point Beacon. Amidst deafening ocean swells and impenetrable fog, he uncovers a series of unmailed letters sealed in beeswax beneath the floorboards of the lantern room. Written by his vanished predecessor, the letters chronicle a strange, melodic frequency echoing from the submerged granite reefs—and a grief that refuses to remain beneath the high tide mark.`,
      excerpt: `Chapter I: The Beacon Log

The wind does not blow at Lizard Point; it shears. It strips the lichen from the granite walls of the light-tower and leaves behind a fine white brine that tastes of old bone and iron.

For twenty-four days, the foghorn has sounded every ninety seconds. A heavy, rhythmic groan that shakes the oil lamps in their brackets and vibrates through the soles of my boots. Beneath that sound, however, lies another. A low, resonant hum that rises only when the sea retreats beyond the low water mark.

I have checked the glass thrice tonight. The lens is clear of soot, yet the beam cuts no further than twenty paces into the gloom. Whatever is out there does not wish to be lit.`,
      priceInCents: 2400,
      isbn: '978-0-99381-04-1',
      pageCount: 224,
      publicationDate: new Date('2024-09-15'),
      format: 'Hardcover (Embossed Linen)',
      stockQuantity: 42,
      isForSale: true,
      isFeatured: true,
    },
  });

  await prisma.book.create({
    data: {
      slug: 'the-fog-dial-entries',
      title: 'The Fog-Dial Entries',
      subtitle: 'Short Gothic Fiction & Maritime Fragments',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      synopsis: `A evocative collection of seven long stories investigating haunted coastal telegraph stations, abandoned granite quarries, and the fragile quiet of winter fishing villages along the North Cornish cliffs.`,
      excerpt: `From "The Telegraph House at Zennor":

The wire ran directly down into the sea foam. No operator in Penzance had sent a signal across it in forty years, yet every morning at three, the brass arm clicked out the same six letters...`,
      priceInCents: 2800,
      isbn: '978-0-99381-08-9',
      pageCount: 310,
      publicationDate: new Date('2023-03-20'),
      format: 'Hardcover',
      stockQuantity: 28,
      isForSale: true,
      isFeatured: false,
    },
  });

  await prisma.book.create({
    data: {
      slug: 'tide-logs-of-lizard-point',
      title: 'Tide Logs of Lizard Point',
      subtitle: 'Narrative Nonfiction & Coastal Journal',
      coverImage: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=1200&auto=format&fit=crop',
      synopsis: `Part historical tide record, part personal meditation on coastal grief and isolation, Arthur Milton retraces five seasons spent living in a restored cottage above the Atlantic breakers.`,
      excerpt: `The tide calendar of 1888 records thirty-two shipwrecks between Black Head and Porthleven. Yet the coastal people did not speak of disaster; they spoke of harvest.`,
      priceInCents: 1800,
      isbn: '978-0-99381-02-7',
      pageCount: 196,
      publicationDate: new Date('2021-11-10'),
      format: 'Paperback',
      stockQuantity: 65,
      isForSale: true,
      isFeatured: false,
    },
  });

  await prisma.book.create({
    data: {
      slug: 'nocturne-for-a-cornish-beacon',
      title: 'Nocturne for a Cornish Beacon',
      subtitle: 'Selected Poems & Prose Studies',
      coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
      synopsis: `Lyrical, quiet poems exploring weather, maritime terminology, forgotten sea signals, and granite landscapes.`,
      excerpt: `Salt in the mortar,
iron in the sea,
what the fog covers
belongs to thee.`,
      priceInCents: 2200,
      isbn: '978-0-99381-05-8',
      pageCount: 140,
      publicationDate: new Date('2020-05-14'),
      format: 'Hardcover',
      stockQuantity: 15,
      isForSale: true,
      isFeatured: false,
    },
  });

  // Create Blog Posts
  await prisma.post.create({
    data: {
      slug: 'on-the-preservation-of-fog-and-silence',
      title: 'On the Preservation of Fog and Silence',
      content: `<p>Modern fiction is often loud. It rushes to explain, to illuminate every dark corner with artificial daylight. But in Cornwall, daylight is never clean; it is always filtered through fifty yards of sea mist and sea spray.</p>
<p>When writing <em>The Salt Light Keeper</em>, I spent four months sitting at a small window overlooking the Atlantic at Lizard Point. Some days the horizon vanished entirely. There was only the sound of water striking stone. It occurred to me then that silence in fiction is not the absence of words, but the space where the reader's imagination begins to hear the tide.</p>
<blockquote>"The sea does not argue with the land; it simply outlasts it."</blockquote>
<p>In this essay, I examine how 19th-century tide logs preserved an aesthetic of restraint that we desperately need in modern prose today.</p>`,
      excerpt: 'Exploring why quiet Gothic prose relies on what remains unsaid beneath the fog line.',
      coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1200&auto=format&fit=crop',
      readingTime: '6 min read',
      tags: 'Essays, Gothic Literature, Craft',
      status: 'published',
      publishedAt: new Date('2024-10-02'),
    },
  });

  await prisma.post.create({
    data: {
      slug: 'a-history-of-cornish-wreckers-and-beacon-signals',
      title: 'A History of Cornish Wreckers & Beacon Signals',
      content: `<p>For centuries, the cliffs of the Lizard Peninsula were regarded as a graveyard for sailing vessels bound for Bristol or London. Historical legends tell of "wreckers"—locals who tied lanterns to the horns of cows to lure ships onto the sharp reef.</p>
<p>My archival research at the Truro Record Office paints a far more nuanced picture: a community bound by strict maritime customs, salvaging what the Atlantic threw upon their shores as a tragic form of providence.</p>`,
      excerpt: 'Archival notes and tide logs from the Truro Record Office on 19th-century coastal salvage.',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      readingTime: '9 min read',
      tags: 'Research, History, Cornwall',
      status: 'published',
      publishedAt: new Date('2024-06-18'),
    },
  });

  await prisma.post.create({
    data: {
      slug: 'reading-the-winter-atlantic-from-st-judes-cliff',
      title: 'Reading the Winter Atlantic from St. Judes Cliff',
      content: `<p>Winter brings a specific color to the Atlantic off Zennor—not blue or teal, but a translucent slate-black that absorbs the weak afternoon light. It is during these months that the coast reveals its true skeleton.</p>`,
      excerpt: 'Notes on weather, solitude, and winter light on the Atlantic cliffs.',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      readingTime: '4 min read',
      tags: 'Essays, Nature, Winter',
      status: 'published',
      publishedAt: new Date('2024-01-14'),
    },
  });

  // Create Videos
  await prisma.video.create({
    data: {
      title: 'Arthur Milton Reading Excerpt from "The Salt Light Keeper"',
      description: 'Recorded live at the Falmouth Literary Festival inside the historic Seamen’s Mission Chapel.',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      posterFrame: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=1200&auto=format&fit=crop',
    },
  });

  await prisma.video.create({
    data: {
      title: 'The Cornish Coast & Atmospheric Gothic Fiction - Short Documentary',
      description: 'A 10-minute film exploring the sea fog, granite cliffs, and lighthouse archives that inspired Arthur Milton’s fiction.',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      posterFrame: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
    },
  });

  // Create Photos
  await prisma.photo.create({
    data: {
      title: 'Lizard Point Fog Horn at Dawn',
      caption: 'The restored 1890s brass foghorn mounted above the granite seawall.',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop',
      category: 'tide-logs',
    },
  });

  await prisma.photo.create({
    data: {
      title: 'Granite Cliffs of Zennor',
      caption: 'High tide breakers crashing against the slate shelf near the telegraph house.',
      url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200&auto=format&fit=crop',
      category: 'gallery',
    },
  });

  await prisma.photo.create({
    data: {
      title: 'Writing Desk & 1890s Tide Journal',
      caption: 'Arthur Milton’s writing study overlooking the ocean, featuring beeswax-sealed logbooks.',
      url: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop',
      category: 'research',
    },
  });

  await prisma.photo.create({
    data: {
      title: 'Storm Waves at Godrevy Lighthouse',
      caption: 'Winter gale blowing fifty knots off the Bristol Channel.',
      url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?q=80&w=1200&auto=format&fit=crop',
      category: 'gallery',
    },
  });

  // Create Site Settings
  await prisma.setting.createMany({
    data: [
      { key: 'bio_heading', value: 'Author & Chronicler of Coastal Gothic Realism' },
      { key: 'bio_body', value: 'Arthur Milton was born in Cornwall and educated at Oxford. For over two decades, he has lived in a remote stone cottage on the Lizard Peninsula, writing fiction that explores the quiet intersections of weather, grief, and maritime history. His books have been translated into twelve languages and shortlisted for the Royal Society of Literature Award.' },
      { key: 'facebook_url', value: 'https://facebook.com/arthurmiltonauthor' },
      { key: 'instagram_url', value: 'https://instagram.com/arthurmilton_books' },
      { key: 'tiktok_url', value: 'https://tiktok.com/@arthurmilton_writer' },
      { key: 'press_contact_email', value: 'press@arthurmilton.com' },
      { key: 'agent_info', value: 'Represented by Eleanor Vance at Apex Literary Agency, London.' },
    ],
  });

  // Create a Sample Order
  const sampleOrder = await prisma.order.create({
    data: {
      stripeSessionId: 'cs_test_sample_session_123',
      customerName: 'Eleanor Vance',
      customerEmail: 'eleanor@vanceliterary.co.uk',
      shippingAddress: '42 High Street, St Ives, Cornwall, TR26 1RS, UK',
      personalization: 'Please dedicate to Eleanor with best regards.',
      totalAmountCents: 2400,
      status: 'paid',
      trackingNumber: 'GB123456789ROYAL',
      items: {
        create: {
          bookId: saltLightKeeper.id,
          quantity: 1,
          price: 2400,
        },
      },
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
