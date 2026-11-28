
import { useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setAppliedApplications } from '../../../../../redux/appSlice';
import applicationService from '../../../../../../services/applicationService';

const getApplications = (data) => {
    if (Array.isArray(data?.content)) return data.content;
    
    throw new Error('The server returned an invalid applications list.');
};

const Search = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const requestId = useRef(0);
    const dispatch = useDispatch();
    const userId = 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d30';

    const handleSearch = async (e) => {
        e.preventDefault();
        const companyName = searchTerm.trim();
        const currentRequestId = ++requestId.current;

        setLoading(true);
        setError('');

        try {
            const response = companyName
                ? await applicationService.searchByCompanyName(userId, companyName, 0, 10)
                : await applicationService.getApplicationsByUserId(userId, 0, 10);

            if (!response?.success) {
                throw new Error(response?.message || 'Failed to search applications.');
            }

            const applications = getApplications(response.data);
            if (requestId.current === currentRequestId) {
                dispatch(setAppliedApplications(applications));
                onSearch?.(companyName);
            }
        } catch (searchError) {
            if (requestId.current === currentRequestId) {
                setError(searchError?.message || 'Failed to search applications.');
            }
        } finally {
            if (requestId.current === currentRequestId) {
                setLoading(false);
            }
        }
    };

    return (
        <form
            onSubmit={handleSearch}
            className="flex w-full items-center gap-2"
        >
            {/* Search Input */}
            <div className=" flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2 transition-all focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600/10">

                <span className="material-symbols-outlined shrink-0 text-lg text-slate-400">
                    search
                </span>

                <input
                    type="search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search applications..."
                    aria-label="Search applications by company"
                    className="w-full bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400"
                />

            </div>

            {/* Search Button */}
            <button
                type="submit"
                disabled={loading}
                className="flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg bg-teal-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-teal-800 active:bg-teal-900"
            >
                <span className="material-symbols-outlined text-base">
                    {loading ? 'progress_activity' : 'search'}
                </span>

                {loading ? 'Searching...' : 'Search'}
            </button>

            {error && (
                <p className="sr-only" role="alert">
                    {error}
                </p>
            )}
        </form>
    );
};

export default Search;
