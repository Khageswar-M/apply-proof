
import React from 'react';

const Head = ({
    totalApplications = 18,
    onViewModes,
    onNewApplication,
}) => {
    return (
        <div className="flex w-full items-center justify-between gap-3">

            {/* Left: Heading */}
            <div className="flex min-w-0 items-baseline gap-2">
                <h1 className="text-lg font-semibold tracking-tight text-slate-900">
                    Applications
                </h1>

                <span className="shrink-0 text-[10px] font-medium text-slate-500">
                    ({totalApplications} total)
                </span>
            </div>


            {/* Right: Actions */}
            <div className="flex shrink-0 items-center gap-1.5 [&_button]:cursor-pointer">

                {/* View Modes */}
                <button
                    onClick={onViewModes}
                    className="shadow flex items-center gap-1.5 rounded-lg  bg-white px-3 py-2 text-[10px] font-medium text-slate-700 transition-colors hover:bg-stone-50"
                >
                    <span className="material-symbols-outlined !text-sm">
                        tune
                    </span>

                    View Modes
                </button>


                {/* New Application */}
                <button
                    onClick={onNewApplication}
                    className="flex items-center gap-1.5 rounded-lg border shadow border-teal-800 bg-teal-700 px-3 py-2 text-[10px] font-semibold text-white shadow-sm transition-colors hover:bg-teal-800"
                >
                    <span className="material-symbols-outlined !text-sm">
                        add
                    </span>

                    New Application
                </button>

            </div>

        </div>
    );
};

export default Head;
