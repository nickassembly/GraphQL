import React from 'react';
import { useState } from 'react';
import { useQuery, gql, useLazyQuery, useMutation, refetch } from '@apollo/client';

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

const CREATE_USER_MUTATION = gql`
    mutation CreateUser($input: CreateUserInput!){
        createUser(input: $input) {
            name
            id
        }
    }
`

function DisplayData() {

    const [movieSearched, setMovieSearched] = useState('');

    // Create User States
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [age, setAge] = useState(0);
    const [nationality, setNationality] = useState('');

    const { data, loading, error, refetch } = useQuery(QUERY_ALL_USERS);
    const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
    const [
        fetchMovie,
        { data: movieSearchedData, error: movieError }
    ] = useLazyQuery(GET_MOVIE_BY_NAME);

    const [createUser] = useMutation(CREATE_USER_MUTATION)

    if (loading) {
        return <h1>Loading...</h1>
    }

    return (
        <>
            <>
                <input
                    type="text"
                    placeholder="Name"
                    onChange={(event) => {
                        setName(event.target.value);
                    }} />
                <input
                    type="text"
                    placeholder="Username"
                    onChange={(event) => {
                        setUsername(event.target.value);
                    }} />
                <input
                    type="text"
                    placeholder="Age"
                    onChange={(event) => {
                        setAge(event.target.value);
                    }} />
                <input
                    type="text"
                    placeholder="Nationality"
                    onChange={(event) => {
                        setNationality(event.target.value.toUpperCase());
                    }} />
                <button
                    onClick={() => {
                        createUser({
                            variables: {
                                input:
                                    { name, username, age: Number(age), nationality }
                            }
                        });
                        refetch();
                    }}
                >Create User</button>
            </>
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