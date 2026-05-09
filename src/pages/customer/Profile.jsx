import { useEffect, useState } from 'react';
import {api} from '../../services/api';
import { useNavigate } from 'react-router-dom';
// Static data for now, nanti dari API
const dummyUser = {
    name: 'Fahmi',
    email: 'fahmi@example.com'
};

export default function Profile() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        setUser(dummyUser);
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-4">
            <h1 className="text-2xl font-bold text-orange-500 mb-4">Profile</h1>
            {user && (
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <p className="text-lg font-semibold">{user.name}</p>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            )}
        </div>
    );
}
