import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Upload() {
    const [file, setFile] = useState(null)
    const [status, setStatus] = useState('idle') // idle | scanning | done | submitting
    const [form, setForm] = useState({ code: '', name: '', examType: '', year: '' })
    const navigate = useNavigate()

    function handleFileChange(e) {
        const selected = e.target.files[0]
        if (!selected) return
        setFile(selected)
        setStatus('scanning')

        // Simulated AI auto-tagging — a real version would send the PDF to a backend/model.
        setTimeout(() => {
            setForm({ code: 'CST303', name: 'Computer Networks', examType: 'University Exam', year: '2024' })
            setStatus('done')
        }, 1500)
    }

    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    async function handleSubmit(e) {
        e.preventDefault()
        setStatus('submitting')

        const data = new FormData()
        data.append('file', file)
        data.append('code', form.code.toUpperCase())
        data.append('name', form.name)
        data.append('examType', form.examType)
        data.append('year', form.year)

        await fetch('http://localhost:5000/api/papers', {
            method: 'POST',
            body: data,
        })

        alert('Uploaded! Thanks for contributing.')
        setFile(null)
        setStatus('idle')
        setForm({ code: '', name: '', examType: '', year: '' })
        navigate(`/subject/${form.code.toUpperCase()}`)
    }

    return (
        <main className="flex-1 pb-24 p-4">
            <h1 className="text-xl font-bold mb-4">Upload a Paper</h1>

            {!file && (
                <label className="block border-2 border-dashed border-outline-variant rounded-xl p-8 text-center cursor-pointer">
                    <span className="material-symbols-outlined text-outline" style={{ fontSize: 40 }}>upload_file</span>
                    <p className="text-sm text-on-surface-variant mt-2">Tap to choose a PDF (max 10MB)</p>
                    <input type="file" accept="application/pdf" className="hidden" onChange={handleFileChange} />
                </label>
            )}

            {status === 'scanning' && (
                <div className="text-center mt-6">
                    <p className="text-sm text-on-surface-variant">Scanning paper...</p>
                </div>
            )}

            {(status === 'done' || status === 'submitting') && (
                <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                    <div>
                        <label className="text-sm font-semibold flex items-center gap-2">
                            Subject Code <span className="text-xs text-primary font-normal">AI suggested</span>
                        </label>
                        <input
                            name="code"
                            value={form.code}
                            onChange={handleChange}
                            className="w-full mt-1 border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold flex items-center gap-2">
                            Subject Name <span className="text-xs text-primary font-normal">AI suggested</span>
                        </label>
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            className="w-full mt-1 border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold">Exam Type</label>
                        <input
                            name="examType"
                            value={form.examType}
                            onChange={handleChange}
                            className="w-full mt-1 border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold">Year</label>
                        <input
                            name="year"
                            value={form.year}
                            onChange={handleChange}
                            className="w-full mt-1 border border-outline-variant rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={status === 'submitting'}
                        className="bg-primary text-white font-semibold py-3 rounded-lg mt-2 disabled:opacity-50"
                    >
                        {status === 'submitting' ? 'Uploading...' : 'Submit'}
                    </button>
                </form>
            )}
        </main>
    )
}

export default Upload