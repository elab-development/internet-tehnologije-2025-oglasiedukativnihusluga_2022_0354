export default function FilterBtn({
    active,
    children,
    handleClick,
}: {
    active: boolean;
    children: React.ReactNode;
    handleClick: () => void;
}
) {
    return (
        <button
            className={`rounded border px-3 py-1 text-sm font-medium transition ${active
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-gray-400 text-gray-800 hover:bg-gray-100"
                }`}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}