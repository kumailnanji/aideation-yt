function Placeholder() {
    return (
        <svg className="absolute inset-0 w-full stroke-gray-900/10" fill="none">
            <defs>
                <pattern id="pattern-1526ac66-f54a-4681-8fb8-0859d412f251" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                    <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                </pattern>
            </defs>
            <rect stroke="none" fill="url(#pattern-1526ac66-f54a-4681-8fb8-0859d412f251)" width="100%" height="100%"></rect>
        </svg>
    )
}


export default function Page() {

    return (
        <div className="min-h-screen flex flex-col">
    <div className='bg-blue-700 px-8 flex items-center justify-between py-4 shadow-sm text-white'> App Bar </div>
    <div className='relative flex flex-grow'>
        <nav className='bg-white shadow-sm p-6 space-y-6 w-64'> Navbar </nav>
        <main className='bg-gray-100 flex-1 p-6'> Content will go here </main>
    </div>
</div>
    )

};

