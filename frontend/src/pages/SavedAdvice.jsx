import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import AdviceCard from '../components/AdviceCard';

const SavedAdvice = () => {
  const { savedAdvice, backendUrl, token } = useContext(AppContext);
  const [adviceList, setAdviceList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSaved = async () => {
      setLoading(true);
      try {
        const res = await axios.post(`${backendUrl}/api/advice/list-many`, {
          adviceIds: savedAdvice
        }, {
          headers: { token }
        });

        if (res.data.success) {
          setAdviceList(res.data.advice || []);
        }
      } catch (err) {
        console.error('Хадгалсан зөвлөгөө ачааллахад алдаа:', err);
      } finally {
        setLoading(false);
      }
    };

    if (savedAdvice.length > 0) {
      fetchSaved();
    } else {
      setAdviceList([]);
      setLoading(false);
    }
  }, [savedAdvice]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">📌 Хадгалсан зөвлөгөөнүүд</h1>

      {loading ? (
        <p>Уншиж байна...</p>
      ) : adviceList.length === 0 ? (
        <p>Та одоогоор ямар ч зөвлөгөө хадгалаагүй байна.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {adviceList.map((advice) => (
            <AdviceCard key={advice._id} {...advice} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedAdvice;
