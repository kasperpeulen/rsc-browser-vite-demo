export async function getAllUsers() {
  const users: { id: number; name: string }[] = await fetch(
    "https://jsonplaceholder.typicode.com/users",
  ).then((response) => response.json());

  return users;
}
