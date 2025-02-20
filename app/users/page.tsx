"use client";
import { useEffect, useState } from "react";
import { getUsers } from "../actions";

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        getUsers().then(({ data }) => setUsers(data || []));
    }, []);

    return (
        <div>
            <h1>Users</h1>
            {users.map((user) => (
                <div key={user.id}>{user.email}</div>
            ))}
        </div>
    );
}
