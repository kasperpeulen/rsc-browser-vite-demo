import { Like } from "./like";
import { saveToDb } from "./actions.ts";
import { getAllUsers } from "../lib/api.ts";

export async function Users() {
  const users = await getAllUsers();
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
