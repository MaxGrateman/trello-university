import { Link } from "react-router-dom";

function Header() {

    return(
        <section className="bg-white dark:bg-gray-900 w-full z-1">
            <nav className="grid grid-cols-3 w-full max-w-[98%] p-2 mx-auto">
                <div className='flex items-center justify-between w-96'>
                    <Link to='/'>
                        <h2 className="text-3xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white hover:text-gray-200">Trello-a-like</h2>
                    </Link>
                </div>
            </nav>
        </section>
    )
}

export default Header;