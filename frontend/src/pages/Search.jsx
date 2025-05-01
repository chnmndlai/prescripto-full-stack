import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import RelatedDoctors from '../components/RelatedDoctors';

const Search = () => {
  const location = useLocation();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const query = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/doctors/search?q=${query}`);
        setResults(res.data.doctors || []);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Хайлтын үр дүн ачааллаж чадсангүй.');
        setLoading(false);
      }
    };

    if (query) {
      fetchResults();
    }
  }, [query]);

  return (
    <div className='p-6'>
      <h1 className='text-2xl font-semibold mb-4'>“{query}” хайлтын үр дүн</h1>
      {loading && <p>Уншиж байна...</p>}
      {error && <p className='text-red-500'>{error}</p>}
      {!loading && results.length === 0 && <p>Үр дүн олдсонгүй.</p>}
      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
        {results.map((doctor) => (
          <RelatedDoctors key={doctor._id} doctor={doctor} />
        ))}
      </div>
    </div>
  );
};

export default Search;
