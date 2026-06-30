import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const EXAM_TYPES = ['University Exam', 'Series Test 1', 'Series Test 2']

function SubjectDetail() {
    const { code } = useParams()
    const [subject, setSubject] = useState(null)
    const [uploadedPapers, setUploadedPapers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        Promise.all([
            fetch(`http://localhost:5000/api/subjects/${code}`).then((res) => res.json()),
            fetch(`http://localhost:5000/api/papers/${code}`).then((res) => res.json()),
        ]).then(([subjectData, papersData]) => {
            setSubject(subjectData.error ? null : subjectData)
            setUploadedPapers(papersData)
            setLoading(false)
        })
    }, [code])

    if (loading) return <main className="flex-1 p-4">Loading...</main>
    if (!subject) return <main className="flex-1 p-4">Subject not found.</main>

    const allPapers = [
        ...subject.papers.map((p) => ({ ...p, isUploaded: false })),
        ...uploadedPapers.map((p) => ({ ...p, isUploaded: true })),
    ]

    return (
        <main className="flex-1 pb-24 p-4">
            <span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{subject.code}</span>
            <h1 className="text-xl font-bold mt-2">{subject.name}</h1>
            <p className="text-xs text-on-surface-variant mt-1 mb-6">
                {subject.department} · Sem {subject.semester} · Scheme {subject.scheme}
            </p>

            {EXAM_TYPES.map((type) => {
                const papers = allPapers.filter((p) => p.examType === type)
                return (
                    <div key={type} className="mb-5">
                        <h2 className="text-sm font-semibold mb-2">{type}</h2>
                        {papers.length === 0 ? (
                            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 flex items-center justify-between">
                                <span className="text-sm text-on-surface-variant">No papers yet</span>
                                <Link to="/requests" className="text-sm font-semibold text-primary">Request this →</Link>
                            </div>
                        ) : (
                            papers.map((p, i) => (
                                <Link
                                    key={p._id || i}
                                    to={p.isUploaded ? `http://localhost:5000${p.fileUrl}` : `/pdf/${subject.code}/${type}/${p.year}`}
                                    target={p.isUploaded ? '_blank' : undefined}
                                    className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 mb-2 flex items-center justify-between block"
                                >
                                    <span className="font-medium text-sm">
                                        {p.year} {p.isUploaded && <span className="text-primary text-xs ml-1">(uploaded)</span>}
                                    </span>
                                    <span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{p.fileSizeKB} KB</span>
                                </Link>
                            ))
                        )}
                    </div>
                )
            })}
        </main>
    )
}

export default SubjectDetail