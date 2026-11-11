import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

const genreNames = ['Fiction', 'Science', 'History', 'Technology'];

const books = [
  { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Fiction' },
  { title: 'Pride and Prejudice', author: 'Jane Austen', genre: 'Fiction' },
  { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Fiction' },
  { title: 'The Hobbit', author: 'J. R. R. Tolkien', genre: 'Fiction' },
  { title: 'A Brief History of Time', author: 'Stephen Hawking', genre: 'Science' },
  { title: 'Cosmos', author: 'Carl Sagan', genre: 'Science' },
  { title: 'The Selfish Gene', author: 'Richard Dawkins', genre: 'Science' },
  { title: 'Sapiens', author: 'Yuval Noah Harari', genre: 'History' },
  { title: 'Guns, Germs, and Steel', author: 'Jared Diamond', genre: 'History' },
  { title: 'The Silk Roads', author: 'Peter Frankopan', genre: 'History' },
  { title: 'Team Topologies', author: 'Matthew Skelton', genre: 'Technology' },
  { title: 'Clean Code', author: 'Robert C. Martin', genre: 'Technology' },
  { title: 'Designing Data-Intensive Applications', author: 'Martin Kleppmann', genre: 'Technology' },
  { title: 'The Pragmatic Programmer', author: 'David Thomas', genre: 'Technology' },
  { title: "You Don't Know JS", author: 'Kyle Simpson', genre: 'Technology' },
];

async function main() {
  await prisma.book.deleteMany();
  await prisma.genre.deleteMany();

  await prisma.genre.createMany({
    data: genreNames.map((name) => ({ name })),
  });

  const genres = await prisma.genre.findMany();
  const genreIds = new Map(genres.map((genre) => [genre.name, genre.id]));

  await prisma.book.createMany({
    data: books.map(({ title, author, genre }) => ({
      title,
      author,
      genreId: genreIds.get(genre)!,
    })),
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
