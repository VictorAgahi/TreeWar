import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { randomUUID } from 'crypto';

interface ParisTreeRecord {
  geo_point_2d?: { lat: number; lon: number };
}
interface ParisApiResponse {
  results?: ParisTreeRecord[];
}

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly dataSource: DataSource) {}

  async seedDatabase() {
    this.logger.log('Démarrage du Seed de la base de données...');

    let seedData: { lat: number; lng: number }[] = [];
    try {
      const response = await fetch(
        'https://opendata.paris.fr/api/explore/v2.1/catalog/datasets/les-arbres/records?limit=100',
      );

      const data = (await response.json()) as ParisApiResponse;

      if (data && data.results) {
        seedData = data.results
          .filter((record: ParisTreeRecord) => record.geo_point_2d)
          .map((record: ParisTreeRecord) => ({
            lat: record.geo_point_2d!.lat,
            lng: record.geo_point_2d!.lon,
          }));
      }
    } catch (e) {
      this.logger.warn('Failed to fetch real trees from Paris API', e);
    }

    if (!seedData || seedData.length === 0) {
      throw new BadRequestException(
        'Impossible de récupérer les arbres de Paris pour le seed.',
      );
    }

    // Clear the DB (order matters due to foreign keys)
    await this.dataSource.query('DELETE FROM "transactions"');
    await this.dataSource.query('DELETE FROM "trees"');
    await this.dataSource.query('DELETE FROM "users"');

    // Create Takima
    const takimaId = randomUUID();
    await this.dataSource.query(
      `INSERT INTO "users" (id, email, username, "passwordHash", credits) VALUES ($1, $2, $3, $4, $5)`,
      [takimaId, 'contact@takima.fr', 'Takima', 'fakehash', 999999],
    );

    // Create other companies
    const companies = [
      'Google',
      'Apple',
      'Microsoft',
      'Amazon',
      'Meta',
      'Netflix',
      'Tesla',
      'SpaceX',
      'Decathlon',
      "L'Oréal",
    ];

    const companyIds: string[] = [];

    for (const name of companies) {
      const id = randomUUID();
      companyIds.push(id);
      await this.dataSource.query(
        `INSERT INTO "users" (id, email, username, "passwordHash", credits) VALUES ($1, $2, $3, $4, $5)`,
        [
          id,
          `contact@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          name,
          'fakehash',
          Math.floor(Math.random() * 50000) + 10000,
        ],
      );
    }

    let coordinateIndex = 0;
    const getCoordinate = () => {
      const coord = seedData[coordinateIndex % seedData.length];
      coordinateIndex++;
      return coord;
    };

    // Seed trees for Takima (to be #1)
    for (let i = 0; i < 50; i++) {
      const treeId = randomUUID();
      const price = i === 0 ? 50000 : Math.floor(Math.random() * 500) + 100; // First tree is extremely expensive
      const name = i === 0 ? "Arbre d'Or Takima" : `Chêne Takima ${i}`;
      const { lat, lng } = getCoordinate();

      await this.dataSource.query(
        `INSERT INTO "trees" (id, name, price, "ownerId", location) VALUES ($1, $2, $3, $4, ST_SetSRID(ST_Point($5, $6), 4326))`,
        [treeId, name, price, takimaId, lng, lat],
      );

      await this.dataSource.query(
        `INSERT INTO "transactions" (action, "itemType", "itemId", "itemName", price, lat, lng, "userId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        ['BUY', 'TREE', treeId, name, price, lat, lng, takimaId],
      );
    }

    // Seed trees for other companies
    for (const companyId of companyIds) {
      const treeCount = Math.floor(Math.random() * 20) + 5; // Between 5 and 24 trees
      for (let i = 0; i < treeCount; i++) {
        const treeId = randomUUID();
        const price = Math.floor(Math.random() * 2000) + 100;
        const name = `Arbre ${i}`;
        const { lat, lng } = getCoordinate();

        await this.dataSource.query(
          `INSERT INTO "trees" (id, name, price, "ownerId", location) VALUES ($1, $2, $3, $4, ST_SetSRID(ST_Point($5, $6), 4326))`,
          [treeId, name, price, companyId, lng, lat],
        );

        await this.dataSource.query(
          `INSERT INTO "transactions" (action, "itemType", "itemId", "itemName", price, lat, lng, "userId") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          ['BUY', 'TREE', treeId, name, price, lat, lng, companyId],
        );
      }
    }

    this.logger.log('Seed terminé avec succès ! Takima domine le monde.');
  }
}
