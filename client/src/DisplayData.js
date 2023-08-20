import React from 'react';
import { useState } from 'react';
import { useQuery, gql, useLazyQuery } from '@apollo/client';

const QUERY_ALL_USERS = gql`
    query GetAllUsers {
        users {
            id
            name
            age
            username
            nationality
        }
    }
`;

const QUERY_ALL_MOVIES = gql`
    query GetAllMovies {
        movies {
           name
        }
    }
`;

const GET_MOVIE_BY_NAME = gql`
    query GetMovieByName($name: String!) {
        movie(name: $name) {
           name
           yearOfPublication
        }
    }
`;

function DisplayData() {

    const [movieSearched, setMovieSearched] = useState('');

    const { data, loading, error } = useQuery(QUERY_ALL_USERS);
    const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
    const [
        fetchMovie,
        { data: movieSearchedData, error: movieError }
    ] = useLazyQuery(GET_MOVIE_BY_NAME);

    if (loading) {
        return <h1>Loading...</h1>
    }

    if (data) {
        console.log(data);
    }

    if (movieError) {
        console.log(movieError);
    }

    return (
        <>
            {data.users &&
                data.users.map((user) => {
                    return (
                        <>
                            <h1>Name: {user.name}</h1>
                            <h1>Username: {user.username}</h1>
                            <h1>Age: {user.age}</h1>
                            <h1>Nationality: {user.nationality}</h1>
                        </>
                    )
                })}

            {movieData && movieData.movies.map((movie) => {
                return (
                    <>
                        <h1>Movie Name: {movie.name}</h1>
                    </>
                )
            })}

            <>
                <input type="text" placeholder="Enter movie name" onChange={(event) => { setMovieSearched(event.target.value) }} />
                <button onClick={
                    () => {
                        fetchMovie({
                            variables: {
                                name: movieSearched
                            }
                        })
                    }
                }>FetchData</button>
                <>
                    {movieSearchedData &&
                        <>
                            <h1>MovieName: {movieSearchedData.movie.name}</h1>
                            <h1>Year of Publication: {movieSearchedData.movie.yearOfPublication}</h1>
                        </>
                    }
                    {movieError && <h1>There was an error fetching data.</h1>}
                </>
            </>
        </>
    )
}

export default DisplayData;