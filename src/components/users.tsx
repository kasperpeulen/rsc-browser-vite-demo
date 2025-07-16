import { Like } from "./like";
import { saveToDb } from "./actions.ts";

export async function Users() {
  const users: { id: string; name: string }[] = await fetch(
    "https://jsonplaceholder.typicode.com/users",
  ).then((response) => response.json());
  return (
    <ul>
      {users.map((user) => (
        <ul key={user.id}>
          {user.name}
          <Like onLike={saveToDb.bind(null, user.id)} />
        </ul>
      ))}
    </ul>
  );
}
