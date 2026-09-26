import { PrismaClient, type CategoryType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function slugify(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const BRANDS = ['HP', 'Dell', 'Lenovo', 'ASUS', 'Acer', 'MSI'];

const LAPTOPS: Array<{ brand: string; model: string; series?: string }> = [
  { brand: 'HP', model: '250 G7', series: '250 Series' },
  { brand: 'HP', model: '250 G8', series: '250 Series' },
  { brand: 'HP', model: 'ProBook 450 G6', series: 'ProBook 450' },
  { brand: 'HP', model: 'Pavilion 15-cs', series: 'Pavilion 15' },
  { brand: 'HP', model: 'EliteBook 840 G5', series: 'EliteBook 840' },
  { brand: 'Dell', model: 'Inspiron 15 3567', series: 'Inspiron 3000' },
  { brand: 'Dell', model: 'Inspiron 15 3580', series: 'Inspiron 3000' },
  { brand: 'Dell', model: 'Latitude 5490', series: 'Latitude 5000' },
  { brand: 'Dell', model: 'Vostro 3568', series: 'Vostro 3000' },
  { brand: 'Lenovo', model: 'ThinkPad T480', series: 'ThinkPad T' },
  { brand: 'Lenovo', model: 'IdeaPad 330-15IKB', series: 'IdeaPad 330' },
  { brand: 'Lenovo', model: 'ThinkPad E14', series: 'ThinkPad E' },
  { brand: 'ASUS', model: 'VivoBook X540LA', series: 'VivoBook X540' },
  { brand: 'ASUS', model: 'ZenBook UX430', series: 'ZenBook UX' },
  { brand: 'Acer', model: 'Aspire 3 A315', series: 'Aspire 3' },
  { brand: 'Acer', model: 'Aspire 5 A515', series: 'Aspire 5' },
  { brand: 'MSI', model: 'GF63 Thin', series: 'GF63' }
];

type ProductSeed = {
  name: string;
  reference: string;
  brand: string;
  type: CategoryType;
  priceXof: number;
  comparePriceXof?: number;
  stock: number;
  description: string;
  compatible: string[];
  battery?: {
    voltage: number;
    capacityMah?: number;
    capacityWh?: number;
    cells?: number;
  };
  charger?: {
    watts: number;
    voltage: number;
    amperage: number;
    connector: string;
    isUsbC?: boolean;
  };
};

const PRODUCTS: ProductSeed[] = [
  {
    name: 'Batterie HP HT03XL',
    reference: 'HT03XL',
    brand: 'HP',
    type: 'BATTERIE',
    priceXof: 25000,
    comparePriceXof: 30000,
    stock: 8,
    description:
      "Batterie d'origine compatible HT03XL pour les series HP 250 G7, 250 G8 et Pavilion 15. Cellules Li-ion testees avant expedition.",
    compatible: ['250 G7', '250 G8', 'Pavilion 15-cs'],
    battery: { voltage: 11.55, capacityMah: 3600, capacityWh: 41.04, cells: 3 }
  },
  {
    name: 'Batterie HP RR03XL',
    reference: 'RR03XL',
    brand: 'HP',
    type: 'BATTERIE',
    priceXof: 32000,
    stock: 4,
    description: 'Batterie 3 cellules pour HP ProBook 450 G6 et EliteBook 840 G5.',
    compatible: ['ProBook 450 G6', 'EliteBook 840 G5'],
    battery: { voltage: 11.55, capacityMah: 4210, capacityWh: 48, cells: 3 }
  },
  {
    name: 'Batterie Dell WDX0R',
    reference: 'WDX0R',
    brand: 'Dell',
    type: 'BATTERIE',
    priceXof: 28000,
    stock: 6,
    description: 'Batterie pour Dell Inspiron series 3000 et 5000. Compatible 15 3567 et 15 3580.',
    compatible: ['Inspiron 15 3567', 'Inspiron 15 3580', 'Vostro 3568'],
    battery: { voltage: 11.4, capacityMah: 3500, capacityWh: 42, cells: 3 }
  },
  {
    name: 'Batterie Dell 4YFVG',
    reference: '4YFVG',
    brand: 'Dell',
    type: 'BATTERIE',
    priceXof: 35000,
    stock: 2,
    description: 'Batterie 4 cellules pour Dell Latitude 5490 et gammes professionnelles.',
    compatible: ['Latitude 5490'],
    battery: { voltage: 15.2, capacityMah: 3500, capacityWh: 51, cells: 4 }
  },
  {
    name: 'Batterie Lenovo 01AV427',
    reference: '01AV427',
    brand: 'Lenovo',
    type: 'BATTERIE',
    priceXof: 38000,
    stock: 5,
    description: 'Batterie interne pour ThinkPad T480. Compatible avec le systeme Power Bridge.',
    compatible: ['ThinkPad T480'],
    battery: { voltage: 11.46, capacityMah: 2100, capacityWh: 24, cells: 3 }
  },
  {
    name: 'Batterie Lenovo L18M3P71',
    reference: 'L18M3P71',
    brand: 'Lenovo',
    type: 'BATTERIE',
    priceXof: 30000,
    stock: 0,
    description: 'Batterie pour ThinkPad E14 et IdeaPad 330. Reapprovisionnement sous 5 jours.',
    compatible: ['ThinkPad E14', 'IdeaPad 330-15IKB'],
    battery: { voltage: 11.34, capacityMah: 4000, capacityWh: 45, cells: 3 }
  },
  {
    name: 'Batterie ASUS A31N1601',
    reference: 'A31N1601',
    brand: 'ASUS',
    type: 'BATTERIE',
    priceXof: 24000,
    stock: 7,
    description: 'Batterie 3 cellules pour ASUS VivoBook X540 et series apparentees.',
    compatible: ['VivoBook X540LA'],
    battery: { voltage: 11.1, capacityMah: 3200, capacityWh: 36, cells: 3 }
  },
  {
    name: 'Batterie Acer AL15A32',
    reference: 'AL15A32',
    brand: 'Acer',
    type: 'BATTERIE',
    priceXof: 26000,
    stock: 3,
    description: 'Batterie pour Acer Aspire 3 et Aspire 5. Autonomie restauree comme au premier jour.',
    compatible: ['Aspire 3 A315', 'Aspire 5 A515'],
    battery: { voltage: 14.8, capacityMah: 2800, capacityWh: 41, cells: 4 }
  },
  {
    name: 'Chargeur HP 65W 4.5x3.0mm',
    reference: 'HP-65W-BLUE',
    brand: 'HP',
    type: 'CHARGEUR',
    priceXof: 15000,
    comparePriceXof: 18000,
    stock: 12,
    description:
      'Chargeur 65W embout bleu 4.5 x 3.0 mm pour HP 250, ProBook et Pavilion. Cable secteur inclus.',
    compatible: ['250 G7', '250 G8', 'ProBook 450 G6', 'Pavilion 15-cs'],
    charger: { watts: 65, voltage: 19.5, amperage: 3.33, connector: '4.5 x 3.0 mm' }
  },
  {
    name: 'Chargeur HP 45W USB-C',
    reference: 'HP-45W-USBC',
    brand: 'HP',
    type: 'CHARGEUR',
    priceXof: 18000,
    stock: 6,
    description: 'Chargeur USB-C 45W pour EliteBook et ultrabooks recents.',
    compatible: ['EliteBook 840 G5'],
    charger: { watts: 45, voltage: 20, amperage: 2.25, connector: 'USB-C', isUsbC: true }
  },
  {
    name: 'Chargeur Dell 65W 4.5x3.0mm',
    reference: 'DELL-65W',
    brand: 'Dell',
    type: 'CHARGEUR',
    priceXof: 15000,
    stock: 10,
    description: 'Chargeur 65W pour Dell Inspiron, Vostro et Latitude. Broche centrale.',
    compatible: ['Inspiron 15 3567', 'Inspiron 15 3580', 'Vostro 3568', 'Latitude 5490'],
    charger: { watts: 65, voltage: 19.5, amperage: 3.34, connector: '4.5 x 3.0 mm' }
  },
  {
    name: 'Chargeur Dell 90W 7.4x5.0mm',
    reference: 'DELL-90W',
    brand: 'Dell',
    type: 'CHARGEUR',
    priceXof: 20000,
    stock: 4,
    description: 'Chargeur 90W embout 7.4 x 5.0 mm pour les gammes Dell plus anciennes.',
    compatible: ['Latitude 5490'],
    charger: { watts: 90, voltage: 19.5, amperage: 4.62, connector: '7.4 x 5.0 mm' }
  },
  {
    name: 'Chargeur Lenovo 65W USB-C',
    reference: 'LEN-65W-USBC',
    brand: 'Lenovo',
    type: 'CHARGEUR',
    priceXof: 19000,
    stock: 9,
    description: 'Chargeur USB-C 65W pour ThinkPad T480, E14 et Yoga.',
    compatible: ['ThinkPad T480', 'ThinkPad E14'],
    charger: { watts: 65, voltage: 20, amperage: 3.25, connector: 'USB-C', isUsbC: true }
  },
  {
    name: 'Chargeur Lenovo 65W Slim Tip',
    reference: 'LEN-65W-TIP',
    brand: 'Lenovo',
    type: 'CHARGEUR',
    priceXof: 17000,
    stock: 5,
    description: 'Chargeur Slim Tip rectangulaire pour ThinkPad et IdeaPad compatibles.',
    compatible: ['IdeaPad 330-15IKB'],
    charger: { watts: 65, voltage: 20, amperage: 3.25, connector: 'Slim Tip' }
  },
  {
    name: 'Chargeur ASUS 65W 4.0x1.35mm',
    reference: 'ASUS-65W',
    brand: 'ASUS',
    type: 'CHARGEUR',
    priceXof: 16000,
    stock: 8,
    description: 'Chargeur 65W embout fin 4.0 x 1.35 mm pour VivoBook et ZenBook.',
    compatible: ['VivoBook X540LA', 'ZenBook UX430'],
    charger: { watts: 65, voltage: 19, amperage: 3.42, connector: '4.0 x 1.35 mm' }
  },
  {
    name: 'Chargeur Acer 65W 5.5x1.7mm',
    reference: 'ACER-65W',
    brand: 'Acer',
    type: 'CHARGEUR',
    priceXof: 15000,
    stock: 11,
    description: 'Chargeur 65W pour Acer Aspire 3 et Aspire 5.',
    compatible: ['Aspire 3 A315', 'Aspire 5 A515'],
    charger: { watts: 65, voltage: 19, amperage: 3.42, connector: '5.5 x 1.7 mm' }
  },
  {
    name: 'Chargeur MSI 120W 5.5x2.5mm',
    reference: 'MSI-120W',
    brand: 'MSI',
    type: 'CHARGEUR',
    priceXof: 35000,
    stock: 2,
    description: 'Chargeur 120W pour MSI GF63 Thin et PC portables gaming.',
    compatible: ['GF63 Thin'],
    charger: { watts: 120, voltage: 20, amperage: 6, connector: '5.5 x 2.5 mm' }
  }
];

async function main() {
  console.log('Nettoyage de la base...');
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.stockMovement.deleteMany();
  await prisma.compatibility.deleteMany();
  await prisma.review.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.batterySpec.deleteMany();
  await prisma.chargerSpec.deleteMany();
  await prisma.product.deleteMany();
  await prisma.availabilityRequest.deleteMany();
  await prisma.laptop.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.user.deleteMany();

  console.log('Creation des comptes...');
  const adminEmail = process.env.ADMIN_EMAIL ?? 'admin@powerpc.sn';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'Admin1234!';

  await prisma.user.create({
    data: {
      email: adminEmail.toLowerCase(),
      passwordHash: await bcrypt.hash(adminPassword, 12),
      firstName: 'Admin',
      lastName: 'PowerPC',
      phone: '770000000',
      whatsapp: '770000000',
      role: 'ADMIN'
    }
  });

  await prisma.user.create({
    data: {
      email: 'client@powerpc.sn',
      passwordHash: await bcrypt.hash('Client1234!', 12),
      firstName: 'Awa',
      lastName: 'Diop',
      phone: '771111111',
      whatsapp: '771111111'
    }
  });

  console.log('Creation des categories...');
  const categories = await Promise.all([
    prisma.category.create({ data: { name: 'Batteries PC', slug: 'batteries-pc', type: 'BATTERIE' } }),
    prisma.category.create({ data: { name: 'Chargeurs PC', slug: 'chargeurs-pc', type: 'CHARGEUR' } })
  ]);
  const categoryByType = new Map(categories.map((c) => [c.type, c]));

  console.log('Creation des marques...');
  const brands = await Promise.all(
    BRANDS.map((name) => prisma.brand.create({ data: { name, slug: slugify(name) } }))
  );
  const brandByName = new Map(brands.map((b) => [b.name, b]));

  console.log('Creation des modeles PC...');
  const laptops = await Promise.all(
    LAPTOPS.map((laptop) =>
      prisma.laptop.create({
        data: {
          brandId: brandByName.get(laptop.brand)!.id,
          model: laptop.model,
          series: laptop.series ?? null,
          slug: slugify(`${laptop.brand} ${laptop.model}`)
        }
      })
    )
  );
  const laptopByModel = new Map(laptops.map((l) => [l.model, l]));

  console.log('Creation des produits...');
  for (const item of PRODUCTS) {
    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: slugify(`${item.name}-${item.reference}`),
        reference: item.reference,
        description: item.description,
        brandId: brandByName.get(item.brand)!.id,
        categoryId: categoryByType.get(item.type)!.id,
        priceXof: item.priceXof,
        comparePriceXof: item.comparePriceXof ?? null,
        stock: item.stock,
        status: item.stock > 0 ? 'DISPONIBLE' : 'SUR_COMMANDE',
        images: { create: [{ url: '/images/placeholder.svg', alt: item.name, position: 0 }] },
        compatibilities: {
          create: item.compatible
            .map((model) => laptopByModel.get(model))
            .filter((laptop): laptop is NonNullable<typeof laptop> => Boolean(laptop))
            .map((laptop) => ({ laptopId: laptop.id, verified: true }))
        },
        ...(item.battery
          ? {
              batterySpec: {
                create: {
                  voltage: item.battery.voltage,
                  capacityMah: item.battery.capacityMah ?? null,
                  capacityWh: item.battery.capacityWh ?? null,
                  cells: item.battery.cells ?? null,
                  chemistry: 'Li-ion',
                  isInternal: true,
                  warranty: '6 mois'
                }
              }
            }
          : {}),
        ...(item.charger
          ? {
              chargerSpec: {
                create: {
                  watts: item.charger.watts,
                  voltage: item.charger.voltage,
                  amperage: item.charger.amperage,
                  connector: item.charger.connector,
                  isUsbC: item.charger.isUsbC ?? false,
                  cableType: 'Cable secteur inclus',
                  warranty: '6 mois'
                }
              }
            }
          : {})
      }
    });

    if (item.stock > 0) {
      await prisma.stockMovement.create({
        data: {
          productId: product.id,
          type: 'IN',
          quantity: item.stock,
          reason: 'Stock initial'
        }
      });
    }
  }

  console.log('Creation des avis...');
  const ht03xl = await prisma.product.findUnique({ where: { reference: 'HT03XL' } });
  const dell65w = await prisma.product.findUnique({ where: { reference: 'DELL-65W' } });
  const lenAdapter = await prisma.product.findUnique({ where: { reference: 'LEN-65W-USBC' } });

  const demoReviews: Array<{ productId?: string; customerName: string; rating: number; comment: string }> = [
    {
      productId: ht03xl?.id,
      customerName: 'Moussa Sarr',
      rating: 5,
      comment: 'Livraison rapide et batterie identique a l\'originale. Tient bien la charge.'
    },
    {
      productId: ht03xl?.id,
      customerName: 'Aida Ba',
      rating: 4,
      comment: 'Bon produit, un peu plus long a charger que prevu mais fonctionne parfaitement.'
    },
    {
      productId: dell65w?.id,
      customerName: 'Ibrahima Diallo',
      rating: 5,
      comment: 'Chargeur conforme, cable de bonne longueur. Recommande.'
    },
    {
      productId: lenAdapter?.id,
      customerName: 'Khady Fall',
      rating: 4,
      comment: 'Compatible avec mon ThinkPad sans probleme.'
    }
  ];

  for (const review of demoReviews) {
    if (!review.productId) continue;
    await prisma.review.create({
      data: {
        productId: review.productId,
        customerName: review.customerName,
        rating: review.rating,
        comment: review.comment
      }
    });
  }

  console.log('Creation de demandes de disponibilite...');
  await prisma.availabilityRequest.createMany({
    data: [
      {
        customerName: 'Moussa Fall',
        phone: '775554433',
        whatsapp: '775554433',
        brandName: 'HP',
        laptopModel: 'ProBook 440 G5',
        type: 'BATTERIE',
        message: 'Ma batterie ne tient plus la charge.'
      },
      {
        customerName: 'Fatou Ndiaye',
        phone: '776667788',
        brandName: 'Toshiba',
        laptopModel: 'Satellite C55',
        type: 'CHARGEUR',
        knownRef: 'PA3917U',
        message: 'Chargeur perdu, urgent.'
      }
    ]
  });

  const counts = await Promise.all([
    prisma.product.count(),
    prisma.laptop.count(),
    prisma.compatibility.count()
  ]);

  console.log(`Termine : ${counts[0]} produits, ${counts[1]} modeles PC, ${counts[2]} compatibilites.`);
  console.log(`Admin : ${adminEmail} / ${adminPassword}`);
  console.log('Client de test : client@powerpc.sn / Client1234!');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
