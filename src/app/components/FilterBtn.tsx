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
            className={`rounded border px-3 py-1 text-sm transition ${active
                ? "bg-indigo-50 text-indigo-700"
                : "border-gray-200 hover:bg-gray-100"
                }`}
            onClick={handleClick}
        >
            {children}
        </button>
    );
}