import { Link, useLocation } from 'react-router-dom'

const tabs = [
    { to: '/', label: 'Home', icon: 'home' },
    { to: '/search', label: 'Search', icon: 'search' },
    { to: '/requests', label: 'Requests', icon: 'forum' },
    { to: '/upload', label: 'Upload', icon: 'upload_file' },
    { to: '/profile', label: 'Profile', icon: 'person' },
]

function BottomNav() {
    const location = useLocation()

    return (
        <nav className="bg-surface border-t border-outline-variant fixed bottom-0 left-0 w-full flex justify-around items-center px-4 py-2 md:max-w-md md:left-1/2 md:-translate-x-1/2">
            {tabs.map((tab) => {
                const isActive = location.pathname === tab.to
                return (
                    <Link
                        key={tab.to}
                        to={tab.to}
                        className={`flex flex-col items-center ${isActive ? 'text-primary font-bold' : 'text-secondary'}`}
                    >
                        <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                            {tab.icon}
                        </span>
                        <span className="text-xs mt-1">{tab.label}</span>
                    </Link>
                )
            })}
        </nav>
    )
}

export default BottomNav