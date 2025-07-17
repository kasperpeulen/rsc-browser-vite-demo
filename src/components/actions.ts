"use server";

const db = new Map();

export async function saveToDb(id: number, count: number) {
  db.set(id, count);
  console.log(`saving that ${id} has ${count} likes`);
}
