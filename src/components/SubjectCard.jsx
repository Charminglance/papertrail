import { Link } from 'react-router-dom'

function SubjectCard({ code, name, papers }) {
    return (
        <Link
            to={`/subject/${code}`}
            className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm relative overflow-hidden cursor-pointer active:scale-95 transition-transform block"
        >
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary"></div>
            <div className="flex justify-between items-start mb-1 pl-2">
                <span className="font-mono text-xs bg-surface-container px-2 py-1 rounded">{code}</span>
                <div className="flex items-center text-secondary text-xs">
                    <span className="material-symbols-outlined mr-1" style={{ fontSize: 16 }}>description</span>
                    {papers} Papers
                </div>
            </div>
            <h3 className="text-base font-semibold pl-2 leading-tight">{name}</h3>
        </Link>
    )
}

export default SubjectCard