import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SubjectCard from '../components/SubjectCard'

function Home() {
    const [query, setQuery] = useState('')
    const [subjects, setSubjects] = useState([])
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        fetch('http://localhost:5000/api/subjects')
            .then((res) => res.json())
            .then((data) => {
                setSubjects(data)
                setLoading(false)
            })
    }, [])

    function handleSearch(e) {
        e.preventDefault()
        if (query.trim()) navigate(`/search?q=${query}`)
    }

    return (
        <>
            <header className="bg-surface pt-4 px-4 pb-2 sticky top-0 z-40">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-primary">PaperTrail</h1>
                    <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant" style={{ fontSize: 20 }}>person</span>
                    </div>
                </div>

                <form onSubmit={handleSearch} className="relative">
                    <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search subject code or name..."
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-xl py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                </form>
            </header>

            <main className="flex-1 pb-24">
                <section className="p-4 mt-2">
                    <h2 className="text-lg font-semibold mb-4">Trending Subjects</h2>
                    {loading ? (
                        <p className="text-sm text-on-surface-variant">Loading...</p>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {subjects.map((s) => (
                                <SubjectCard key={s.code} code={s.code} name={s.name} papers={s.papers.length} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}

export default Home