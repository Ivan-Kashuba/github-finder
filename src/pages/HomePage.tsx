import React, {useEffect, useState} from 'react';
import {useLazyGetUserReposQuery, useSearchUsersQuery} from "../store/github/github.api";
import {useDebounce} from "../hooks/debounce";
import RepoCard from "../components/RepoCard";

const HomePage = () => {
    const [search, setSearch] = useState<string>('');
    const [dropdown, setDropdown] = useState(false);
    const debounced = useDebounce(search);
    const {isLoading, data: users, isError} = useSearchUsersQuery(debounced, {
        skip: debounced.length < 3,
        refetchOnFocus: true
    });

    const [fetchRepos, {data: repos, isLoading: areRepoLoading}] = useLazyGetUserReposQuery();
    useEffect(() => {
        setDropdown(debounced.length > 3 && users?.length! > 0)
    }, [debounced, users])


    const clickHandler = (userName: string) => {
        fetchRepos(userName);
        setDropdown(false);
    }
    return (
        <div className="flex justify-center pt-10 mx-auto h-screen w-screen">
            {isError && <p className="text-center text-red-600">Something went wrong...</p>}
            <div className="relative w-[560px]">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    type="text"
                    className="border py-2 px-4 w-full h-[42px] mb-2"
                    placeholder="Search github username..."/>

                {dropdown && <ul
                    className="list-none top-[42px] left-0 right-0 max-h-[200px] shadow-md bg-white overflow-y-scroll">
                    {isLoading && <p className="text-center">Loading...</p>}
                    {users?.map(user => {
                        return <li
                            onClick={() => clickHandler(user.login)}
                            className="py-2 px-4 hover:bg-gray-500 hover:text-white transition-colors cursor-pointer"
                            key={user.id}>
                            {user.login}
                        </li>
                    })}
                </ul>
                }
                <div className="container">
                    {areRepoLoading && <p className="text-center">Repos are loading...</p>}
                    {repos?.map(repo => <RepoCard repo={repo} key={repo.id}/>)}
                </div>
            </div>
        </div>
    );
};

export default HomePage;