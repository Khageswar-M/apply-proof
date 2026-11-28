
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import applicationService from '../../../../../../services/applicationService';
import { setAppliedApplications } from '../../../../../redux/appSlice';

const dateFilters = [
    'All',
    'Latest',
    'Last Week',
    'Last Month',
    'Last 6 Months',
    'Last Year',
];

const statuses = [
    'All',
    'Applied',
    'Recruiter Call',
    'Assessment',
    'Final Discussion',
    'Offer',
    'Rejected',
];


const DEFAULT_USER_ID = 'a12f5e90-7b3c-4d81-9a62-1f8e0c5b7d30';


const Filters = ({
    totalApplications = 18,
    onFilterChange,
}) => {

    const dispatch = useDispatch();

    const [activeFilter, setActiveFilter] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');

    const filterApplications = async (active) => {
        try {
            let res;

            switch (active) {
                case 'All':
                    res = await applicationService.getApplicationsByUserId(DEFAULT_USER_ID, 0, 10);
                    break;

                case 'Latest':
                    res = await applicationService.filterLatestApplications(DEFAULT_USER_ID);
                    break;

                case 'Last Week':
                    res = await applicationService.filterLastWeekApplications(DEFAULT_USER_ID);
                    break;

                case 'Last Month':
                    res = await applicationService.filterLastMonthApplications(DEFAULT_USER_ID);
                    break;

                case 'Last 6 Months':
                    res = await applicationService.filterLastSixMonthApplications(DEFAULT_USER_ID);
                    break;

                case 'Last Year':
                    res = await applicationService.filterLastYearApplications(DEFAULT_USER_ID);
                    break;

                default:
                    return;
            }

            console.log("RES: ", res);
            const list = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data?.content)
                    ? res.data.content
                    : [];
            dispatch(setAppliedApplications(list))
        } catch (error) {
            console.log('Data filtering failed: ', error);
        }
    }

    const handleDateFilter = (filter) => {
        setActiveFilter(filter);

        onFilterChange?.({
            dateFilter: filter,
            status: selectedStatus,
        });

        filterApplications(activeFilter);
    };

    const handleStatusFilter = (status) => {
        setSelectedStatus(status);

        onFilterChange?.({
            dateFilter: activeFilter,
            status,
        });
    };

    return (
        <div className="flex w-full flex-wrap items-center justify-between gap-3">

            {/* Date Filters */}
            <div className="flex flex-wrap items-center gap-1.5">

                {dateFilters.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        onClick={() => handleDateFilter(filter)}
                        className={`cursor-pointer rounded-md border px-2.5 py-1.5 text-[10px] font-medium transition-colors ${activeFilter === filter
                            ? 'border-teal-700 bg-teal-700 text-white'
                            : 'border-stone-200 bg-white text-slate-600 hover:border-teal-200 hover:bg-teal-50'
                            }`}
                    >
                        {filter}
                    </button>
                ))}

            </div>

            {/* Status Filter */}
            <div className="relative flex shrink-0 items-center">

                <span className="material-symbols-outlined pointer-events-none absolute left-3 text-[15px] text-slate-600">
                    filter_list
                </span>

                <select
                    value={selectedStatus}
                    onChange={(e) => handleStatusFilter(e.target.value)}
                    aria-label="Filter by application status"
                    className="w-full min-w-[170px] cursor-pointer appearance-none rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-8 text-[10px] font-medium text-slate-700 outline-none transition-colors hover:border-stone-300 focus:border-teal-600"
                >
                    {statuses.map((status) => (
                        <option key={status} value={status}>
                            {status === 'All'
                                ? `Filter by Status: All (${totalApplications})`
                                : status
                            }
                        </option>
                    ))}
                </select>

                <span className="material-symbols-outlined pointer-events-none absolute right-2.5 text-[15px] text-slate-500">
                    keyboard_arrow_down
                </span>

            </div>

        </div>
    );
};

export default Filters;
