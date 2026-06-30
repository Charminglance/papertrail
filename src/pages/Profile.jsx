import { Link } from 'react-router-dom'

function Profile() {
    return (
        <main className="flex-1 pb-24 p-4">
            <div className="flex flex-col items-center mt-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 32 }}>person</span>
                </div>
                <p className="font-semibold mt-2">Anonymous User</p>
            </div>

            <div className="flex flex-col gap-2">
                <Link to="/offline" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm font-medium">Offline Library</span>
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>chevron_right</span>
                </Link>
                <Link to="/requests" className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between">
                    <span className="text-sm font-medium">My Requests</span>
                    <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 18 }}>chevron_right</span>
                </Link>
            </div>
        </main>
    )
}

export default Profile